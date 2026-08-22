import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const dynamic = "force-static";
export const alt = profile.tagline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#07080a",
          backgroundImage:
            "linear-gradient(135deg, #0d0f12 0%, #07080a 55%, #07080a 100%)",
          color: "#e9ebec",
          fontFamily: "IBM Plex Mono, monospace",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#868c91" }}>
            {profile.name.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#868c91" }}>
            INDEX / 01
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1,
              color: "#f1f3f4",
            }}
          >
            BUILDING SYSTEMS
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1,
              color: "#f1f3f4",
            }}
          >
            THAT SURVIVE REAL
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1,
              background: "linear-gradient(90deg, #b6babe 0%, #e3e6e8 45%, #555b60 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            CONDITIONS.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 3, color: "#c7a876" }}>
            BACKEND / FRONTEND / INFRA
          </div>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 3, color: "#868c91" }}>
            {profile.role.toUpperCase()}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
