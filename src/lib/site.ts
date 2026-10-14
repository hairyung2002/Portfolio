/**
 * OG·sitemap·robots에 쓰는 절대 주소.
 * NEXT_PUBLIC_SITE_URL이 있으면 그 값을, 없으면 Vercel이 빌드 때 넣어주는
 * 프로덕션 도메인을 쓴다. 로컬 빌드에서는 localhost로 떨어진다.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
