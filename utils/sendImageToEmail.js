const nodemailer = require('nodemailer');

module.exports.sendImageToEmail = async (email, attachments) => {
    const transporter = nodemailer.createTransport({
        service: 'Zoho',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });
    const mailOptions = {
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: 'Bingo', // Subject line
        html: `<div>Let's play bingo!</div>`, // plain text body
        attachments
    };
    await transporter.sendMail(mailOptions);
}