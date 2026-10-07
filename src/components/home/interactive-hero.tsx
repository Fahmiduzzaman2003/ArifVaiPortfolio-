import Link from "next/link";
import { ArrowDown, ArrowUpRight, BookOpenText, FolderKanban, Mail, MapPin, Radio, ScanSearch } from "lucide-react";
import { GithubIcon, GoogleScholarIcon, LinkedinIcon, OrcidIcon, ResearchGateIcon } from "@/components/common/brand-icons";
import { Reveal } from "@/components/common/reveal";
import { AvailabilityTicker } from "@/components/home/availability-ticker";
import { ProfileShowcase } from "@/components/home/profile-showcase";
import { profile as fallbackProfile } from "@/lib/placeholder-data";
import { safeExternalHref } from "@/lib/utils";
import type { ResearchInterest } from "@/types/content";

type Profile = typeof fallbackProfile;

type InteractiveHeroProps = {
  profile: Profile;
  interests: ResearchInterest[];
  publicationCount: number;
  projectCount: number;
};

const cleanInline = (value: string) => value.replace(/,\s*/g, ", ").replace(/\s+/g, " ").trim();

export function InteractiveHero({ profile, interests, publicationCount, projectCount }: InteractiveHeroProps) {
  const scholar = safeExternalHref(profile.social?.scholar);
  const location = profile.location && !profile.location.startsWith("YOUR_") ? profile.location : undefined;
  const nameParts = profile.name.trim().split(/\s+/);
  const surname = nameParts.length > 1 ? nameParts.pop() : "";
  const givenName = nameParts.join(" ") || profile.name;
  const focusLabels = interests.slice(0, 3).map((interest) => interest.title);
  const evidence = [
    { label: "Publications", value: publicationCount, href: "/publications", tone: "violet", Icon: BookOpenText },
    { label: "Projects", value: projectCount, href: "/projects", tone: "green", Icon: FolderKanban },
    { label: "Focus areas", value: interests.length, href: "/research", tone: "cyan", Icon: ScanSearch },
  ].filter((item) => item.value > 0);
  const socialLinks = [
    { label: "ORCID", href: profile.social?.orcid, Icon: OrcidIcon },
    { label: "ResearchGate", href: profile.social?.researchGate, Icon: ResearchGateIcon },
    { label: "GitHub", href: profile.social?.github, Icon: GithubIcon },
    { label: "LinkedIn", href: profile.social?.linkedIn, Icon: LinkedinIcon },
  ] as const;
  const visibleSocialLinks = socialLinks.map((item) => ({ ...item, safe: safeExternalHref(item.href) })).filter((item) => item.safe);

  return <section className="profile-hero relative overflow-hidden border-b border-[var(--lab-line)] px-4 pb-12 pt-24 md:px-8 md:pb-16 md:pt-28">
    <div className="profile-ambient" aria-hidden="true" />
    <div className="profile-orb profile-orb-one" aria-hidden="true" />
    <div className="profile-orb profile-orb-two" aria-hidden="true" />

    <div className="profile-hero-layout relative mx-auto max-w-[1380px]">
      <div className="profile-hero-copy relative z-10 min-w-0">
        <Reveal>
          <div className="profile-status-row">
            <AvailabilityTicker value={profile.availability} />
            {location && <span className="profile-location"><MapPin size={13} />{location}</span>}
          </div>
        </Reveal>

        <Reveal delay={0.04}>
          <div className="profile-discipline-line">
            <span aria-hidden="true" />
            Researcher / Computer vision / BioML
            <i>{String(interests.length).padStart(2, "0")} active areas</i>
          </div>
        </Reveal>

        <Reveal delay={0.07}>
          <div className="profile-name-stage">
            <h1 className="profile-name"><span>{givenName}</span>{surname && <span className="profile-name-accent"> {surname}</span>}</h1>
            <i aria-hidden="true" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="profile-credential">
            <span>Current position</span>
            <div>
              <strong>{cleanInline(profile.designation)}</strong>
              {profile.institution && <p>{cleanInline(profile.institution)}</p>}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.13}>
          <div className="profile-thesis">
            <span>Research direction</span>
            <div>
              <h2>{profile.statement}</h2>
              <p>{profile.introduction}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="profile-primary-actions">
            {scholar && <a href={scholar} target="_blank" rel="noopener noreferrer" className="profile-primary-cta"><span className="profile-action-icon"><GoogleScholarIcon /></span><span><small>Research profile</small>Google Scholar</span><ArrowUpRight size={15} /></a>}
            <Link href="#selected-work" className="profile-secondary-cta"><span className="profile-action-icon"><BookOpenText /></span><span><small>Evidence & output</small>Selected work</span><ArrowUpRight size={15} /></Link>
            <Link href="/contact" className="profile-secondary-cta"><span className="profile-action-icon"><Mail /></span><span><small>Discuss research</small>Contact</span><ArrowUpRight size={15} /></Link>
          </div>
        </Reveal>

        {evidence.length > 0 &&
          <div className="profile-proof-rail" aria-label="Research record at a glance">
            <div className="profile-proof-heading"><span>Research record</span><small>Portfolio index</small></div>
            <div className="profile-proof-items">
              {evidence.map(({ label, value, href, tone, Icon }) => <Link key={label} href={href} data-tone={tone}>
                <Icon size={14} aria-hidden="true" />
                <strong>{String(value).padStart(2, "0")}</strong>
                <span>{label}</span>
                <ArrowUpRight size={11} aria-hidden="true" />
              </Link>)}
            </div>
          </div>
        }

        {focusLabels.length > 0 && <Reveal delay={0.2}>
          <div className="profile-focus-list" aria-label="Research interests">
            {focusLabels.map((label, index) => <span key={label}><i>{String(index + 1).padStart(2, "0")}</i>{label}</span>)}
          </div>
        </Reveal>}

        <Reveal delay={0.22}>
          <div className="profile-link-dock">
            <div className="profile-link-dock-label"><Radio size={12} />Academic network</div>
            <div className="profile-link-dock-items">{visibleSocialLinks.map(({ label, safe, Icon }) => <a key={label} href={safe} target="_blank" rel="noopener noreferrer" aria-label={`${label} profile`}><Icon /><span>{label}</span><ArrowUpRight /></a>)}</div>
            <a href="#selected-work" className="profile-scroll-cue"><span>Featured work</span><ArrowDown size={13} /></a>
          </div>
        </Reveal>
      </div>

      <Reveal className="profile-visual-reveal w-full" delay={0.1}>
        <ProfileShowcase
          name={profile.name}
          identityHighlights={profile.identityHighlights}
          leisureInterests={profile.leisureInterests}
          portrait={profile.portrait}
          focusLabels={focusLabels}
        />
      </Reveal>
    </div>
  </section>;
}
