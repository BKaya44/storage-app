const nodemailer = require('nodemailer');

class Mailer {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendVerificationEmail(to, verificationKey) {
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to,
            subject: 'Account Verification',
            text: `Here is your verification key: ${verificationKey}`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Verification email sent to ${to}`);
        } catch (error) {
            console.error(`Failed to send email: ${error}`);
        }
    }
}

module.exports = new Mailer();
