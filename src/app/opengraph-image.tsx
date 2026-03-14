import { ImageResponse } from "next/og";

export const alt = "Dream Team Africa — Culture africaine à Paris";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1A1A1A",
          position: "relative",
        }}
      >
        {/* Decorative accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            backgroundColor: "#8B6F4E",
          }}
        />

        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "600px",
            height: "400px",
            background:
              "radial-gradient(ellipse at bottom left, rgba(139,111,78,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
            textAlign: "center",
          }}
        >
          {/* Logo badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              backgroundColor: "#8B6F4E",
              borderRadius: "16px",
              marginBottom: "32px",
            }}
          >
            <span
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-1px",
              }}
            >
              DTA
            </span>
          </div>

          {/* Site name */}
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: "#FFFFFF",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Dream Team Africa
          </h1>

          {/* Decorative line */}
          <div
            style={{
              width: "80px",
              height: "3px",
              backgroundColor: "#8B6F4E",
              marginTop: "24px",
              marginBottom: "24px",
              borderRadius: "2px",
            }}
          />

          {/* Tagline */}
          <p
            style={{
              fontSize: "24px",
              color: "#C4B5A4",
              margin: 0,
              maxWidth: "700px",
              lineHeight: 1.4,
            }}
          >
            La plateforme de reference pour la promotion de la culture africaine
            a Paris
          </p>

          {/* Keywords */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "32px",
            }}
          >
            {["Evenements", "Marketplace", "Journal"].map((label) => (
              <span
                key={label}
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#8B6F4E",
                  backgroundColor: "rgba(139,111,78,0.15)",
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              color: "#6B6B6B",
            }}
          >
            dreamteamafrica.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
