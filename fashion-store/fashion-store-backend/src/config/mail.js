// src/config/mail.js
import nodemailer from 'nodemailer';

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
} = process.env;

export const FROM_EMAIL = EMAIL_FROM || (EMAIL_USER ? `${EMAIL_USER}` : 'auralifestyle01@gmail.com');
export const FROM_NAME = 'AuraLifestyle';

/**
 * getTransporter() - create a transporter instance
 * If EMAIL_HOST provided => explicit SMTP. Otherwise fallback to Gmail service.
 */
export function getTransporter() {
  if (!EMAIL_USER || !EMAIL_PASS) {
    // don't throw at import time — let send functions handle absent creds gracefully
    // but still allow local dev if OTP_ECHO or other dev flags are used
    console.warn('Mail credentials EMAIL_USER / EMAIL_PASS not set — mail will fail if attempted.');
  }

  if (EMAIL_HOST) {
    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT || 587),
      secure: String(EMAIL_SECURE || 'false') === 'true',
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });
  }

  // Gmail fallback (requires app password + 2FA)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
}

// Create a shared transporter instance (will log if creds missing)
export const transporter = getTransporter();

/**
 * orderEmailHTML()
 * Returns a simple HTML invoice summary for order confirmation emails.
 */
export function orderEmailHTML({ displayOrderId, address = {}, items = [], sub = 0, gst = 0, total = 0 }) {
  return `
  <div style="font-family: Arial, sans-serif; color: #111; max-width:700px; margin:auto; padding:20px;">
    <h2 style="margin:0 0 8px;">Order Confirmation — ${displayOrderId}</h2>
    <p style="margin:0 0 12px;">Hi ${address.fullName || 'Customer'},</p>
    <p style="margin:0 0 18px;">Thanks for shopping with <strong>AuraLifestyle</strong>! Here’s your order summary:</p>
    <table style="width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th align="left" style="padding:8px 0; border-bottom:1px solid #eee;">Item</th>
          <th align="right" style="padding:8px 0; border-bottom:1px solid #eee;">Qty</th>
          <th align="right" style="padding:8px 0; border-bottom:1px solid #eee;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${(items || [])
          .map(
            (it) =>
              `<tr>
                 <td style="padding:8px 0; border-bottom:1px solid #f6f6f6;">${it.title || it.name || ''}</td>
                 <td align="right" style="padding:8px 0; border-bottom:1px solid #f6f6f6;">${it.qty || 1}</td>
                 <td align="right" style="padding:8px 0; border-bottom:1px solid #f6f6f6;">₹${it.price || 0}</td>
               </tr>`
          )
          .join('')}
      </tbody>
    </table>
    <div style="margin-top:12px;">
      <div>Subtotal: ₹${sub || 0}</div>
      <div>GST: ₹${gst || 0}</div>
      <div style="font-weight:700; margin-top:6px;">Total: ₹${total || 0}</div>
    </div>
    <hr style="margin:18px 0; border:none; border-top:1px solid #eee;" />
    <div>
      <strong>Ship to</strong>
      <div>${address.address1 || ''} ${address.address2 || ''}</div>
      <div>${address.city || ''} ${address.state || ''} ${address.pincode || ''}</div>
    </div>
    <p style="color:#666; margin-top:18px;">We’ll notify you once your order ships. — The AuraLifestyle Team</p>
  </div>
  `;
}

/**
 * sendOtpEmail(to, code)
 * Sends an OTP email. This function verifies SMTP once (only logs on failure).
 */
export async function sendOtpEmail(to, code) {
  // If SMTP creds missing, throw so caller can fallback to dev OTP echo flow
  if (!EMAIL_USER || !EMAIL_PASS) {
    const msg = 'EMAIL_USER / EMAIL_PASS env not set — cannot send OTP email';
    console.warn(msg);
    throw new Error(msg);
  }

  // verify transporter (only first-time; non-blocking if already warmed)
  try {
    await transporter.verify();
    // console.log('SMTP verify OK');
  } catch (err) {
    console.error('SMTP verify failed:', err && err.message ? err.message : err);
    throw err;
  }

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#111">
      <h2 style="margin:0 0 12px;">Your AuraLifestyle verification code</h2>
      <p style="margin:0 0 16px;">Use the following code to sign in:</p>
      <div style="font-size:28px;letter-spacing:6px;font-weight:700;padding:16px 0;">${code}</div>
      <p style="color:#666;margin:16px 0 0;">This code expires in ${process.env.OTP_TTL_MIN || 10} minutes.</p>
    </div>
  `;

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: 'Your AuraLifestyle verification code',
    html,
  });
}
