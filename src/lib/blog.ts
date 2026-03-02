export type ContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "callout"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "faq"; items: { question: string; answer: string }[] };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  keywords: string[];
  content: ContentBlock[];
}

const posts: BlogPost[] = [
  {
    slug: "importance-of-a-good-domain-name",
    title: "How to Choose a Good Domain Name: Why It Matters for Your Business",
    description:
      "Learn how to choose the perfect domain name for your business. Discover why your domain matters for branding, credibility, SEO, and long-term growth — plus actionable tips for picking the right one.",
    date: "2026-03-01",
    keywords: [
      "how to choose a domain name",
      "domain name importance",
      "good domain name",
      "best domain name for business",
      "domain name tips",
      "domain name SEO",
      "choose a domain",
      "domain name branding",
    ],
    content: [
      {
        type: "paragraph",
        text: "Your domain name is one of the most important decisions you'll make when building an online presence. It's the first thing people see in search results, the address they type into their browser, and the foundation of your digital brand. Yet many businesses rush through this decision — or settle for whatever's available — without understanding the lasting impact a domain name has on growth, trust, and discoverability.",
      },
      {
        type: "paragraph",
        text: "In this guide, we'll break down exactly why a good domain name matters and how to choose one that sets your business up for long-term success.",
      },
      {
        type: "heading",
        level: 2,
        text: "Why Your Domain Name Matters More Than You Think",
      },
      {
        type: "paragraph",
        text: "Before a visitor reads a single word on your website, they see your domain name. It shows up in Google search results, social media shares, email signatures, business cards, and word-of-mouth recommendations. A clean, memorable domain instantly signals professionalism — while a long, confusing, or hyphenated one raises doubts before the page even loads.",
      },
      {
        type: "paragraph",
        text: "Research from <strong>Microsoft</strong> found that users form an opinion about a website within <strong>0.05 seconds</strong>. Your domain name is a significant part of that snap judgment. Would you trust <strong>best-deals-online-shop-2024.net</strong> the same way you'd trust <strong>shopify.com</strong>? The domain sets expectations for everything that follows.",
      },
      {
        type: "paragraph",
        text: "Think of your domain as your digital storefront sign. In the physical world, nobody walks into a shop with a misspelled, barely readable sign. The same principle applies online — your domain is the sign above your door.",
      },
      {
        type: "heading",
        level: 2,
        text: "How a Good Domain Name Builds Your Brand",
      },
      {
        type: "paragraph",
        text: "Your domain name is often the very first branding decision you make. It becomes your identity — the name people type, search for, recommend to friends, and remember months later. A strong domain name is an extension of your brand, not a technical afterthought.",
      },
      {
        type: "paragraph",
        text: "Consider the biggest brands online: <strong>google.com</strong>, <strong>stripe.com</strong>, <strong>notion.so</strong>, <strong>linear.app</strong>. Each domain is short, distinctive, and immediately associated with the product. That's not a coincidence — it's a deliberate branding strategy.",
      },
      {
        type: "heading",
        level: 3,
        text: "What Makes a Domain Name Brandable?",
      },
      {
        type: "list",
        items: [
          "<strong>Short (under 15 characters).</strong> Fewer characters means fewer typos, easier recall, and better fit on business cards and social profiles. Studies show that the average top-100 website domain is just 6.3 characters long.",
          "<strong>No hyphens or numbers.</strong> They're hard to communicate verbally (\"Is that dash or underscore? The number 4 or the word four?\") and they look spammy to users and search engines alike.",
          "<strong>Easy to pronounce and spell.</strong> If someone hears your domain in a podcast or conversation, can they type it correctly on the first try? If not, you'll lose traffic to typos.",
          "<strong>Unique and distinctive.</strong> Avoid generic words that blend in with competitors. A distinctive name is easier to trademark, easier to rank for, and easier to build a brand around.",
          "<strong>No trademark conflicts.</strong> Before committing, search the <strong>USPTO database</strong> and do a basic Google search to make sure your domain doesn't overlap with existing brands. Legal disputes over domains are expensive and disruptive.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Domain Names and Credibility: Why Trust Starts in the URL Bar",
      },
      {
        type: "paragraph",
        text: "Online trust is fragile. Users decide in seconds whether a website looks legitimate, and the domain name is one of the strongest trust signals available. A professional domain tells visitors you've invested in your online presence and that you take your business seriously.",
      },
      {
        type: "paragraph",
        text: "This matters even more for businesses handling sensitive information — e-commerce stores processing payments, SaaS companies storing user data, healthcare providers, and financial services. A domain like <strong>mystore.com</strong> inspires far more confidence than <strong>mystore.freewebhost.biz</strong>.",
      },
      {
        type: "paragraph",
        text: "A <strong>Stanford Web Credibility Research</strong> study found that <strong>75% of users</strong> judge a company's credibility based on their website design — and the domain name is the very first element of that design. Free subdomain addresses, overly long URLs, and obscure TLDs all erode trust before a visitor even sees your content.",
      },
      {
        type: "heading",
        level: 3,
        text: "Signs of an Untrustworthy Domain",
      },
      {
        type: "list",
        items: [
          "Free subdomains (yourname.wordpress.com, yourname.wixsite.com)",
          "Excessive hyphens or numbers (best-cheap-deals-4-u.net)",
          "Misspelled words or character substitutions (amaz0n-deals.com)",
          "Obscure or unfamiliar TLDs that users don't recognize",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "How Your Domain Name Affects SEO",
      },
      {
        type: "paragraph",
        text: "While Google has moved away from giving exact-match domains a direct ranking boost, your domain name still has a significant <strong>indirect impact on SEO</strong>. Search engine optimization isn't just about keywords — it's about user behavior signals, and your domain influences several of them.",
      },
      {
        type: "heading",
        level: 3,
        text: "The SEO Signals Your Domain Name Influences",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "<strong>Branded search volume.</strong> When people search for your domain name directly (e.g., \"domhaul\" or \"domhaul domain finder\"), Google treats this as a strong authority signal. A memorable domain generates more branded searches.",
          "<strong>Click-through rate (CTR) in search results.</strong> A clean, professional domain in Google results gets more clicks than a messy one. Higher CTR tells Google your result is relevant, which can improve your rankings over time.",
          "<strong>Backlink acquisition.</strong> Other websites are more likely to link to a domain that looks trustworthy and authoritative. Quality backlinks remain one of the most powerful ranking factors.",
          "<strong>Direct type-in traffic.</strong> A memorable domain means visitors come directly by typing your URL, reducing dependence on paid ads and signaling to search engines that you're a destination site.",
          "<strong>User engagement metrics.</strong> Users who trust your domain are more likely to stay, browse multiple pages, and return later — all positive signals that correlate with higher rankings.",
        ],
      },
      {
        type: "callout",
        text: "A study by <strong>Moz</strong> found that branded search queries and direct traffic are among the top correlating factors for higher Google rankings. Your domain name directly drives both of these.",
      },
      {
        type: "heading",
        level: 2,
        text: "How to Choose the Right TLD (.com, .io, .co, and More)",
      },
      {
        type: "paragraph",
        text: "The TLD (top-level domain) is the extension at the end of your domain — <strong>.com</strong>, <strong>.io</strong>, <strong>.co</strong>, and so on. While .com remains the gold standard for broad appeal and universal trust, the domain landscape has expanded significantly. Choosing the right TLD depends on your audience, industry, and goals.",
      },
      {
        type: "heading",
        level: 3,
        text: "TLD Comparison: Which Extension Should You Choose?",
      },
      {
        type: "list",
        items: [
          "<strong>.com</strong> — The default. Best for broad, global appeal and maximum trust. If the .com is available for your brand name, take it.",
          "<strong>.co</strong> — Short and modern, popular with startups. Used by companies like <strong>angel.co</strong> and <strong>loom.co</strong>. Good alternative when .com is taken.",
          "<strong>.io</strong> — Widely used in tech and developer communities. Carries a \"tech-forward\" connotation. Used by <strong>github.io</strong>, <strong>itch.io</strong>, and many SaaS products.",
          "<strong>.app</strong> — Enforces HTTPS by default. Great for software products and mobile applications.",
          "<strong>.dev</strong> — Ideal for developer tools, portfolios, and documentation sites. Also enforces HTTPS.",
          "<strong>.ai</strong> — Increasingly popular for AI and machine learning products. Premium pricing but strong relevance in the AI space.",
          "<strong>Country TLDs (.uk, .de, .ca, .com.au)</strong> — Useful if your audience is in a specific country. Can help with local SEO in that region.",
        ],
      },
      {
        type: "callout",
        text: "Not sure which TLD to go with? <strong><a href=\"/\" class=\"underline\">domhaul</a></strong> lets you search across multiple TLDs at once and instantly check availability — so you can compare your options side by side.",
      },
      {
        type: "heading",
        level: 2,
        text: "The Long-Term Value of a Good Domain Name",
      },
      {
        type: "paragraph",
        text: "A good domain is a business asset that <strong>appreciates over time</strong>. Every day your website is live, your domain accumulates authority, backlinks, search engine trust, and brand recognition. This compounding value is why domain changes are one of the most disruptive things a business can do.",
      },
      {
        type: "paragraph",
        text: "Changing your domain later means losing years of built-up SEO equity, breaking every backlink pointing to your site, confusing your existing customers, and essentially starting over in the eyes of search engines. The redirect process is imperfect — studies show that even properly executed domain migrations can result in a <strong>10-30% traffic loss</strong> that can take months to recover.",
      },
      {
        type: "paragraph",
        text: "Premium domains regularly sell for thousands or even millions of dollars — <strong>voice.com</strong> sold for $30 million, <strong>insurance.com</strong> for $35.6 million — because their owners understand this compounding value. You don't need to spend millions, but investing a little more thought and money upfront to secure the right domain will pay dividends for years to come.",
      },
      {
        type: "heading",
        level: 2,
        text: "Common Domain Name Mistakes to Avoid",
      },
      {
        type: "paragraph",
        text: "Knowing what <em>not</em> to do is just as important as knowing what to do. Here are the most common mistakes people make when choosing a domain name:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "<strong>Making it too long.</strong> Every extra character increases the chance of typos and makes the domain harder to remember. Aim for under 15 characters.",
          "<strong>Using trendy slang or misspellings.</strong> What feels clever today (\"flickr\", \"tumblr\") can feel dated tomorrow. Misspellings also mean you'll constantly be correcting people.",
          "<strong>Choosing something too similar to a competitor.</strong> You'll leak traffic to them, confuse customers, and potentially face legal issues.",
          "<strong>Not checking social media availability.</strong> Your domain and social handles should ideally match. Check Twitter/X, Instagram, and other relevant platforms before committing.",
          "<strong>Ignoring international audiences.</strong> If your domain is hard to spell or pronounce in your target markets, you'll lose traffic internationally.",
          "<strong>Settling too quickly.</strong> Your domain is a long-term commitment. Spend time brainstorming, checking availability, and getting feedback before you buy.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "How to Check if a Domain Name Is Available",
      },
      {
        type: "paragraph",
        text: "Once you have a shortlist of domain name ideas, you need to check if they're actually available for registration. Traditional domain registrars let you check one name at a time, which is tedious when you're exploring dozens of options.",
      },
      {
        type: "paragraph",
        text: "A faster approach is to use an <strong>AI-powered domain name generator</strong> that can brainstorm creative names based on your description and check availability in real time. This saves hours of manual searching and surfaces options you might never have thought of.",
      },
      {
        type: "image",
        src: "/blog/domhaul-screenshot.png",
        alt: "domhaul generating domain names for an online coffee roastery — showing available and taken domains with real-time availability checking",
        caption:
          "domhaul generating domain name ideas from a project description, with real-time availability results.",
      },
      {
        type: "callout",
        text: "<strong><a href=\"/\" class=\"underline\">domhaul</a></strong> uses AI to generate domain name ideas tailored to your project, then checks availability across multiple TLDs instantly. Describe what you're building and get a list of available domains in seconds.",
      },
      {
        type: "heading",
        level: 2,
        text: "Frequently Asked Questions About Domain Names",
      },
      {
        type: "faq",
        items: [
          {
            question: "How much does a domain name cost?",
            answer:
              "Most standard domain names cost between $10 and $20 per year through registrars like Namecheap, Google Domains, or Cloudflare Registrar. Premium or highly sought-after domains can cost significantly more — anywhere from hundreds to millions of dollars on the aftermarket. New TLDs like .io or .ai tend to be pricier, typically $30-90 per year.",
          },
          {
            question: "Can I change my domain name later?",
            answer:
              "Technically yes, but it's strongly discouraged. Changing your domain means losing accumulated SEO authority, breaking existing backlinks, confusing returning visitors, and updating every mention of your old domain across the internet. Domain migrations typically result in a 10-30% traffic loss. It's much better to invest time choosing the right domain upfront.",
          },
          {
            question: "Is .com always the best choice?",
            answer:
              ".com is the most universally trusted and recognized TLD, so it's the safest default choice. However, alternatives like .io (for tech), .co (for startups), .app (for software), and country-specific TLDs can work well if they fit your brand and audience. The key is choosing a TLD your target audience trusts.",
          },
          {
            question: "Does my domain name affect my Google ranking?",
            answer:
              "Not directly — Google doesn't give ranking bonuses for specific keywords in your domain. However, your domain name indirectly affects SEO through branded search volume, click-through rates, backlink acquisition, and user trust. A memorable, professional domain improves all of these metrics, which correlates with better rankings over time.",
          },
          {
            question:
              "What's the difference between a domain name and web hosting?",
            answer:
              "A domain name is your website's address (e.g., example.com) — it's what people type to find you. Web hosting is the server where your website's files are stored. You need both to have a website: the domain is the address, and the hosting is the building at that address. They're purchased separately, often from different providers.",
          },
          {
            question: "How do I come up with a good domain name?",
            answer:
              "Start by brainstorming words related to your brand, product, or industry. Keep it short (under 15 characters), easy to spell and pronounce, and free of hyphens or numbers. Check for trademark conflicts and social media availability. Use an AI-powered tool like domhaul to generate creative options based on your description and check availability instantly.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Start Finding Your Perfect Domain Name",
      },
      {
        type: "paragraph",
        text: "The best time to secure a great domain is <strong>now</strong> — good names get taken every day, and the longer you wait, the fewer options you'll have. Whether you're launching a startup, building a side project, or establishing a personal brand, your domain name is the foundation of your entire online presence.",
      },
      {
        type: "paragraph",
        text: "Don't settle for a domain you're not excited about. Take the time to find one that's short, memorable, and perfectly aligned with your brand — it's one of the highest-ROI investments you can make.",
      },
      {
        type: "callout",
        text: "Ready to find the perfect domain? <strong><a href=\"/\" class=\"underline\">Try domhaul</a></strong> — describe your idea and get AI-generated domain suggestions with real-time availability checking. It's free, fast, and built to help you find a name you'll love.",
      },
    ],
  },
  {
    slug: "domain-name-ideas-for-startups",
    title: "Domain Name Ideas for Startups: How to Find the Perfect Name in 2026",
    description:
      "Struggling to find a domain for your startup? Explore proven strategies for brainstorming startup domain names, with real examples and AI-powered tools to find available options fast.",
    date: "2026-02-20",
    keywords: [
      "domain name ideas for startups",
      "startup domain name",
      "domain name generator",
      "startup name ideas",
      "business domain name ideas",
      "how to find a domain name",
      "creative domain names",
      "AI domain name generator",
    ],
    content: [
      {
        type: "paragraph",
        text: "Finding the right domain name for your startup is one of the hardest parts of launching. You need something short, memorable, available, and ideally a <strong>.com</strong> — but it feels like every good name is already taken. The frustration is real: you brainstorm for hours, check availability, and get rejected over and over.",
      },
      {
        type: "paragraph",
        text: "The good news? There are proven strategies that consistently produce great domain names, and new tools that make the process dramatically faster. In this guide, we'll walk through the most effective approaches for generating startup domain name ideas — with real examples and actionable techniques you can use right now.",
      },
      {
        type: "heading",
        level: 2,
        text: "Why Your Startup's Domain Name Is So Important",
      },
      {
        type: "paragraph",
        text: "Your domain is more than a URL — it's your startup's first impression, your brand anchor, and often the very first thing investors, customers, and the press see. A great domain name does three things simultaneously: it <strong>communicates what you do</strong>, it <strong>sticks in people's heads</strong>, and it <strong>looks credible</strong> in a search result.",
      },
      {
        type: "paragraph",
        text: "Early-stage startups are especially dependent on word-of-mouth and organic discovery. If someone hears about your product at a conference or on a podcast, they need to be able to remember your domain and type it correctly hours later. Every extra syllable, every hyphen, every unusual spelling is friction that costs you visitors.",
      },
      {
        type: "heading",
        level: 2,
        text: "7 Proven Strategies for Generating Startup Domain Names",
      },
      {
        type: "paragraph",
        text: "Not every naming strategy works for every startup. The best approach depends on your industry, target audience, and brand personality. Here are the methods that consistently produce great results:",
      },
      {
        type: "heading",
        level: 3,
        text: "1. Combine Two Short Words",
      },
      {
        type: "paragraph",
        text: "This is the most reliable strategy for finding available, brandable domains. Take two short, meaningful words and combine them into a compound name. The words should feel natural together and hint at what your product does.",
      },
      {
        type: "list",
        items: [
          "<strong>Mailchimp</strong> — mail + chimp (email marketing, playful brand)",
          "<strong>Shopify</strong> — shop + -ify (e-commerce, action-oriented)",
          "<strong>Dropbox</strong> — drop + box (file storage, simple metaphor)",
          "<strong>Coinbase</strong> — coin + base (cryptocurrency, foundation/home)",
          "<strong>Grammarly</strong> — grammar + -ly (writing tool, adverb-style modifier)",
        ],
      },
      {
        type: "paragraph",
        text: "To use this strategy, make two lists: one with words related to your product or industry, and another with short, punchy modifier words (flow, hub, shift, spark, craft, base, wise, path, vault, pulse). Then combine pairs and check availability.",
      },
      {
        type: "heading",
        level: 3,
        text: "2. Use a Verb + Noun Pattern",
      },
      {
        type: "paragraph",
        text: "Verb-noun combinations feel energetic and action-oriented — perfect for startups that want to convey momentum. The verb tells users what they'll <em>do</em>, while the noun grounds it in something tangible.",
      },
      {
        type: "list",
        items: [
          "<strong>SendGrid</strong> — send + grid",
          "<strong>LaunchDarkly</strong> — launch + darkly",
          "<strong>GoFundMe</strong> — go + fund + me",
          "<strong>MakeSpace</strong> — make + space",
          "<strong>BreakLine</strong> — break + line",
        ],
      },
      {
        type: "heading",
        level: 3,
        text: "3. Invent a New Word",
      },
      {
        type: "paragraph",
        text: "Coined words are unique by definition, which means the domain is more likely to be available and the trademark path is clearer. The trick is making the invented word feel intuitive — it should <em>sound</em> like it could be a real word, even if it isn't.",
      },
      {
        type: "list",
        items: [
          "<strong>Spotify</strong> — sounds like \"spot\" + \"-ify\"",
          "<strong>Calendly</strong> — \"calendar\" + \"-ly\"",
          "<strong>Figma</strong> — short, punchy, tech-sounding",
          "<strong>Zapier</strong> — \"zap\" + \"-ier\" (faster, zappier)",
          "<strong>Twilio</strong> — evokes \"twilight\" and communication",
        ],
      },
      {
        type: "paragraph",
        text: "Techniques for coining words: shorten existing words, blend two words together (portmanteau), add suffixes like <strong>-ly</strong>, <strong>-ify</strong>, <strong>-io</strong>, <strong>-er</strong>, or swap vowels to create something fresh.",
      },
      {
        type: "heading",
        level: 3,
        text: "4. Use a Metaphor or Analogy",
      },
      {
        type: "paragraph",
        text: "Metaphorical names borrow meaning from unrelated concepts to create memorable, evocative brands. They work especially well when the literal description of your product is boring or too generic.",
      },
      {
        type: "list",
        items: [
          "<strong>Slack</strong> — the opposite of taut; implies cutting through tension",
          "<strong>Notion</strong> — an idea, a concept; fits a knowledge tool",
          "<strong>Stripe</strong> — a line, a band; clean and abstract",
          "<strong>Linear</strong> — straightforward, efficient; fits a project tracker",
          "<strong>Supabase</strong> — \"super\" + \"base\"; powerful foundation",
        ],
      },
      {
        type: "heading",
        level: 3,
        text: "5. Try Alternative TLDs",
      },
      {
        type: "paragraph",
        text: "If the .com is taken for your ideal name, don't give up on the name entirely. Modern TLDs like <strong>.app</strong>, <strong>.dev</strong>, <strong>.io</strong>, and <strong>.co</strong> are widely accepted in tech and startup circles. Some companies have even built iconic brands on non-.com domains.",
      },
      {
        type: "list",
        items: [
          "<strong>cal.com</strong> — scheduling (acquired the .com later, started as calendso.com)",
          "<strong>itch.io</strong> — indie game marketplace",
          "<strong>deno.dev</strong> — JavaScript runtime",
          "<strong>railway.app</strong> — infrastructure platform",
          "<strong>cursor.com</strong> — AI code editor (was previously on .so)",
        ],
      },
      {
        type: "callout",
        text: "The best approach: check your preferred name across <strong>multiple TLDs simultaneously</strong>. A name might be taken on .com but available on .app or .dev. <strong><a href=\"/\" class=\"underline\">domhaul</a></strong> checks all major TLDs at once so you can compare options instantly.",
      },
      {
        type: "heading",
        level: 3,
        text: "6. Add a Prefix or Suffix",
      },
      {
        type: "paragraph",
        text: "When a great base word is taken, adding a short prefix or suffix can create something equally strong. Common startup prefixes include <strong>get</strong>, <strong>try</strong>, <strong>use</strong>, <strong>go</strong>, and <strong>my</strong>. Suffixes like <strong>-hq</strong>, <strong>-app</strong>, <strong>-labs</strong>, and <strong>-ai</strong> also work well.",
      },
      {
        type: "list",
        items: [
          "<strong>getdbt.com</strong> — \"get\" + dbt (data build tool)",
          "<strong>tryghost.org</strong> — \"try\" + ghost (blogging platform)",
          "<strong>usebruno.com</strong> — \"use\" + bruno (API client)",
          "<strong>gohighlevel.com</strong> — \"go\" + highlevel (marketing platform)",
          "<strong>netlify.app</strong> — uses the .app TLD itself as a suffix pattern",
        ],
      },
      {
        type: "heading",
        level: 3,
        text: "7. Use AI to Generate Ideas",
      },
      {
        type: "paragraph",
        text: "AI domain name generators have gotten remarkably good at producing creative, relevant suggestions. Instead of manually brainstorming hundreds of combinations, you can describe your product in plain language and get dozens of brandable options — with availability checked automatically.",
      },
      {
        type: "paragraph",
        text: "This is especially powerful because AI can explore naming patterns you wouldn't think of. It might combine words from different languages, use unexpected metaphors, or find compound words that sound natural but aren't obvious.",
      },
      {
        type: "image",
        src: "/blog/domhaul-startup-domains.png",
        alt: "domhaul generating domain name ideas for a fitness app startup — showing available .com and .app domains with AI-generated creative names",
        caption:
          "Using domhaul to generate domain name ideas for a fitness app. The AI suggests creative names and checks availability across .com and .app simultaneously.",
      },
      {
        type: "heading",
        level: 2,
        text: "Real Examples: How Successful Startups Named Themselves",
      },
      {
        type: "paragraph",
        text: "Looking at how well-funded startups chose their domains reveals clear patterns. Here's a breakdown of naming strategies used by companies that went on to raise significant funding:",
      },
      {
        type: "list",
        items: [
          "<strong>Vercel</strong> (compound/coined) — sounds like \"versatile\" + \"cell\". Short, unique, tech-appropriate. The .com was available.",
          "<strong>Retool</strong> (verb prefix) — \"re\" + \"tool\". Instantly communicates rebuilding tools. Clear, memorable, two syllables.",
          "<strong>Loom</strong> (metaphor) — a weaving device. Evokes creating/recording something. Just four letters.",
          "<strong>Plaid</strong> (metaphor) — a pattern of interwoven threads. Perfect for a financial data connection company.",
          "<strong>Deel</strong> (modified spelling) — a play on \"deal\" with a Dutch word meaning \"part/share\". International appeal, four letters.",
          "<strong>Airtable</strong> (compound) — \"air\" + \"table\". Suggests a lightweight, cloud-based spreadsheet. Easy to spell and remember.",
        ],
      },
      {
        type: "paragraph",
        text: "The common thread? These names are all <strong>under 8 characters</strong>, <strong>easy to pronounce</strong>, and <strong>evocative without being literal</strong>. None of them describe their product directly — \"Vercel\" doesn't say \"hosting\" and \"Plaid\" doesn't say \"banking API\" — but they all <em>feel</em> right for their brand.",
      },
      {
        type: "heading",
        level: 2,
        text: "Domain Names to Avoid for Your Startup",
      },
      {
        type: "paragraph",
        text: "Just as important as knowing good strategies is knowing what to avoid. These patterns consistently lead to weak, forgettable domains:",
      },
      {
        type: "list",
        items: [
          "<strong>Literal descriptions.</strong> \"best-project-management-software.com\" is forgettable and looks spammy. It's a keyword, not a brand.",
          "<strong>Names longer than 15 characters.</strong> Every extra character is another chance for a typo. If it doesn't fit comfortably on a business card, it's too long.",
          "<strong>Hyphens.</strong> \"my-startup-name.com\" signals that you couldn't get the real domain. It's also nearly impossible to communicate verbally.",
          "<strong>Numbers.</strong> \"startup365.com\" creates confusion — is it the number or the word? People will misremember it.",
          "<strong>Trendy misspellings.</strong> Dropping vowels (\"flickr\" style) felt fresh in 2005 but looks dated now. It also means constantly correcting people.",
          "<strong>Obscure TLDs.</strong> \".xyz\", \".info\", \".biz\" carry spam connotations. Stick to .com, .co, .io, .app, or .dev for startup credibility.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Step-by-Step: Finding Your Startup's Domain Name",
      },
      {
        type: "paragraph",
        text: "Here's a practical workflow you can follow right now to find a great domain for your startup:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "<strong>Define your brand attributes.</strong> Write down 3-5 words that describe how you want your startup to feel. Technical? Playful? Premium? Minimal? These words will guide your naming direction.",
          "<strong>Brainstorm word lists.</strong> Create lists of words related to your product, your industry, your target audience, and your brand attributes. Include verbs, nouns, and adjectives.",
          "<strong>Apply the naming strategies above.</strong> Combine words, coin new ones, try metaphors, add prefixes/suffixes. Aim for a list of 20-30 candidates.",
          "<strong>Run them through an AI generator.</strong> Use <a href=\"/\" class=\"underline\">domhaul</a> to describe your startup and get additional AI-generated ideas you haven't considered.",
          "<strong>Check availability across TLDs.</strong> For each candidate, check .com, .app, .dev, and .co. Also check social media handle availability on Twitter/X, Instagram, and LinkedIn.",
          "<strong>Test with real people.</strong> Say your top 3-5 names out loud to friends or colleagues. Can they spell it after hearing it once? Do they remember it the next day? This \"radio test\" eliminates names that look good on screen but fail in conversation.",
          "<strong>Secure the domain quickly.</strong> Good domains get registered every day. Once you've found the one, don't wait. Register it immediately — domains typically cost under $15/year, a negligible cost compared to the risk of losing your perfect name.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Frequently Asked Questions",
      },
      {
        type: "faq",
        items: [
          {
            question: "Should my startup's domain name describe what we do?",
            answer:
              "Not necessarily. Many of the most successful startups have abstract or metaphorical names — Slack, Stripe, Notion, Figma. A descriptive name can help with initial clarity, but a brandable name gives you more room to grow and pivot. The key is that the name should be memorable and easy to spell, whether it's descriptive or abstract.",
          },
          {
            question: "What if the .com version of my ideal name is taken?",
            answer:
              "You have several options: try alternative TLDs (.app, .dev, .io, .co), add a short prefix like 'get' or 'try' (e.g., getnextapp.com), modify the name slightly while keeping the spirit, or consider purchasing the .com from the current owner (many parked domains are for sale). For tech startups, .app and .io are widely accepted alternatives.",
          },
          {
            question: "How much should I spend on a startup domain name?",
            answer:
              "Standard domain registration costs $10-20/year. If your ideal .com is on the aftermarket, expect to pay $500-5,000 for a decent startup-quality name. Premium single-word .coms can cost $10,000-100,000+. For most early-stage startups, finding a great available name (or spending under $1,000 on the aftermarket) is the best balance of quality and budget.",
          },
          {
            question: "Should I buy multiple TLDs for my startup name?",
            answer:
              "At minimum, secure the .com if it's available (even if you primarily use .io or .app). Buying the most common alternative TLDs (.com, .co, .net) prevents competitors or squatters from registering confusingly similar domains. This typically costs under $50/year total and is cheap insurance for your brand.",
          },
          {
            question: "How long should a startup domain name be?",
            answer:
              "Aim for 6-12 characters (excluding the TLD). The average domain length among Y Combinator companies is about 7 characters. Shorter domains are easier to remember, type, and share. Very few successful startups have domains longer than 15 characters.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Find Your Startup's Domain Name Now",
      },
      {
        type: "paragraph",
        text: "The domain landscape changes every day — names that are available today might be gone tomorrow. The strategies in this guide give you a proven framework for generating strong candidates, but the critical step is actually checking availability and securing your name before someone else does.",
      },
      {
        type: "callout",
        text: "Skip the manual brainstorming. <strong><a href=\"/\" class=\"underline\">domhaul</a></strong> combines AI-powered name generation with real-time availability checking across multiple TLDs. Describe your startup in a sentence and get a list of available, brandable domain names in seconds. <a href=\"/\" class=\"underline\">Try it free</a>.",
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
