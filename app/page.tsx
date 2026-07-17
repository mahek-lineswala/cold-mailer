export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Cold Mailer</h1>
      <p>Send job applications, referrals, and follow-ups — from your own Gmail.</p>
      <a href="/api/auth/signin">Sign in with Google</a>
    </div>
  );
}