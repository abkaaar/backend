// const nodemailer = require("nodemailer");

// // Configure Nodemailer with Mailgun SMTP settings
// const transporter = nodemailer.createTransport({
//     host: 'smtp.mailgun.org',      // Mailgun SMTP server
//     port: 587,                     // Use 587 for TLS
//     secure: false,                 // Set to true for port 465, false for other ports
//     auth: {
//       user: process.env.MAILGUN_USER,   // Mailgun SMTP username
//       pass: process.env.MAILGUN_PASS    // Mailgun SMTP password
//     }
//   });


// // Function to send an email
// const sendEmail = async (to, subject, text, html) => {
//     try {
//       const info = await transporter.sendMail({
//         from: '"Allospace" <allospacehq@gmail.com>', // Replace with your verified 'from' email
//         to: email,
//         subject: "Password Reset Request",
//         text: `To reset your password, please use the following link: ${resetToken}`,
//         html: `<p>To reset your password, please use the following link: <a href="${resetToken}">Reset Password</a></p>`
//       });
//       console.log("Message sent: %s", info.messageId);
//       return info;
//     } catch (error) {
//       console.error("Error sending email: %s", error);
//       throw error;
//     }
//   };

// module.exports = sendEmail;

const nodemailer = require("nodemailer");

// Configure Nodemailer with Mailgun SMTP settings
const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILGUN_USER,
        pass: process.env.MAILGUN_PASS
    }
});

// Function to send an email
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const info = await transporter.sendMail({
            from: '"Allospace" <allospacehq@gmail.com>',
            to,          // Use the `to` parameter correctly
            subject,     // Pass the subject parameter
            text,        // Pass the text parameter
            html         // Pass the html parameter
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;
