const { Resend } = require('resend');
require('dotenv').config();

// ចាប់ផ្តើមដំណើរការ Resend SDK
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * មុខងារផ្ញើអ៊ីមែលជូនដំណឹងទៅកាន់ Admin តាមរយៈ Resend
 * @param {string} toEmail - អ៊ីមែលរបស់ Admin (ទាញចេញពី Database ស្វ័យប្រវត្ត)
 * @param {object} message - { name, email, subject, message }
 */
async function sendContactNotification(toEmail, message) {
    if (!resend) {
        console.log('Email not sent: RESEND_API_KEY is not configured.');
        return;
    }

    if (!toEmail) {
        console.log('Email not sent: No admin email found in profile.');
        return;
    }

    const { name, email, subject, message: body } = message;

    try {
        await resend.emails.send({
            // សម្រាប់គណនី Free (មិនទាន់ភ្ជាប់ Domain) ដាច់ខាតត្រូវប្រើ 'onboarding@resend.dev'
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: toEmail, // សំខាន់៖ គណនី Free អាចផ្ញើទៅបានតែអ៊ីមែលដែលអ្នកប្រើចុះឈ្មោះ Resend ប៉ុណ្ណោះ
            replyTo: email, // ពេលអ្នកចុច Reply វានឹងតបទៅកាន់អ៊ីមែលរបស់អ្នកផ្ញើសារមកវិញ
            subject: `New portfolio message: ${subject || 'No subject'}`,
            html: `
        <div style="font-family: sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Message From Your Portfolio</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject || '(no subject)')}</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">${escapeHtml(body)}</p>
        </div>
      `
        });

        console.log(`Contact notification email sent successfully via Resend to ${toEmail}`);
    } catch (err) {
        // មិនឱ្យ Server គាំង (Crash) ឡើយ ទោះបីជាការផ្ញើអ៊ីមែលបរាជ័យ (ព្រោះទិន្នន័យបានរក្សាទុកក្នុង DB រួចហើយ)
        console.error('Failed to send contact notification email via Resend:', err.message);
    }
}

function escapeHtml(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

module.exports = { sendContactNotification };