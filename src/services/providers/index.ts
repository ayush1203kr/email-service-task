
import express from 'express';

import { EmailService } from './EmailService';


const app = express();
app.use(express.json());

const emailService = new EmailService();


app.get('/', (req, res) => {
    res.status(200).json({ message: 'Email Service API is live and running!', timestamp: new Date().toISOString() });
});

app.post('/send', async (req, res) => {
    const { id, to, subject, body } = req.body;
    if (!id || !to || !subject || !body) {
        return res.status(400).json({ error: 'Missing required fields: id, to, subject, body' });
    }

    
    const success = await emailService.sendEmailWithId(id, to, subject, body);
    res.json({
        success,
        status: emailService.getStatus(id), 
    });
});

const PORT = process.env.PORT || 10000; 
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});