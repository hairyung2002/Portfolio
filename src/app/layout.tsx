import type { Metadata } from "next";
import { IBM_Plex_Sans_KR, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { TransitionProvider } from "@/components/TransitionProvider";
import { allProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";

const plexKR = IBM_Plex_Sans_KR({
  variable: "--font-plex-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const title = {
  default: `${profile.name} — 운영되는 시스템을 다루는 엔지니어`,
  template: `%s — ${profile.name}`,
};
const description =
  "실제 장애, 실제 결제, 실제 사용자 앞에서 내린 판단과 트레이드오프를 기록한 백엔드 중심 풀스택 엔지니어 포트폴리오.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: `${profile.name} 포트폴리오`,
    title: title.default,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: title.default,
    description,
  },
};

// 헤더의 경로 표시에 필요한 이름만 넘긴다. 프로젝트 본문은 클라이언트 번들에 싣지 않는다.
const projectNames = Object.fromEntries(allProjects.map((p) => [p.slug, p.name]));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${plexKR.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body>
        <a className="skip" href="#main">
          본문으로 건너뛰기
        </a>
        <SmoothScrollProvider>
          <TransitionProvider header={<SiteHeader projectNames={projectNames} />}>{children}</TransitionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
