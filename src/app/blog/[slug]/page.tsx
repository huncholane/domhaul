import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, type ContentBlock } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — domhaul`,
    description: post.description,
  };
}

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "heading":
      if (block.level === 2) {
        return (
          <h2
            key={index}
            className="mt-10 text-xl font-semibold text-zinc-100"
          >
            {block.text}
          </h2>
        );
      }
      return (
        <h3 key={index} className="mt-8 text-lg font-semibold text-zinc-200">
          {block.text}
        </h3>
      );
    case "paragraph":
      return (
        <p
          key={index}
          className="mt-4 text-base leading-relaxed text-zinc-300"
          dangerouslySetInnerHTML={{ __html: block.text }}
        />
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          key={index}
          className={`mt-4 space-y-2 pl-6 text-zinc-300 ${
            block.ordered ? "list-decimal" : "list-disc"
          }`}
        >
          {block.items.map((item, i) => (
            <li
              key={i}
              className="text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </Tag>
      );
    }
    case "callout":
      return (
        <div
          key={index}
          className="mt-6 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-5 py-4 text-sm leading-relaxed text-indigo-200"
          dangerouslySetInnerHTML={{ __html: block.text }}
        />
      );
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Link
          href="/blog"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          &larr; Blog
        </Link>
        <time className="mt-4 block text-xs text-zinc-500">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-100">
          {post.title}
        </h1>
      </header>

      <article>{post.content.map(renderBlock)}</article>

      <footer className="mt-16 border-t border-zinc-800 pt-8">
        <Link
          href="/blog"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          &larr; Back to Blog
        </Link>
      </footer>
    </div>
  );
}
