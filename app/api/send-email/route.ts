import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/gmail";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { to, subject, html } = await req.json();

  try {
    await sendEmail({
      accessToken: (session as any).accessToken,
      to,
      subject,
      html,
    });
    return Response.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return new Response(err.message ?? "Failed to send", { status: 500 });
  }
}