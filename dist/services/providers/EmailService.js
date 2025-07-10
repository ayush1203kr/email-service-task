"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const MockProvider1_1 = require("./MockProvider1");
const MockProvider2_1 = require("./MockProvider2");
class EmailService {
    constructor() {
        this.provider1 = new MockProvider1_1.MockProvider1();
        this.provider2 = new MockProvider2_1.MockProvider2();
        this.maxRetries = 3;
        this.retryDelay = 500;
        this.rateLimit = 5;
        this.emailsSent = [];
        this.sentEmails = new Map();
        this.statusMap = new Map();
        this.failureCount1 = 0;
        this.failureCount2 = 0;
        this.circuitOpenUntil1 = 0;
        this.circuitOpenUntil2 = 0;
    }
    async wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    isRateLimited() {
        const now = Date.now();
        this.emailsSent = this.emailsSent.filter((t) => now - t < 60000);
        return this.emailsSent.length >= this.rateLimit;
    }
    async sendEmail(to, subject, body) {
        const emailId = `${to}-${subject}-${body}`;
        if (this.isRateLimited()) {
            console.warn(`Rate limit exceeded. Email to ${to} not sent.`);
            this.statusMap.set(emailId, 'rate-limited');
            return false;
        }
        const now = Date.now();
        const isCircuit1Open = now < this.circuitOpenUntil1;
        const isCircuit2Open = now < this.circuitOpenUntil2;
        const tryProvider = async (provider, name, onFail) => {
            for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
                try {
                    console.log(`📨 Attempt ${attempt} using ${name}...`);
                    await provider.send({ id: emailId, to, subject, body });
                    this.emailsSent.push(Date.now());
                    this.statusMap.set(emailId, `sent-via-${name}`);
                    console.log(`✅ Sent using ${name}`);
                    return true;
                }
                catch (error) {
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
                    this.circuitOpenUntil1 = now + 60000;
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
    async sendEmailWithId(id, to, subject, body) {
        if (this.sentEmails.has(id)) {
            console.log(`⏩ Skipping duplicate send for id: ${id}`);
            return false;
        }
        const success = await this.sendEmail(to, subject, body);
        if (success)
            this.sentEmails.set(id, true);
        return success;
    }
    getStatus(id) {
        return this.statusMap.get(id);
    }
}
exports.EmailService = EmailService;
