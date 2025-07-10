"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EmailService_1 = require("./EmailService");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const emailService = new EmailService_1.EmailService();
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
