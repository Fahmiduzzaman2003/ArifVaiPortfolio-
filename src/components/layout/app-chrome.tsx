"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SectionProgress } from "@/components/interaction/section-progress";
import { profile as fallbackProfile } from "@/lib/placeholder-data";
export function AppChrome({ children, profile, settings }: { children: ReactNode; profile: typeof fallbackProfile; settings?: { footer?: { statement?: string } } | null }) { const pathname = usePathname(); const isAdmin = pathname.startsWith("/admin"); if (isAdmin) return children; return <div className="public-shell"><SectionProgress /><SiteHeader profile={profile} />{children}<SiteFooter profile={profile} statement={settings?.footer?.statement} /></div>; }
