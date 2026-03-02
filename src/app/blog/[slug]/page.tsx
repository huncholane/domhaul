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
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
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
    case "image":
      return (
        <figure key={index} className="mt-8">
          <img
            src={block.src}
            alt={block.alt}
            className="w-full rounded-lg border border-zinc-800"
            loading="lazy"
          />
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-zinc-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "faq":
      return (
        <div key={index} className="mt-6 space-y-4">
          {block.items.map((item, i) => (
            <details
              key={i}
              className="group rounded-lg border border-zinc-800 bg-zinc-900/50"
            >
              <summary className="cursor-pointer px-5 py-4 text-base font-medium text-zinc-100 transition-colors hover:text-white">
                {item.question}
              </summary>
              <p
                className="border-t border-zinc-800 px-5 py-4 text-sm leading-relaxed text-zinc-300"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </details>
          ))}
        </div>
      );
  }
}

function buildJsonLd(post: {
  title: string;
  description: string;
  date: string;
  slug: string;
  content: ContentBlock[];
}) {
  const faqBlock = post.content.find((b) => b.type === "faq");
  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: {
        "@type": "Organization",
        name: "domhaul",
        url: "https://domhaul.vercel.app",
      },
      publisher: {
        "@type": "Organization",
        name: "domhaul",
        url: "https://domhaul.vercel.app",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://domhaul.vercel.app/blog/${post.slug}`,
      },
    },
  ];

  if (faqBlock && faqBlock.type === "faq") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqBlock.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return schemas;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = buildJsonLd(post);

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

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
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
          {post.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          {post.description}
        </p>
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
