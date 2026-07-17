"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { Mail } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <Mail className="w-6 h-6 text-indigo-600" />
        <span className="text-xl font-bold text-indigo-600">Cold Mailer</span>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-500 dark:text-neutral-400">
        <a className="text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 pb-1">Campaigns</a>
        <a className="hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer">Templates</a>
        <a className="hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer">Leads</a>
        <a className="hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer">Settings</a>
      </nav>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
          JS
        </div>
      </div>
    </header>
  );
}