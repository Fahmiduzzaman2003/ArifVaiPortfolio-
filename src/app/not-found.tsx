import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <main className="page-shell grid min-h-[70vh] place-items-center py-20 text-center"><div><p className="font-serif text-8xl text-[var(--ink)]/10">404</p><h1 className="mt-4 font-serif text-4xl">This research note is not in the record.</h1><p className="mt-4 text-[var(--muted)]">The page may be unpublished, moved, or unavailable.</p><Button asChild className="mt-7"><Link href="/"><ArrowLeft size={16} /> Return home</Link></Button></div></main>; }

