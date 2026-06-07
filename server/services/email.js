import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
})

export const sendResetEmail = async (to, resetLink) => {
  const mailOptions = {
    from: `"MineVertex" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#10B981;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Reset email sent to', to)
  } catch (err) {
    console.error('Error sending email:', err)
  }
}

export const sendOTPEmail = async (to, code) => {
  const mailOptions = {
    from: `"MineVertex" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Your Login/Registration OTP Code',
    html: `
      <h2>Verification Code</h2>
      <p>Your one-time password (OTP) is:</p>
      <h1 style="font-size: 40px; color: #10B981; letter-spacing: 5px;">${code}</h1>
      <p>This code expires in 10 minutes. Do not share it with anyone.</p>
    `
  }
  try {
    await transporter.sendMail(mailOptions)
    console.log('OTP email sent to', to)
  } catch (err) {
    console.error('Error sending OTP email:', err)
    throw new Error('Failed to send email. Please ensure your email settings are correct.')
  }
}

export const sendAdminNotification = async (subject, htmlContent) => {
  try {
    const adminEmail = 'admin@minevertex.com, chamberlain28000@gmail.com'
    await transporter.sendMail({
      from: `"MineVertex Alerts" <${process.env.EMAIL_FROM}>`,
      to: adminEmail,
      subject: `[ADMIN ALERT] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background: #1e293b; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0; color: #10b981;">MineVertex Admin Alert</h2>
          </div>
          <div style="padding: 20px; background: #f8fafc; color: #334155;">
            ${htmlContent}
          </div>
        </div>
      `
    })
  } catch (err) {
    console.error('Admin notification failed:', err)
  }
}

export const sendUserNotification = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"MineVertex" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background: #1e293b; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0; color: #10b981;">MineVertex</h2>
          </div>
          <div style="padding: 20px; background: #f8fafc; color: #334155; line-height: 1.6;">
            ${htmlContent}
            <br><br>
            <p style="margin: 0; font-size: 0.9em; color: #64748b;">If you have any questions, please contact our support team.</p>
          </div>
        </div>
      `
    })
  } catch (err) {
    console.error('User notification failed:', err)
  }
}
