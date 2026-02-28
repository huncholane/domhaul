"use client";

import Link from "next/link";
import { SettingsForm } from "@/components/settings-form";

export default function SettingsPage() {
  return (
    <div className="mx-auto min-h-screen max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          &larr; Back
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-100">
          Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Configure AI providers and defaults. Keys are stored in your browser
          only.
        </p>
      </header>
      <SettingsForm />
    </div>
  );
}
