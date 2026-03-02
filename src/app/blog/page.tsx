import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

const title = "Blog — domhaul";
const description =
  "Tips, guides, and insights on domain names, branding, and building your online presence.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/blog",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "domhaul" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          &larr; Back
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-100">
          Blog
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Tips, guides, and insights on domain names and building your online
          presence.
        </p>
      </header>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
            <article className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700">
              <time className="text-xs text-zinc-500">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2 className="mt-1.5 text-lg font-semibold text-zinc-100">
                {post.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                {post.description}
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-indigo-400">
                Read more &rarr;
              </span>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
