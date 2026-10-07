import { SingletonForm } from "@/components/admin/singleton-form";

export default function ProfileAdminPage() {
  return <SingletonForm
    kind="profile"
    title="Profile & research identity"
    description="These fields drive the homepage profile, portrait, scholarly links, social contact buttons, biography, and contact details."
    fields={[
      { name: "name", label: "Researcher name" },
      { name: "designation", label: "Job title / academic designation" },
      { name: "institution", label: "Current institution or affiliation" },
      { name: "statement", label: "One-line research profile", multiline: true },
      { name: "introduction", label: "Short profile details", multiline: true },
      { name: "availability", label: "Current availability" },
      { name: "collaborationInterests", label: "Research and collaboration interests", multiline: true },
      { name: "identityHighlights", label: "Personal identity highlights", multiline: true, help: "One per line in Title | Description format. Keep these personal and distinct from the academic details already shown on the left." },
      { name: "leisureInterests", label: "Leisure interests", multiline: true, help: "Separate interests with commas or new lines. These appear only on the personal side of the homepage card." },
      { name: "portrait.url", label: "Portrait image URL", type: "url", help: "Use the secure Cloudinary URL from Media & CV." },
      { name: "portrait.alt", label: "Portrait alt text" },
      { name: "social.scholar", label: "Google Scholar profile URL", type: "url" },
      { name: "social.orcid", label: "ORCID profile URL", type: "url" },
      { name: "social.researchGate", label: "ResearchGate profile URL", type: "url" },
      { name: "social.github", label: "GitHub profile URL", type: "url" },
      { name: "social.linkedIn", label: "LinkedIn profile URL", type: "url" },
      { name: "social.facebook", label: "Facebook profile URL", type: "url" },
      { name: "social.whatsApp", label: "WhatsApp chat URL", type: "url", help: "Use a complete URL such as https://wa.me/8801XXXXXXXXX (digits only after wa.me)." },
      { name: "biography", label: "Academic biography", multiline: true },
      { name: "philosophy", label: "Research philosophy", multiline: true },
      { name: "motivation", label: "Motivation", multiline: true },
      { name: "longTermGoals", label: "Long-term research goals", multiline: true },
      { name: "phdObjective", label: "PhD objective", multiline: true },
      { name: "email", label: "Public email", type: "email" },
      { name: "phone", label: "Public phone" },
      { name: "location", label: "Location" },
    ]}
  />;
}
