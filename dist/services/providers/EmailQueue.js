"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueue = void 0;
class EmailQueue {
    constructor(emailService) {
        this.queue = [];
        this.isProcessing = false;
        this.emailService = emailService;
    }
    enqueue(email) {
        this.queue.push(email);
        this.processQueue();
    }
    async processQueue() {
        if (this.isProcessing)
            return;
        this.isProcessing = true;
        while (this.queue.length > 0) {
            const email = this.queue.shift();
            if (email) {
                console.log(`📬 Processing email: ${email.id}`);
                const success = await this.emailService.sendEmailWithId(email.id, email.to, email.subject, email.body);
                console.log(success ? `✅ Email sent: ${email.id}` : `❌ Failed to send: ${email.id}`);
            }
        }
        this.isProcessing = false;
    }
}
exports.EmailQueue = EmailQueue;
