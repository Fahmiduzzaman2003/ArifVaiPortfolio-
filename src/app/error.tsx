"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="page-shell grid min-h-[70vh] place-items-center py-20 text-center"><div><p className="eyebrow">Unexpected error</p><h1 className="mt-4 font-serif text-4xl">The research record could not be loaded.</h1><p className="mt-4 text-[var(--muted)]">Please retry. No changes were made.</p><Button onClick={reset} className="mt-7">Try again</Button></div></main>; }

