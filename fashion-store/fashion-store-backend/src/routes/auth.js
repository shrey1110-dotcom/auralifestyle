// src/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import OtpToken from '../models/OtpToken.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

const router = express.Router();

/** build transporter once */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 465),
  secure: process.env.EMAIL_SECURE?.toString() !== 'false',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/** helper: 4-digit OTP as a string */
const genOtp = () => String(Math.floor(1000 + Math.random() * 9000));

/**
 * POST /api/auth/request-otp
 * body: { email, name? }
 */
router.post('/request-otp', async (req, res) => {
  try {
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // generate OTP
    const otp = genOtp();

    // upsert user (optional; we set name on first time)
    const user = await User.findOneAndUpdate(
      { email },
      { $setOnInsert: { email, name: name || 'Customer' } },
      { new: true, upsert: true }
    );

    // make sure we don't keep multiple OTPs for same email
    await OtpToken.deleteMany({ email });

    // store OTP with TTL
    await OtpToken.create({
      email,
      otp, // <-- IMPORTANT: we are saving "otp" field expected by schema
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // email it
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your AuraLifestyle verification code',
      text: `Your verification code is ${otp}. It will expire in 10 minutes.`,
      html: `<p>Your verification code is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
    });

    return res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error('request-otp error:', err);
    return res.status(500).json({
      error: 'Failed to send OTP',
      detail: err?.message,
    });
  }
});

/**
 * POST /api/auth/verify-otp
 * body: { email, code }
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

    const token = await OtpToken.findOne({ email }).sort({ createdAt: -1 });
    if (!token) return res.status(400).json({ error: 'No OTP found. Please request a new code.' });

    // expired?
    if (token.expiresAt.getTime() < Date.now()) {
      await OtpToken.deleteMany({ email });
      return res.status(400).json({ error: 'OTP expired. Please request a new code.' });
    }

    // match?
    if (token.otp !== String(code)) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    // success -> cleanup token(s)
    await OtpToken.deleteMany({ email });

    // make sure user exists
    const user = await User.findOneAndUpdate(
      { email },
      { $setOnInsert: { email } },
      { new: true, upsert: true }
    );

    // create JWT
    const jwtToken = jwt.sign(
      { sub: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name || 'Customer',
      },
    });
  } catch (err) {
    console.error('verify-otp error:', err);
    return res.status(500).json({ error: 'OTP verification failed', detail: err?.message });
  }
});

export default router;
