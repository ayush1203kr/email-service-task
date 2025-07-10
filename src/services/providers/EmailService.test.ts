import { EmailService } from './EmailService';

describe('EmailService', () => {
  const emailService = new EmailService();

  it('should send email successfully', async () => {
    const success = await emailService.sendEmail(
      'test@example.com',
      'Test Subject',
      'Test Body'
    );
    expect(success).toBe(true);
  });

  it('should skip sending duplicate emails (idempotency)', async () => {
    const id = 'unique-email-id';

    const firstTry = await emailService.sendEmailWithId(
      id,
      'test@example.com',
      'Test Subject',
      'Test Body'
    );

    const secondTry = await emailService.sendEmailWithId(
      id,
      'test@example.com',
      'Test Subject',
      'Test Body'
    );

    expect(firstTry).toBe(true);
    expect(secondTry).toBe(false); // should skip duplicate
  });
});
