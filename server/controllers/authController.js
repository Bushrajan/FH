import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { signInToken } from '../utils/token.js';
import sendVerifyOTP, { sendForgetPassword } from '../utils/nodemail.js';
import jwt from 'jsonwebtoken';


// Register user
export const register = async (req, res) => {
  try {
    const { name , email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = new User({

      password: hashedPassword,
      ...req.body
    });
    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    // Generate JWT token
    const token = signInToken(user);

    //send OTP via email

    await sendVerifyOTP(user.email, otp);

    res.status(201).json({
      success: true,
      message: "User registered successfully. OTP sent to email.",
      userId: user._id,
      otp,
      user,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: 'Please verify your email first' });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = signInToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      isVerified:user.isVerified,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log("Email:", email, "OTP:", otp);


  try {

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }
    console.log("User found:", user);

    // Check if OTP is valid and not expired
    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }


    // Update user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Forget Password
export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({ success: false, message: 'User not found' });
  }

  // reset token
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
  // create reset URL
  const resetURL = `${process.env.CLIENT_URL}/resetPassword?token=${resetToken}`;

  try {
    // send email with reset URL
    await sendForgetPassword(user.email, resetURL);

    res.status(200).json({ success: true, message: "Password reset email sent successfully!" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Email send Failed", error: error.message });

  }
}

// Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
};
