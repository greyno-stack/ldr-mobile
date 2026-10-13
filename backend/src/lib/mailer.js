import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { EMAIL_USER, EMAIL_APP_PASSWORD } = process.env;

const transporter =
  EMAIL_USER && EMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user: EMAIL_USER, pass: EMAIL_APP_PASSWORD },
      })
    : null;

export async function sendVerificationEmail(to, code, ttlMinutes) {
  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email is not configured (EMAIL_USER / EMAIL_APP_PASSWORD)");
    }
    // Dev fallback so the flow can be tested before Gmail credentials exist.
    console.warn(`[mailer] EMAIL_USER / EMAIL_APP_PASSWORD not set. Verification code for ${to}: ${code}`);
    return;
  }

  await transporter.sendMail({
    from: `"LDR" <${EMAIL_USER}>`,
    to,
    subject: `${code} is your LDR verification code`,
    text: `Your LDR verification code is ${code}. It expires in ${ttlMinutes} minutes.\n\nIf you didn't try to sign up, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:420px;margin:0 auto;padding:24px;color:#241b33">
        <h2 style="margin:0 0 12px">Verify your email</h2>
        <p style="margin:0 0 16px">Enter this code in the LDR app to finish creating your account:</p>
        <p style="font-size:32px;font-weight:700;letter-spacing:8px;margin:0 0 16px">${code}</p>
        <p style="margin:0;color:#726c80;font-size:13px">This code expires in ${ttlMinutes} minutes. If you didn't try to sign up, you can ignore this email.</p>
      </div>
    `,
  });
}
