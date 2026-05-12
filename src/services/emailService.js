const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const transporter = getTransporter();

  if (!transporter) {
    logger.warn(`[Email] SMTP is not configured. Password reset link for ${to}: ${resetUrl}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: 'Đặt lại mật khẩu VITECHS',
    text: `Xin chào ${name || ''},\n\nBạn vừa yêu cầu đặt lại mật khẩu. Vui lòng truy cập liên kết sau trong 15 phút:\n${resetUrl}\n\nNếu bạn không yêu cầu, vui lòng bỏ qua email này.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <h2>Đặt lại mật khẩu VITECHS</h2>
        <p>Xin chào ${name || 'bạn'},</p>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng bấm nút bên dưới trong vòng 15 phút.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;">
            Đặt lại mật khẩu
          </a>
        </p>
        <p>Nếu nút không hoạt động, hãy sao chép liên kết này:</p>
        <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
        <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      </div>
    `,
  });
};

module.exports = { sendPasswordResetEmail };
