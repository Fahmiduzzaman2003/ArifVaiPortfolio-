import type { Metadata } from "next";
import { AppChrome } from "@/components/layout/app-chrome";
import { Providers } from "@/components/providers";
import { profile } from "@/lib/placeholder-data";
import { getPublicProfile, getSiteSettings } from "@/services/public-content";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const [publicProfile, settings] = await Promise.all([getPublicProfile(), getSiteSettings()]);
  const siteTitle = settings?.siteTitle || `${publicProfile.name || profile.name} â€” Research Portfolio`;
  return { title: { default: siteTitle, template: `%s â€” ${publicProfile.name || profile.name}` }, description: publicProfile.statement || profile.statement };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [publicProfile, settings] = await Promise.all([getPublicProfile(), getSiteSettings()]);
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body><Providers><AppChrome profile={publicProfile} settings={settings}>{children}</AppChrome></Providers></body>
    </html>
  );
}

