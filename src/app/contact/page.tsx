import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, GithubIcon, LinkedinIcon, WhatsAppIcon } from "@/components/common/brand-icons";
import { PageIntro } from "@/components/common/page-intro";
import { ContactForm } from "@/components/contact/contact-form";
import { safeExternalHref } from "@/lib/utils";
import { getPublicProfile } from "@/services/public-content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const profile = await getPublicProfile();
  const socials = [
    { label: "LinkedIn", detail: "Professional network", href: profile.social?.linkedIn, Icon: LinkedinIcon, color: "var(--lab-cyan)" },
    { label: "GitHub", detail: "Code and repositories", href: profile.social?.github, Icon: GithubIcon, color: "white" },
    { label: "Facebook", detail: "Social profile", href: profile.social?.facebook, Icon: FacebookIcon, color: "var(--lab-violet)" },
    { label: "WhatsApp", detail: "Direct conversation", href: profile.social?.whatsApp, Icon: WhatsAppIcon, color: "var(--lab-green)" },
  ].map((item) => ({ ...item, href: safeExternalHref(item.href) })).filter((item) => item.href);
  const email = profile.email && !profile.email.startsWith("YOUR_") ? profile.email : undefined;
  const phone = profile.phone && !profile.phone.startsWith("+000") ? profile.phone : undefined;
  const location = profile.location && !profile.location.startsWith("YOUR_") ? profile.location : undefined;

  return <main className="lab-section"><PageIntro eyebrow="Contact & collaboration" title="Letâ€™s start with a clear question." description="Share the problem, context, and kind of collaboration you have in mind. The form delivers directly to the configured inbox and stores a secure copy for follow-up." ornament="neural" /><section className="relative mx-auto grid max-w-[1280px] gap-8 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[.82fr_1.18fr]">
    <aside className="space-y-5"><div className="rounded-3xl border border-[var(--lab-line)] bg-[var(--lab-panel)] p-6 md:p-8"><p className="lab-kicker">Direct channels</p><h2 className="mt-4 font-serif text-3xl text-white">Connect where it is convenient.</h2><p className="mt-4 text-sm leading-7 text-[var(--lab-muted)]">Use the inquiry form for detailed proposals, or open a verified profile for a quick introduction.</p><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">{socials.map(({ label, detail, href, Icon, color }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="group flex min-h-20 items-center gap-4 rounded-2xl border border-[var(--lab-line)] bg-[var(--lab-bg)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--lab-cyan)]/45"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.035]" style={{ color }}><Icon className="size-5" /></span><span className="min-w-0 flex-1"><strong className="block text-sm text-white">{label}</strong><small className="mt-1 block text-[11px] text-[var(--lab-muted)]">{detail}</small></span><ArrowUpRight size={15} className="text-[var(--lab-muted)] transition group-hover:text-[var(--lab-cyan)]" /></a>)}</div>{!socials.length && <p className="mt-7 rounded-2xl border border-dashed border-[var(--lab-line-strong)] p-5 text-xs leading-6 text-[var(--lab-muted)]">Social links will appear after they are added under Admin â†’ Profile.</p>}</div>
      <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--lab-line)] bg-[var(--lab-line)]">{email && <a href={`mailto:${email}`} className="flex items-center gap-3 bg-[var(--lab-panel)] p-5 text-sm text-[var(--lab-text)] transition hover:text-[var(--lab-cyan)]"><Mail size={16} /> <span className="min-w-0 truncate">{email}</span></a>}{phone && <a href={`tel:${phone}`} className="flex items-center gap-3 bg-[var(--lab-panel)] p-5 text-sm text-[var(--lab-text)] transition hover:text-[var(--lab-cyan)]"><Phone size={16} /> {phone}</a>}{location && <div className="flex items-center gap-3 bg-[var(--lab-panel)] p-5 text-sm text-[var(--lab-text)]"><MapPin size={16} /> {location}</div>}</div>
    </aside>
    <div className="rounded-3xl border border-[var(--lab-line-strong)] bg-[var(--lab-panel)] p-6 shadow-[0_30px_90px_rgba(0,0,0,.25)] md:p-10"><div className="mb-8 border-b border-[var(--lab-line)] pb-6"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[var(--lab-cyan)]">Secure inquiry</p><h2 className="mt-3 font-serif text-3xl text-white">Tell me what you are working on.</h2><p className="mt-3 text-sm leading-6 text-[var(--lab-muted)]">You will see a delivery confirmation only after the mail service accepts the message.</p></div><ContactForm /></div>
  </section></main>;
}

