import express from 'express';
import { EmailService } from './EmailService';

const app = express();
app.use(express.json());

const emailService = new EmailService();

app.post('/send', async (req, res) => {
  const { id, to, subject, body } = req.body;
  if (!id || !to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const success = await emailService.sendEmailWithId(id, to, subject, body);
  res.json({
    success,
    status: emailService.getStatus(`${to}-${subject}-${body}`),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
