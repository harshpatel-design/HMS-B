import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.verify();
  } catch (verifyErr) {
    console.error("SMTP verify failed:", verifyErr);
    throw verifyErr;
  }

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to,
    subject,
    html,
  });
};

