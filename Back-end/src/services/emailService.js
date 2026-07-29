import nodemailer from 'nodemailer';

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset OTP - Colo-Candy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0;">Colo-Candy</h1>
            <p style="margin: 5px 0 0 0;">Password Reset Request</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px;">
            <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
              Hello,<br><br>
              You requested to reset your password. Here's your OTP:
            </p>

            <div style="background: #667eea; color: white; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
              <span style="font-size: 48px; letter-spacing: 5px; font-weight: bold;">${otp}</span>
            </div>

            <p style="color: #666; font-size: 14px; margin: 20px 0;">
              This OTP will expire in 15 minutes.
            </p>

            <p style="color: #999; font-size: 12px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>

          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            <p>© 2024 Colo-Candy. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return { success: false, error: error.message };
  }
};

// Send Welcome Email
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Welcome to Colo-Candy!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0;">Welcome to Colo-Candy!</h1>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px;">
            <p style="color: #333; font-size: 16px;">
              Hi ${userName},<br><br>
              Welcome to Colo-Candy! We're excited to have you on board.
            </p>

            <p style="color: #666; font-size: 14px;">
              You can now:
            </p>
            <ul style="color: #666; font-size: 14px;">
              <li>Browse our exclusive collection</li>
              <li>Manage your profile and addresses</li>
              <li>Track your orders</li>
              <li>Enjoy special offers</li>
            </ul>

            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              If you have any questions, feel free to contact our support team.
            </p>
          </div>

          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            <p>© 2024 Colo-Candy. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return { success: false, error: error.message };
  }
};

export default { sendOTPEmail, sendWelcomeEmail };
