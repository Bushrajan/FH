import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test the connection 
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('Email transporter is ready');
  } catch (error) {
    console.error('Email transporter error:', error);
  }
};


const sendVerifyOTP = async (recipientEmail, otpCode) => {
  const mailOptions = {
    from: `"Hijabi_Gallary" <${process.env.EMAIL_USER}>`, // Fixed syntax
    to: recipientEmail,
    subject: 'Verify Your Email - OTP Code',
    html: `
       <div style="max-width: 520px; margin: auto; font-family: 'Segoe UI', sans-serif; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 30px;">
      <h2 style="color: #4CAF50; text-align: center; font-size:30px;">📩 Email Verification</h2>
        <p>Hi there 👋</p> <br>
        <p>We received a request to reset your password for your <strong>Hijabi_Gallary</strong> account.</p>
        <p>Click the secure link below to proceed:</p> <br>
        <div style="word-break: break-all; background: #f0f0f0; padding: 12px; border-radius: 8px; text-align: center;">
        <p style="color: #333; background: #f0f0f0; padding: 10px; border-radius: 5px;">${otpCode}</p>
      </div>
      <br>
        <p class="text-center mb-6">This OTP will expire in <strong style="color: #4CAF50">10 minutes</strong>. <br>
           If you didn’t see this request, <strong style="color: red;">you can't verify your account.</strong> 🛡️</p>
        <p style="text-align: right; color: #06de1c;">— Hijabi_Gallary Team</p>
      </div>

    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    // console.log(' OTP email sent successfully!', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Initialize connection verification
verifyConnection();

export default sendVerifyOTP;




export const sendForgetPassword = async (recipientEmail, resetURL) => {
  const mailOptions = {
    from: `"Hijabi_Gallary" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: 'Reset Password',
    html: ` 
           <div style="max-width: 520px; margin: auto; font-family: 'Segoe UI', sans-serif; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 30px;">
      <h2 style="color: #FF9800; text-align: center; font-size:30px;">🔐 Reset Your Password</h2>
        <p>Hi there 👋</p> <br>
        <p>We received a request to reset your password for your <strong>Hijabi_Gallary</strong> account.</p>
        <p>Click the secure link below to proceed:</p> <br>
        <div style="word-break: break-all; background: #f0f0f0; padding: 12px; border-radius: 8px; text-align: center;">
        <p style="color: #333; background: #f0f0f0; padding: 10px; border-radius: 5px;">${resetURL}</p>
      </div>
      <br>
        <p>This link will expire in <strong>30 minutes</strong>. If you didn’t request this, you can safely ignore it. 🛡️</p>
        <p style="text-align: right; color: #FF9800;">— Hijabi_Gallary Team</p>
      </div>

    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully!', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(' Error sending reset Password:', error);
    throw new Error(`Failed to send reset Password:: ${error.message}`);
  }
};


 