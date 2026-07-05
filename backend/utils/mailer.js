const nodemailer = require('nodemailer');
require('dotenv').config();

// Reads SMTP settings from .env. Works with Gmail (using an App Password),
// or any other SMTP provider (Mailtrap, SendGrid SMTP, Outlook, etc).
function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null; // email not configured — skip sending silently
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

/**
 * Sends a notification email to the admin's configured contact email
 * whenever a new message is submitted through the public contact form.
 *
 * @param {string} toEmail - the admin's email (read dynamically from the `profile` table)
 * @param {object} message - { name, email, subject, message }
 */
async function sendContactNotification(toEmail, message) {
  const transporter = getTransporter();
  if (!transporter || !toEmail) {
    console.log('Email not sent: SMTP not configured or no admin email set in profile.');
    return;
  }

  const { name, email, subject, message: body } = message;

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
      to: toEmail,
      replyTo: email,
      subject: `New portfolio message: ${subject || 'No subject'}`,
      text: `You received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || '(no subject)'}\n\nMessage:\n${body}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New message from your portfolio</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject || '(no subject)')}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(body)}</p>
        </div>
      `
    });
    console.log(`Contact notification email sent to ${toEmail}`);
  } catch (err) {
    // Don't crash the request if email fails — the message is already saved in the DB.
    console.error('Failed to send contact notification email:', err.message);
  }
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = { sendContactNotification };
