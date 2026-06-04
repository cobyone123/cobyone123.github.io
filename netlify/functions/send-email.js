const nodemailer = require('nodemailer');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { user_name, user_email, user_phone, user_message } = JSON.parse(event.body);

    if (!user_name || !user_email || !user_message) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'Missing required fields.' })
        };
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_HOST_USER,
            pass: process.env.EMAIL_HOST_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_HOST_USER,
        subject: `New Contact Form Submission from ${user_name}`,
        text: `Name: ${user_name}\nEmail: ${user_email}\nPhone: ${user_phone || 'Not provided'}\nMessage: ${user_message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Email sent successfully.' })
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Failed to send email.' })
        };
    }
};