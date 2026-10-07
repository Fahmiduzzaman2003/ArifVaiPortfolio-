import { CollaborationCta } from "@/components/home/collaboration-cta";
import { AcademicOverview, FeaturedAchievements, SelectedWork } from "@/components/home/home-overview";
import { InteractiveHero } from "@/components/home/interactive-hero";
import {
  getAchievements,
  getEducation,
  getExperiences,
  getProjects,
  getPublicProfile,
  getPublications,
  getResearchInterests,
  getSkills,
} from "@/services/public-content";

export default async function HomePage() {
  const [profile, researchInterests, publications, projects, experiences, education, achievements, skills] =
    await Promise.all([
      getPublicProfile(),
      getResearchInterests(),
      getPublications(),
      getProjects(),
      getExperiences(),
      getEducation(),
      getAchievements(),
      getSkills(),
    ]);

  return (
    <main>
      <InteractiveHero
        profile={profile}
        interests={researchInterests}
        publicationCount={publications.length}
        projectCount={projects.length}
      />
      <SelectedWork publications={publications} projects={projects} />
      <FeaturedAchievements achievements={achievements} />
      <AcademicOverview
        experiences={experiences}
        education={education}
        skills={skills}
      />
      <CollaborationCta />
    </main>
  );
}

