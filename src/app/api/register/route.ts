import { NextRequest, NextResponse } from "next/server";

const AFF_BASE = "https://namecheap.pxf.io/k4jn2z";

export function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain");
  if (!domain) {
    return NextResponse.redirect(AFF_BASE);
  }

  const dest = `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`;
  const url = `${AFF_BASE}?u=${encodeURIComponent(dest)}`;

  return NextResponse.redirect(url);
}
