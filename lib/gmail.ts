import { google } from "googleapis";
import { prisma } from "@/lib/db";

interface Attachment {
  filename: string;
  mimeType: string;
  base64Data: string; // just the raw base64, no "data:...;base64," prefix
}

function buildMimeMessage({
  to,
  subject,
  html,
  attachments = [],
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
}) {
  const boundary = "boundary_" + Math.random().toString(36).slice(2);

  const headers = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
  ];

  const bodyPart = [
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    html,
  ].join("\n");

  const attachmentParts = attachments.map((att) => {
    return [
      `--${boundary}`,
      `Content-Type: ${att.mimeType}; name="${att.filename}"`,
      `Content-Disposition: attachment; filename="${att.filename}"`,
      `Content-Transfer-Encoding: base64`,
      ``,
      att.base64Data,
    ].join("\n");
  });

  const message =
    headers.join("\n") +
    "\n\n" +
    bodyPart +
    "\n" +
    attachmentParts.join("\n") +
    `\n--${boundary}--`;

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
}

async function getValidAccessToken(userEmail: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email: userEmail } });

  if (!user || !user.refreshToken) {
    throw new Error("No refresh token found for this user. Please log in again.");
  }

  const isExpired =
    !user.tokenExpiry || new Date(user.tokenExpiry).getTime() < Date.now() + 60_000;

  if (!isExpired && user.accessToken) {
    return user.accessToken;
  }

  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({ refresh_token: user.refreshToken });

  const { credentials } = await oauth2Client.refreshAccessToken();

  await prisma.user.update({
    where: { email: userEmail },
    data: {
      accessToken: credentials.access_token,
      tokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : undefined,
    },
  });

  if (!credentials.access_token) {
    throw new Error("Failed to refresh access token.");
  }

  return credentials.access_token;
}

export async function sendEmail({
  userEmail,
  to,
  subject,
  html,
  attachments,
}: {
  userEmail: string;
  to: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
}) {
  const accessToken = await getValidAccessToken(userEmail);

  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const raw = buildMimeMessage({ to, subject, html, attachments });

  return gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
}