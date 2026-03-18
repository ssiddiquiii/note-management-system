import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  let transporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Generate test SMTP service account from ethereal.email if no credentials are provided
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Use EMAIL_FROM explicitly, falling back to EMAIL_USER if it looks like a real email, or a generic string.
  const senderEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@notionclone.com";

  const mailOptions = {
    from: `"Notion Clone Support" <${senderEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.htmlMessage || `<p>${options.message}</p>`,
  };

  const info = await transporter.sendMail(mailOptions);

  if (!process.env.EMAIL_USER || process.env.EMAIL_HOST?.includes('ethereal')) {
    console.log("\n================ TEST EMAIL SENT ================");
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("==================================================\n");
  }
};
