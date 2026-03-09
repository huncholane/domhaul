import { NextRequest } from "next/server";

const AFF_BASE = "https://namecheap.pxf.io/YVg5vm";

function affiliateUrl(domain: string): string {
  const dest = `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`;
  return `${AFF_BASE}?u=${encodeURIComponent(dest)}`;
}

function directUrl(domain: string): string {
  return `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`;
}

/**
 * Resolve the pxf.io redirect chain server-side to get the final
 * namecheap.com URL with tracking params — used as fallback for
 * ad-blocker users who can't reach pxf.io directly.
 */
async function resolveFallbackUrl(domain: string): Promise<string> {
  try {
    const res = await fetch(affiliateUrl(domain), { redirect: "follow" });
    if (res.url.includes("namecheap.com")) return res.url;
  } catch {
    // fall through
  }
  return directUrl(domain);
}

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain");
  if (!domain) {
    return new Response(null, {
      status: 302,
      headers: { Location: "https://www.namecheap.com/domains/" },
    });
  }

  // Primary: pxf.io link (registers a real click from the user's browser)
  const primary = affiliateUrl(domain);
  // Fallback: server-resolved namecheap.com URL with tracking params
  const fallback = await resolveFallbackUrl(domain);

  // Serve a tiny HTML page that tries the affiliate link first.
  // If the ad blocker blocks the navigation, JS catches it and
  // falls back to the direct namecheap.com URL with tracking params.
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Redirecting to Namecheap...</title>
<style>body{background:#09090b;color:#a1a1aa;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}a{color:#6ee7b7}</style>
</head>
<body>
<p>Redirecting to Namecheap... <a id="f" href="${fallback}">Click here</a> if not redirected.</p>
<script>
(function(){
  var img = new Image();
  img.onload = function(){ window.location.replace("${primary}"); };
  img.onerror = function(){ window.location.replace("${fallback}"); };
  img.src = "https://namecheap.pxf.io/i/7039662/386170/5618";
  setTimeout(function(){ window.location.replace("${fallback}"); }, 2000);
})();
</script>
<noscript><meta http-equiv="refresh" content="0;url=${fallback}"></noscript>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
