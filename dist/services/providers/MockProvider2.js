"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProvider2 = void 0;
class MockProvider2 {
    async send(email) {
        // Simulate 90% chance of success
        const isSuccess = Math.random() < 0.9;
        if (!isSuccess) {
            throw new Error('MockProvider2 failed to send email');
        }
        console.log(`MockProvider2: Email sent to ${email.to}`);
    }
}
exports.MockProvider2 = MockProvider2;
