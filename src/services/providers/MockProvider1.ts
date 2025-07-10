export class MockProvider1 {
  async send(email: { id: string; to: string; subject: string; body: string }): Promise<void> {
    // Simulate 70% chance of success
    const isSuccess = Math.random() < 0.7;

    if (!isSuccess) {
      throw new Error('MockProvider1 failed to send email');
    }

    console.log(`MockProvider1: Email sent to ${email.to}`);
  }
}
