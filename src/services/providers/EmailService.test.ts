import { EmailService } from './EmailService';

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
  });

  it('should send email successfully', async () => {
    const success = await emailService.sendEmail(
      'test@example.com',
      'Test Subject',
      'Test Body'
    );
    expect(success).toBe(true);
  });

  it('should prevent duplicate sends (idempotency)', async () => {
    const id = 'unique-test-id';

    const firstSend = await emailService.sendEmailWithId(
      id,
      'test@example.com',
      'Test Subject',
      'Test Body'
    );

    const secondSend = await emailService.sendEmailWithId(
      id,
      'test@example.com',
      'Test Subject',
      'Test Body'
    );

    expect(firstSend).toBe(true);
    expect(secondSend).toBe(false); // Duplicate should be skipped
  });
});
