import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const dynamic = "force-static";
export const alt = `${profile.nameEn} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// OG 렌더러에는 한글 폰트가 없어서 라틴 문구만 쓴다.
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
          backgroundImage: "radial-gradient(900px circle at 72% 28%, rgba(183,188,192,0.10), transparent 62%)",
          color: "#e9ebec",
          fontFamily: "IBM Plex Mono, monospace",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 3, color: "#9aa0a5" }}>
          <div style={{ display: "flex" }}>INDEX / 00</div>
          <div style={{ display: "flex" }}>{profile.role.toUpperCase()}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              height: 1,
              background: "linear-gradient(90deg, transparent, #33373c 15%, #e3e6e8 50%, #33373c 85%, transparent)",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 132,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -4,
              backgroundImage:
                "linear-gradient(105deg, #4b4f54 0%, #8d9296 18%, #f1f3f4 40%, #a9aeb2 55%, #555b60 78%, #b6babe 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {profile.nameEn}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 3 }}>
          <div style={{ display: "flex", color: "#c7a876" }}>ENGINEERING SYSTEMS IN OPERATION</div>
          <div style={{ display: "flex", color: "#9aa0a5" }}>BACKEND / FRONTEND / INFRA</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
