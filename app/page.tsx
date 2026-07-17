"use client";

import { signIn } from "next-auth/react";
import { Mail, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Mail className="w-6 h-6 text-indigo-600" />
          <span className="text-xl font-bold text-indigo-600">Cold Mailer</span>
        </div>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm"
        >
          Sign in with Google
        </button>
      </header>

      <main className="max-w-3xl mx-auto text-center px-6 pt-16 pb-24">
        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-semibold mb-6">
          Built for job seekers
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-6">
          Send cold emails that <span className="text-indigo-600 italic">actually</span> get replies
        </h1>
        <p className="text-lg text-neutral-500 mb-8 max-w-xl mx-auto">
          Write personalized job applications, referral requests, and follow-ups — sent straight from your own Gmail.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            Sign in with Google
          </button>
          <span className="flex items-center gap-1.5 text-sm text-neutral-500">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            No credit card required
          </span>
        </div>
      </main>
    </div>
  );
}