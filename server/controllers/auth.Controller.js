import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailtempelete.js';


const renderTemplate = (template, data = {}) => {
  let html = template;
  for (const [key, value] of Object.entries(data)) {
    const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g'); 
    html = html.replace(pattern, String(value ?? ''));
  }
  return html;
};


export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: 'Missing Details' });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,       
      sameSite: "none",    
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Send Welcome Email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to Rajan',
      html: `<h2>Welcome to Rajan 👋</h2>
             <p>Your account has been created successfully with email: <b>${email}</b>.</p>`
    });

    return res.json({ success: true });

  } catch (error) {
    console.log('Error during registration:', error);
    return res.json({ success: false, message: error.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,        
      sameSite: "none",    
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,        
      sameSite: "none",    
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const sendVerifyOtp = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.isAccountVerified) return res.json({ success: false, message: "Account already verified" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const html = renderTemplate(EMAIL_VERIFY_TEMPLATE, {
      username: user.name || user.email,
      OTP_CODE: otp,
      verification_link: process.env.VERIFY_REDIRECT_URL || '#'
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account Verification OTP',
      html
    });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: 'Both userId and OTP are required' });
  }

  try {
    const user = await userModel.findById(userId).select('+verifyOtp +verifyOtpExpireAt +isAccountVerified');
    if (!user) return res.json({ success: false, message: 'User not found' });

    if (!user.verifyOtp || String(user.verifyOtp).trim() !== String(otp).trim()) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    if (new Date(user.verifyOtpExpireAt) < new Date()) {
      return res.json({ success: false, message: 'OTP has expired' });
    }

    user.isAccountVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpireAt = undefined;
    await user.save();

    return res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.json({ success: false, message: 'Email is required' });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'User not found' });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const html = renderTemplate(PASSWORD_RESET_TEMPLATE, {
      username: user.name || user.email,
      OTP_CODE: otp,
      reset_link: process.env.RESET_REDIRECT_URL || '#'
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP',
      html
    });

    return res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: 'Email, OTP, and new password are required.' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'User not found.' });

    if (!user.resetOtp || String(user.resetOtp).trim() !== String(otp).trim()) {
      return res.json({ success: false, message: 'Invalid OTP.' });
    }

    if (new Date(user.resetOtpExpireAt) < new Date()) {
      return res.json({ success: false, message: 'OTP has expired.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpireAt = undefined;
    await user.save();

    return res.json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
