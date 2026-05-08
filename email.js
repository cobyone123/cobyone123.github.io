require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD
    }
});

app.post('/send-email', (req, res) => {
    const { user_name, user_email, user_phone, user_message } = req.body;

    if (!user_name || !user_email || !user_message) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_HOST_USER,
        subject: `New Contact Form Submission from ${user_name}`,
        text: `Name: ${user_name}\nEmail: ${user_email}\nPhone: ${user_phone || 'Not provided'}\nMessage: ${user_message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'Failed to send email.' });
        }
        console.log('Email sent:', info.response);
        return res.status(200).json({ success: true, message: 'Email sent successfully.' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));