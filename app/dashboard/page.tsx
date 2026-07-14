"use client";

export default function Dashboard() {
  async function handleTestSend() {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "maheklineswala@gmail.com",
        subject: "Test from Cold Mailer",
        html: "<p>Hello, this is a test email from my app!</p>",
      }),
    });
    const data = await res.json();
    alert(JSON.stringify(data));
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <button onClick={handleTestSend}>Send Test Email</button>
    </div>
  );
}