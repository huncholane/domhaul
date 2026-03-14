import { ImageResponse } from "@vercel/og";
import { getShare } from "@/lib/cache";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          color: "#a1a1aa",
          fontSize: 32,
        }}
      >
        domhaul
      </div>,
      { width: 1200, height: 630 }
    );
  }

  const share = await getShare(id);

  if (!share) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          color: "#a1a1aa",
          fontSize: 32,
        }}
      >
        Share not found
      </div>,
      { width: 1200, height: 630 }
    );
  }

  const domains = share.results.slice(0, 8);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        padding: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontSize: 28, fontWeight: 700, color: "#e4e4e7" }}>
          domhaul
        </span>
      </div>
      <div style={{ fontSize: 16, color: "#71717a", marginBottom: "32px" }}>
        AI-powered domain name generator
      </div>

      <div style={{ fontSize: 20, color: "#a1a1aa", marginBottom: "6px" }}>
        Prompt:
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 26,
          fontWeight: 600,
          color: "#e4e4e7",
          marginBottom: "32px",
          overflow: "hidden",
        }}
      >
        &ldquo;{share.prompt}&rdquo;
      </div>

      <div
        style={{
          fontSize: 18,
          color: "#34d399",
          marginBottom: "16px",
          fontWeight: 600,
        }}
      >
        {share.results.length} available domain
        {share.results.length !== 1 ? "s" : ""} found
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {domains.map((d) => (
          <div
            key={d.domain}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              padding: "10px 16px",
            }}
          >
            <span style={{ fontSize: 20, color: "#e4e4e7" }}>{d.domain}</span>
            {d.brandScore != null && (
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color:
                    d.brandScore >= 75
                      ? "#34d399"
                      : d.brandScore >= 50
                        ? "#fbbf24"
                        : "#71717a",
                }}
              >
                {d.brandScore}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
