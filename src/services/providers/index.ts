

import { EmailService } from './src/services/providers/EmailService.test';
import { EmailQueue } from './EmailQueue';

const emailService = new EmailService();
const emailQueue = new EmailQueue(emailService);


emailQueue.enqueue({
  id: 'email-1',
  to: 'test1@example.com',
  subject: 'Subject 1',
  body: 'Message 1',
});

emailQueue.enqueue({
  id: 'email-2',
  to: 'test2@example.com',
  subject: 'Subject 2',
  body: 'Message 2',
});

emailQueue.enqueue({
  id: 'email-3',
  to: 'test3@example.com',
  subject: 'Subject 3',
  body: 'Message 3',
});
