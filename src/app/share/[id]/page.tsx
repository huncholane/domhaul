import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getShare } from "@/lib/cache";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const share = await getShare(id);
  if (!share) return {};

  const count = share.results.length;
  const title = `Found ${count} available domain${count !== 1 ? "s" : ""} — domhaul`;
  const description = `AI-generated domains for "${share.prompt}" — ${count} available. Try domhaul to find yours.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: `/api/og?id=${id}`, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og?id=${id}`],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const share = await getShare(id);
  if (!share) notFound();

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt=""
            width={36}
            height={36}
            className="rounded-lg"
          />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            domhaul
          </h1>
        </Link>
      </header>

      <div className="mb-6">
        <p className="text-sm text-zinc-500">Prompt</p>
        <p className="mt-1 text-lg font-medium text-zinc-200">
          &ldquo;{share.prompt}&rdquo;
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-medium text-emerald-400">
          {share.results.length} available domain
          {share.results.length !== 1 ? "s" : ""}
        </h2>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {share.results.map((r) => (
          <div
            key={r.domain}
            className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-zinc-100">
                {r.domain}
              </span>
              {r.brandScore != null && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                    r.brandScore >= 75
                      ? "bg-emerald-500/15 text-emerald-400"
                      : r.brandScore >= 50
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-zinc-700/50 text-zinc-500"
                  }`}
                >
                  {r.brandScore}
                </span>
              )}
            </div>
            <a
              href={`/api/register?domain=${encodeURIComponent(r.domain)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Register
            </a>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Try domhaul — Find your perfect domain
        </Link>
      </div>
    </div>
  );
}
