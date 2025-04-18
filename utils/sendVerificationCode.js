import mailjet from 'node-mailjet';

const mail = mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);


const sendVerificationMail = async (email, token) => {
  console.log('Sending verification email with token:', token);  // Add logging to ensure token is correct
  const request = mail.post('send', { version: 'v3.1' }).request({
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

export default sendVerificationMail;
