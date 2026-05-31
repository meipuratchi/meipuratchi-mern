/**
 * ============================================================
 *  MEIPURATCHI — Email Service
 *  Nodemailer + Gmail SMTP
 *  All email templates live here.
 * ============================================================
 */

const nodemailer = require('nodemailer');

// ── Transporter ──────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,   // 16-char Google App Password
  },
});

// ── Base HTML wrapper ─────────────────────────────────────
function baseTemplate(title, bodyHtml) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#192441 0%,#1a3a6e 100%);padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#f5a623;font-size:22px;font-weight:800;letter-spacing:1px;">மெய் புரட்சி</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">Meipuratchi — Student Career Guidance</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fa;padding:20px 32px;text-align:center;border-top:1px solid #e9ecef;">
            <p style="margin:0;color:#6c757d;font-size:12px;">
              © 2026 Meipuratchi · Built with ❤️ by Young Volunteers<br/>
              Tamil Nadu Government School Students Career Guidance
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Send helper ───────────────────────────────────────────
async function send(to, subject, html) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email] EMAIL_USER or EMAIL_PASS not set — skipping email send');
    return { success: false, error: 'Email not configured' };
  }
  try {
    await transporter.sendMail({
      from: `"Meipuratchi Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[Email] ✅ Sent to ${to} — "${subject}"`);
    return { success: true };
  } catch (err) {
    console.error(`[Email] ❌ Failed to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

// ══════════════════════════════════════════════════════════
//  1. OTP EMAIL
// ══════════════════════════════════════════════════════════
async function sendOTPEmail(toEmail, otpCode, purpose = 'verification') {
  const purposeLabel = {
    login:    'Login Verification',
    register: 'Account Verification',
    verify:   'Email Verification',
    reset:    'Password Reset',
  }[purpose] || 'Verification';

  const body = `
    <h2 style="color:#192441;margin:0 0 8px;">🔐 ${purposeLabel} Code</h2>
    <p style="color:#6c757d;margin:0 0 24px;font-size:14px;">
      Use the code below to complete your ${purposeLabel.toLowerCase()}. 
      This code expires in <strong>10 minutes</strong>.
    </p>

    <div style="background:linear-gradient(135deg,#192441,#1a3a6e);border-radius:12px;padding:28px;text-align:center;margin:0 0 24px;">
      <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Your OTP Code</p>
      <h1 style="color:#f5a623;font-size:42px;font-weight:800;letter-spacing:10px;margin:0;">${otpCode}</h1>
    </div>

    <div style="background:#fff8e1;border-left:4px solid #f5a623;border-radius:0 8px 8px 0;padding:14px 16px;margin:0 0 20px;">
      <p style="margin:0;color:#856404;font-size:13px;">
        ⚠️ Never share this code with anyone. Meipuratchi team will never ask for your OTP.
      </p>
    </div>

    <p style="color:#6c757d;font-size:13px;margin:0;">
      If you did not request this, you can safely ignore this email.
    </p>`;

  return send(toEmail, `${otpCode} — Your Meipuratchi ${purposeLabel} Code`, baseTemplate(purposeLabel, body));
}

// ══════════════════════════════════════════════════════════
//  2. WELCOME EMAIL (new registration)
// ══════════════════════════════════════════════════════════
async function sendWelcomeEmail(toEmail, userName, role = 'student') {
  const roleMsg = role === 'volunteer'
    ? 'Thank you for applying to volunteer with us! Our team will review your application within 48 hours.'
    : role === 'team'
    ? 'You have been added to the Meipuratchi team. Login to your team dashboard to get started.'
    : 'Your career guidance request has been submitted. Our team will review it within 48 hours.';

  const body = `
    <h2 style="color:#192441;margin:0 0 8px;">வணக்கம், ${userName}! 👋</h2>
    <p style="color:#6c757d;margin:0 0 20px;font-size:14px;">Welcome to Meipuratchi — Tamil Nadu's student career guidance platform.</p>

    <div style="background:linear-gradient(135deg,#192441,#1a3a6e);border-radius:12px;padding:24px;color:white;margin:0 0 24px;">
      <p style="margin:0;font-size:15px;line-height:1.6;">${roleMsg}</p>
    </div>

    <h3 style="color:#192441;margin:0 0 12px;font-size:15px;">What happens next?</h3>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${['Our team reviews your details within 48 hours', 'You will receive a status update via email', 'A counselor will contact you for your session', '6 months of follow-up support included'].map((step, i) => `
      <tr>
        <td style="padding:8px 0;vertical-align:top;">
          <span style="display:inline-block;width:24px;height:24px;background:#f5a623;color:#192441;border-radius:50%;text-align:center;line-height:24px;font-weight:700;font-size:12px;margin-right:12px;">${i+1}</span>
          <span style="color:#495057;font-size:14px;">${step}</span>
        </td>
      </tr>`).join('')}
    </table>

    <div style="margin:24px 0 0;text-align:center;">
      <a href="${process.env.FRONTEND_URL || 'https://meipuratchi.netlify.app'}/portal/login"
         style="display:inline-block;background:linear-gradient(135deg,#192441,#1a3a6e);color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;">
        Login to Your Portal →
      </a>
    </div>`;

  return send(toEmail, `Welcome to Meipuratchi, ${userName}! 🎓`, baseTemplate('Welcome', body));
}

// ══════════════════════════════════════════════════════════
//  3. MESSAGE NOTIFICATION (admin/team sent a message)
// ══════════════════════════════════════════════════════════
async function sendMessageNotification(toEmail, userName, messageText, senderName = 'Meipuratchi Team') {
  const body = `
    <h2 style="color:#192441;margin:0 0 8px;">📬 New Message from ${senderName}</h2>
    <p style="color:#6c757d;margin:0 0 20px;font-size:14px;">
      Hi ${userName}, you have received a new message regarding your career guidance request.
    </p>

    <div style="background:#f8f9fa;border-left:4px solid #192441;border-radius:0 12px 12px 0;padding:20px;margin:0 0 24px;">
      <p style="margin:0 0 6px;font-size:12px;color:#6c757d;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">
        🛡️ ${senderName}
      </p>
      <p style="margin:0;color:#212529;font-size:15px;line-height:1.6;">${messageText}</p>
    </div>

    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL || 'https://meipuratchi.netlify.app'}/portal"
         style="display:inline-block;background:linear-gradient(135deg,#192441,#1a3a6e);color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;">
        View & Reply in Portal →
      </a>
    </div>

    <p style="color:#adb5bd;font-size:12px;text-align:center;margin:20px 0 0;">
      You are receiving this because you registered at Meipuratchi.
    </p>`;

  return send(toEmail, `📬 New message from Meipuratchi Team`, baseTemplate('New Message', body));
}

// ══════════════════════════════════════════════════════════
//  4. STATUS UPDATE NOTIFICATION
// ══════════════════════════════════════════════════════════
async function sendStatusUpdateEmail(toEmail, userName, newStatus, statusMessage) {
  const statusConfig = {
    validating: { emoji: '🔍', color: '#f5a623', label: 'Under Review' },
    verified:   { emoji: '✅', color: '#2196F3', label: 'Profile Verified' },
    counseled:  { emoji: '🎓', color: '#28a745', label: 'Counseling Complete' },
    approved:   { emoji: '✅', color: '#28a745', label: 'Application Approved' },
    rejected:   { emoji: '❌', color: '#dc3545', label: 'Application Update' },
    submitted:  { emoji: '📋', color: '#6c757d', label: 'Submitted' },
  };
  const cfg = statusConfig[newStatus] || statusConfig.submitted;

  const body = `
    <h2 style="color:#192441;margin:0 0 8px;">${cfg.emoji} Status Update: ${cfg.label}</h2>
    <p style="color:#6c757d;margin:0 0 20px;font-size:14px;">Hi ${userName}, your guidance request status has been updated.</p>

    <div style="background:${cfg.color}15;border:2px solid ${cfg.color}40;border-radius:12px;padding:20px;text-align:center;margin:0 0 20px;">
      <p style="margin:0 0 4px;font-size:12px;color:#6c757d;text-transform:uppercase;letter-spacing:1px;">New Status</p>
      <h2 style="margin:0;color:${cfg.color};font-size:24px;font-weight:800;text-transform:capitalize;">${cfg.emoji} ${newStatus}</h2>
    </div>

    <div style="background:#f8f9fa;border-radius:10px;padding:16px;margin:0 0 24px;">
      <p style="margin:0;color:#495057;font-size:14px;line-height:1.6;">${statusMessage}</p>
    </div>

    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL || 'https://meipuratchi.netlify.app'}/portal"
         style="display:inline-block;background:linear-gradient(135deg,#192441,#1a3a6e);color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;">
        View Your Portal →
      </a>
    </div>`;

  return send(toEmail, `${cfg.emoji} Your Meipuratchi status: ${cfg.label}`, baseTemplate('Status Update', body));
}

// ══════════════════════════════════════════════════════════
//  5. BROADCAST EMAIL (admin → all / group)
// ══════════════════════════════════════════════════════════
async function sendBroadcastEmail(toEmail, userName, subject, messageHtml, adminName = 'Meipuratchi Team') {
  const body = `
    <h2 style="color:#192441;margin:0 0 8px;">📢 Message from ${adminName}</h2>
    <p style="color:#6c757d;margin:0 0 20px;font-size:14px;">Hi ${userName || 'there'},</p>

    <div style="background:#f8f9fa;border-radius:12px;padding:24px;margin:0 0 24px;line-height:1.7;color:#212529;font-size:14px;">
      ${messageHtml}
    </div>

    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL || 'https://meipuratchi.netlify.app'}/portal"
         style="display:inline-block;background:linear-gradient(135deg,#192441,#1a3a6e);color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;">
        Visit Your Portal →
      </a>
    </div>

    <p style="color:#adb5bd;font-size:12px;text-align:center;margin:20px 0 0;">
      Sent by Meipuratchi Admin · You are receiving this as a registered user.
    </p>`;

  return send(toEmail, subject, baseTemplate(subject, body));
}

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendMessageNotification,
  sendStatusUpdateEmail,
  sendBroadcastEmail,
};
