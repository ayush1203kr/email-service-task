import { EmailService } from './EmailService';

type EmailRequest = {
  id: string;
  to: string;
  subject: string;
  body: string;
};

export class EmailQueue {
  private queue: EmailRequest[] = [];
  private isProcessing = false;
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    this.emailService = emailService;
  }

  enqueue(email: EmailRequest) {
    this.queue.push(email);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const email = this.queue.shift();
      if (email) {
        console.log(`📬 Processing email: ${email.id}`);
        const success = await this.emailService.sendEmailWithId(
          email.id,
          email.to,
          email.subject,
          email.body
        );
        console.log(success ? `✅ Email sent: ${email.id}` : `❌ Failed to send: ${email.id}`);
      }
    }

    this.isProcessing = false;
  }
}
