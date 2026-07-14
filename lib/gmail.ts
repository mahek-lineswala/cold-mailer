import { google } from "googleapis";

interface SendEmailParams {
  accessToken: string;
  to: string;
  subject: string;
  html: string;
}

function buildMimeMessage({ to, subject, html }: Omit<SendEmailParams, "accessToken">) {
  const messageParts = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    html,
  ];
  const message = messageParts.join("\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendEmail({ accessToken, to, subject, html }: SendEmailParams) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const raw = buildMimeMessage({ to, subject, html });

  return gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
}