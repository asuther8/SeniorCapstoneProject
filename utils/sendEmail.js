//Referenced from: https://dev.to/cyberwolve/how-to-implement-password-reset-via-email-in-node-js-132m

const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'diabeasy.noreply@gmail.com',
            pass: 'dvnayxucnchhruyu'
        },
        });

        await transporter.sendMail({
            from: 'diabeasy.noreply@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;