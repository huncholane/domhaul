import { NextRequest, NextResponse } from "next/server";

const AFF_BASE = "https://namecheap.pxf.io/k4jn2z";

// Namecheap registration URL without affiliate tracking (fallback)
function directUrl(domain: string): string {
  return `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`;
}

/**
 * Resolves the affiliate redirect chain server-side so the user's browser
 * only ever navigates to namecheap.com (not pxf.io), which avoids ad blockers.
 */
async function resolveAffiliateUrl(domain: string): Promise<string> {
  const dest = directUrl(domain);
  const affUrl = `${AFF_BASE}?u=${encodeURIComponent(dest)}`;

  try {
    // Follow the full redirect chain server-side to get the final
    // namecheap.com URL with tracking params (clickID, irgwc, etc.)
    const res = await fetch(affUrl, { redirect: "follow" });
    const finalUrl = res.url;

    // Only use it if we actually landed on namecheap.com
    if (finalUrl.includes("namecheap.com")) {
      return finalUrl;
    }
  } catch {
    // Network error — fall through to direct link
  }

  return dest;
}

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain");
  if (!domain) {
    return NextResponse.redirect(
      "https://www.namecheap.com/domains/",
      { status: 302 }
    );
  }

  const url = await resolveAffiliateUrl(domain);
  return NextResponse.redirect(url, { status: 302 });
}
