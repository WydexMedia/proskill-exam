import nodemailer from "nodemailer";

const EMAIL_USER = "classroom@proskilledu.com";
const CLIENT_ID = "940574927037-6dg87foso8f05div3hrqnbqq2u5k25co.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN = "1//04uLQgGiVH_yFCgYIARAAGAQSNwF-L9Irkb7mIU35o4WwV5y8hHG1wMn_VkYmhc8zhNqH9cQNHA16cchd88rcbAM8NpCwXLzsJ40";

// console.log("EMAIL_USER:", EMAIL_USER);
// console.log("CLIENT_ID:", CLIENT_ID);
// console.log("CLIENT_SECRET:", CLIENT_SECRET);
// console.log("REFRESH_TOKEN:", REFRESH_TOKEN.substring(0, 15) + "...");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: EMAIL_USER,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
  },
});

(async () => {
  try {
    const info = await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_USER,
      subject: "Test OAuth2 Email",
      text: "This is a test email sent via OAuth2 Nodemailer.",
    });
    console.log("✅ Message sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
})();
