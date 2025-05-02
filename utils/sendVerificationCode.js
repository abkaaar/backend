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

const sendForgotPasswordMail = async (email, resetToken) => {
  console.log('Sending password reset email with token:', resetToken);

  // This is the link they will click — make sure your frontend can handle this route
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

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
        Subject: 'Password Reset Request',
        TextPart: `You requested to reset your password. Click the link to reset: ${resetLink}`,
        HTMLPart: `
          <p>You requested to reset your password.</p>
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetLink}">Reset Password</a></p>
          <p>If you did not request this, please ignore this email.</p>
        `,
      },
    ],
  });

  try {
    const result = await request;
    console.log('Password reset email sent:', result.body);
  } catch (error) {
    console.error('Error sending password reset email:', error.statusCode, error.message);
  }
};

// Export both functions as named exports
export { sendVerificationMail, sendForgotPasswordMail };
