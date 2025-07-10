"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProvider1 = void 0;
class MockProvider1 {
    async send(email) {
        const isSuccess = Math.random() < 0.7;
        if (!isSuccess) {
            throw new Error('MockProvider1 failed to send email');
        }
        console.log(`MockProvider1: Email sent to ${email.to}`);
    }
}
exports.MockProvider1 = MockProvider1;
