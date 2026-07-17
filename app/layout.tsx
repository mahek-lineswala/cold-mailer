import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cold Mailer",
  description: "Send job applications, referrals, and follow-ups from your own Gmail",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}