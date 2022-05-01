//Referenced from: https://edigleyssonsilva.medium.com/how-to-send-emails-securely-using-gmail-and-nodejs-eef757525324

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'diabeasy.noreply@gmail.com',
    pass: 'TotallyDiab0lical',
  },
});
transporter.verify().then(console.log).catch(console.error);