import { MockProvider1 } from './MockProvider1';
import { MockProvider2 } from './MockProvider2';

export class EmailService {
  private provider1 = new MockProvider1();
  private provider2 = new MockProvider2();

  private maxRetries = 3;
  private retryDelay = 500; // in ms
  private rateLimit = 5; // max emails per minute
  private emailsSent: number[] = []; // timestamps in ms
  private sentEmails = new Map<string, boolean>(); // idempotency
  private statusMap = new Map<string, string>(); // tracking

  private failureCount1 = 0;
  private failureCount2 = 0;
  private circuitOpenUntil1 = 0;
  private circuitOpenUntil2 = 0;

  private async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isRateLimited(): boolean {
    const now = Date.now();
    this.emailsSent = this.emailsSent.filter((t) => now - t < 60000);
    return this.emailsSent.length >= this.rateLimit;
  }

  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    const emailId = `${to}-${subject}-${body}`;
    if (this.isRateLimited()) {
      console.warn(`Rate limit exceeded. Email to ${to} not sent.`);
      this.statusMap.set(emailId, 'rate-limited');
      return false;
    }

    const now = Date.now();
    const isCircuit1Open = now < this.circuitOpenUntil1;
    const isCircuit2Open = now < this.circuitOpenUntil2;

    const tryProvider = async (provider: any, name: string, onFail: () => void) => {
      for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
        try {
          console.log(`📨 Attempt ${attempt} using ${name}...`);
          await provider.send({ id: emailId, to, subject, body });
          this.emailsSent.push(Date.now());
          this.statusMap.set(emailId, `sent-via-${name}`);
          console.log(`✅ Sent using ${name}`);
          return true;
        } catch (error) {
          console.warn(`⚠️ ${name} failed attempt ${attempt}:`, error);
          await this.wait(this.retryDelay * attempt); // exponential backoff
        }
      }
      onFail();
      return false;
    };

    let success = false;

    if (!isCircuit1Open) {
      success = await tryProvider(this.provider1, 'Provider1', () => {
        this.failureCount1++;
        if (this.failureCount1 >= 3) {
          this.circuitOpenUntil1 = now + 60000; // 1 minute circuit open
          this.failureCount1 = 0;
          console.warn('🔌 Circuit breaker tripped for Provider1');
        }
      });
    }

    if (!success && !isCircuit2Open) {
      success = await tryProvider(this.provider2, 'Provider2', () => {
        this.failureCount2++;
        if (this.failureCount2 >= 3) {
          this.circuitOpenUntil2 = now + 60000;
          this.failureCount2 = 0;
          console.warn('🔌 Circuit breaker tripped for Provider2');
        }
      });
    }

    if (!success) {
      this.statusMap.set(emailId, 'failed');
      console.error(`❌ Failed to send email to ${to}`);
    }

    return success;
  }

  async sendEmailWithId(id: string, to: string, subject: string, body: string): Promise<boolean> {
    if (this.sentEmails.has(id)) {
      console.log(`⏩ Skipping duplicate send for id: ${id}`);
      return false;
    }

    const success = await this.sendEmail(to, subject, body);
    if (success) this.sentEmails.set(id, true);
    return success;
  }

  getStatus(id: string): string | undefined {
    return this.statusMap.get(id);
  }
}
