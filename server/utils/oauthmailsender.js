

const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const sendEmail = async (email, title, body) => {
  try {
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const messageParts = [
      `To: ${email}`,
      `Subject: ${title}`,
      "Content-Type: text/html; charset=UTF-8",
      "",
      body,
    ];

    const message = messageParts.join("\n");

    // Base64 encode message
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("Email sent via Gmail API:", response.data.id);
    return response.data;
  } catch (error) {
    console.error("Gmail API send error:", error);
  }
};

module.exports = sendEmail;
