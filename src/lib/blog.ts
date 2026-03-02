export type ContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "callout"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: ContentBlock[];
}

const posts: BlogPost[] = [
  {
    slug: "importance-of-a-good-domain-name",
    title: "The Importance of a Good Domain Name",
    description:
      "Your domain name is your digital first impression. Learn why choosing the right one matters for branding, credibility, SEO, and long-term value.",
    date: "2026-03-01",
    content: [
      {
        type: "heading",
        level: 2,
        text: "First Impressions Happen in the URL Bar",
      },
      {
        type: "paragraph",
        text: "Before a visitor reads a single word on your site, they see your domain name. It appears in search results, social media shares, business cards, and word-of-mouth recommendations. A clean, memorable domain instantly signals professionalism — while a clunky or confusing one raises doubts before the page even loads.",
      },
      {
        type: "paragraph",
        text: "Think about it: would you trust <strong>best-deals-online-shop-2024.net</strong> the same way you'd trust <strong>shopify.com</strong>? The domain sets expectations for everything that follows.",
      },
      {
        type: "heading",
        level: 2,
        text: "Branding Starts with Your Domain",
      },
      {
        type: "paragraph",
        text: "Your domain name is often the very first branding decision you make. It becomes your identity — the name people type, search for, and remember. A strong domain is short, easy to spell, and easy to say out loud. It should feel like a natural extension of your brand, not an afterthought.",
      },
      {
        type: "list",
        items: [
          "<strong>Keep it short.</strong> Fewer characters means fewer typos and easier recall.",
          "<strong>Avoid hyphens and numbers.</strong> They're hard to communicate verbally and look spammy.",
          "<strong>Make it pronounceable.</strong> If you can't say it in conversation, it's too complicated.",
          "<strong>Check for conflicts.</strong> Make sure it doesn't overlap with existing trademarks or well-known brands.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Credibility and Trust",
      },
      {
        type: "paragraph",
        text: "Users make snap judgments about websites, and the domain plays a bigger role than most people realize. A professional domain signals legitimacy. It tells visitors that you've invested in your online presence and that you're serious about what you do.",
      },
      {
        type: "paragraph",
        text: "This is especially critical for businesses that handle sensitive information — e-commerce stores, financial services, healthcare providers. A domain like <strong>mystore.com</strong> inspires far more confidence than <strong>mystore.freewebhost.biz</strong>.",
      },
      {
        type: "heading",
        level: 2,
        text: "SEO and Discoverability",
      },
      {
        type: "paragraph",
        text: "While Google has moved away from exact-match domain bonuses, your domain name still influences SEO in indirect but meaningful ways. A memorable domain gets more direct traffic, more branded searches, and higher click-through rates in search results — all signals that search engines reward.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "<strong>Branded searches</strong> — people searching for your domain by name tells Google you're an authority.",
          "<strong>Click-through rate</strong> — a clean domain in search results gets more clicks than a messy one.",
          "<strong>Backlinks</strong> — people are more likely to link to a domain that looks trustworthy.",
          "<strong>Type-in traffic</strong> — a memorable domain means visitors come directly, reducing dependence on ads.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Choosing the Right TLD",
      },
      {
        type: "paragraph",
        text: "<strong>.com</strong> remains the gold standard. It's what most people type by default, and it carries the most universal trust. But the domain landscape has expanded significantly, and alternative TLDs can work well in the right context.",
      },
      {
        type: "list",
        items: [
          "<strong>.com</strong> — best for broad, global appeal and maximum trust.",
          "<strong>.co</strong> — popular with startups, short and modern.",
          "<strong>.io</strong> — widely used in tech and developer communities.",
          "<strong>.app</strong> — great for software products and mobile applications.",
          "<strong>.dev</strong> — ideal for developer tools and portfolios.",
          "<strong>Country TLDs (.uk, .de, .ca)</strong> — useful if your audience is in a specific region.",
        ],
      },
      {
        type: "callout",
        text: "Not sure which TLD to go with? Use <strong>domhaul</strong> to generate domain ideas across multiple TLDs and instantly check availability.",
      },
      {
        type: "heading",
        level: 2,
        text: "Long-Term Value",
      },
      {
        type: "paragraph",
        text: "A good domain is an asset that appreciates over time. As your brand grows, your domain accumulates authority, backlinks, and recognition. Changing your domain later means losing that built-up equity and confusing your existing audience — it's one of the most disruptive changes a business can make.",
      },
      {
        type: "paragraph",
        text: "Premium domains regularly sell for thousands or even millions of dollars because their owners understand this compounding value. Investing a little more time and money upfront to secure the right domain pays dividends for years to come.",
      },
      {
        type: "heading",
        level: 2,
        text: "Start Your Search",
      },
      {
        type: "paragraph",
        text: "The best time to secure a great domain is now — good names get taken every day. Whether you're launching a startup, a side project, or a personal brand, your domain name is the foundation of your online identity.",
      },
      {
        type: "callout",
        text: "Ready to find the perfect domain? <strong>domhaul</strong> uses AI to generate creative, available domain names tailored to your idea. <a href=\"/\" class=\"underline\">Try it now</a>.",
      },
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
