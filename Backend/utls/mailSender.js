const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async () => {
  try {
    // Ensure environment variables are set
    const { MAIL_HOST, MAIL_USER, MAIL_PASS } = process.env;
    if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
      console.warn("Mail configuration is incomplete.");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"Your App Name" <${MAIL_USER}>`, // Use environment variable
      to: doc.email, // Receiver
      subject: "New File Uploaded", // Subject line
      text: `Hello ${doc.name}, your file has been successfully uploaded!`, // Dynamic plain text body
      html: `<b>Hello ${doc.name},</b><br>Your file has been successfully uploaded!`, // Dynamic HTML body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
module.exports = mailSender;
