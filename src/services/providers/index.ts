import { EmailService } from './EmailService';

const emailService = new EmailService();

emailService
  .sendEmail('test@example.com', 'Hello!', 'This is a test email.')
  .then(success => {
    if (success) {
      console.log('✅ Email sent successfully!');
    } else {
      console.log('❌ Failed to send email.');
    }
  });
