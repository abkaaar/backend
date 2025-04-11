const mailjet = require('node-mailjet').apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

const sendVerificationMail = async (email, token) => {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.SENDER_EMAIL,
          Name: 'IBBU Clearance System',
        },
        To: [
          {
            Email: email,
            Name: 'User',
          },
        ],
        Subject: 'Email Verification',
        TextPart: `Your verification code is: ${token}`,
        HTMLPart: `<p>Your verification code is: <strong>${token}</strong></p>`,
      },
    ],
  });

  try {
    const result = await request;
    console.log('Verification email sent:', result.body);
  } catch (error) {
    console.error('Error sending verification email:', error.statusCode, error.message);
  }
};

module.exports = sendVerificationMail;
