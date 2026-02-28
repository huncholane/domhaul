import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "domhaul — Find Available Domain Names",
  description:
    "AI-powered domain name generator and availability checker. Find the perfect domain for your project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="impact-site-verification" content="295f3557-8cb1-4100-b779-3f8521ea2934" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 font-sans text-zinc-100 antialiased`}
      >
        <nav className="fixed right-4 top-4 z-50">
          <Link
            href="/settings"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            Settings
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
