import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL("https://domhaul.vercel.app"),
  title: "domhaul — Find Available Domain Names",
  description:
    "AI-powered domain name generator and availability checker. Find the perfect domain for your project.",
  openGraph: {
    title: "domhaul — Find Available Domain Names",
    description:
      "AI-powered domain name generator and availability checker. Find the perfect domain for your project.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "domhaul" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "domhaul — Find Available Domain Names",
    description:
      "AI-powered domain name generator and availability checker. Find the perfect domain for your project.",
    images: ["/og.png"],
  },
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
        <link rel="alternate" type="application/rss+xml" title="domhaul Blog" href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "domhaul",
              url: "https://domhaul.vercel.app",
              description:
                "AI-powered domain name generator and availability checker.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://domhaul.vercel.app/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 font-sans text-zinc-100 antialiased`}
      >
        <nav className="fixed right-4 top-4 z-50 flex gap-2">
          <a
            href="https://github.com/huncholane/domhaul"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            GitHub
          </a>
          <Link
            href="/blog"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            Blog
          </Link>
          <Link
            href="/history"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            History
          </Link>
          <Link
            href="/settings"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            Settings
          </Link>
        </nav>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-09REV811CJ"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-09REV811CJ');`}
        </Script>
      </body>
    </html>
  );
}
