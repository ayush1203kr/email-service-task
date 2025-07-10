export class MockProvider2 {
  async send(email: { id: string; to: string; subject: string; body: string }): Promise<void> {
    // Simulate 90% chance of success
    const isSuccess = Math.random() < 0.9;

    if (!isSuccess) {
      throw new Error('MockProvider2 failed to send email');
    }

    console.log(`MockProvider2: Email sent to ${email.to}`);
  }
}

