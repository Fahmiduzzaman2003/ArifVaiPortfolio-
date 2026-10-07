export type AdminField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "url" | "date" | "list" | "checkbox";
  options?: Array<string | { label: string; value: string }>;
  help?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
};

export type AdminModule = {
  key: string;
  singular: string;
  title: string;
  description: string;
  primaryField: string;
  duplicable?: boolean;
  fields: AdminField[];
};

export const adminModules: Record<string, AdminModule> = {
  publications: {
    key: "publications", singular: "publication", title: "Publications",
    description: "Papers, preprints, ongoing work, citations, evidence, and linked assets.", primaryField: "title",
    fields: [
      { name: "title", label: "Paper title", required: true },
      { name: "slug", label: "URL slug", required: true, help: "Example: datefnet. A pasted paper URL is safely moved to Paper / preprint URL." },
      { name: "authors", label: "Authors", type: "list", help: "One per line or separated by commas." },
      { name: "researcherAuthorPosition", label: "Your author position" },
      { name: "correspondingAuthor", label: "Corresponding author", type: "checkbox" },
      { name: "visualStyle", label: "Research visual banner", type: "select", defaultValue: "cnn-pipeline", options: [
        { label: "CNN feature pipeline", value: "cnn-pipeline" },
        { label: "Multi-stream attention fusion", value: "attention-fusion" },
        { label: "Computer vision detection", value: "vision-detection" },
      ], help: "Controls the animated architecture visual shown beside the abstract." },
      { name: "publicationType", label: "Publication type", type: "select", options: ["Journal Article", "Conference Paper", "Workshop Paper", "Preprint", "Book Chapter", "Thesis", "Dataset Paper", "Under Review", "Ongoing Research"] },
      { name: "venue", label: "Venue" }, { name: "publisher", label: "Publisher" },
      { name: "publicationYear", label: "Year", type: "number" }, { name: "publicationDate", label: "Publication date", type: "date" },
      { name: "abstract", label: "Abstract", type: "textarea" }, { name: "summary", label: "Short summary", type: "textarea" },
      { name: "researchProblem", label: "Research problem", type: "textarea" }, { name: "researchGap", label: "Research gap", type: "textarea" },
      { name: "methodology", label: "Methodology", type: "textarea" }, { name: "mainContribution", label: "Main contribution", type: "textarea" },
      { name: "individualContribution", label: "Your individual contribution", type: "textarea" }, { name: "results", label: "Verified results", type: "textarea" },
      { name: "limitations", label: "Limitations", type: "textarea" }, { name: "futureWork", label: "Future work", type: "textarea" },
      { name: "keywords", label: "Keywords", type: "list" }, { name: "researchAreas", label: "Research areas", type: "list" },
      { name: "doi", label: "DOI link", placeholder: "10.1000/example or https://doi.org/10.1000/example", help: "Paste the DOI identifier or its full doi.org URL. The publication record turns it into a clickable link." },
      { name: "links.pdf", label: "Paper / preprint URL", type: "url" }, { name: "links.publisher", label: "Publisher URL", type: "url" },
      { name: "links.code", label: "Code URL", type: "url" }, { name: "links.dataset", label: "Dataset URL", type: "url" },
      { name: "links.project", label: "Project URL", type: "url" }, { name: "citationText", label: "Citation", type: "textarea" },
      { name: "bibtex", label: "BibTeX", type: "textarea" }, { name: "publicationStatus", label: "Research status" },
    ],
  },
  "research-interests": {
    key: "research-interests", singular: "research interest", title: "Research interests",
    description: "Core vision, domains, methods, goals, and future directions.", primaryField: "title",
    fields: [
      { name: "title", label: "Title", required: true }, { name: "slug", label: "URL slug", required: true },
      { name: "category", label: "Category", type: "select", options: ["vision", "domain", "method", "goal"] },
      { name: "shortDescription", label: "Short description", type: "textarea" }, { name: "detail", label: "Detailed explanation", type: "textarea" },
      { name: "researchStatus", label: "Research status", type: "select", options: ["current", "future", "established"] },
      { name: "keywords", label: "Keywords", type: "list" }, { name: "direction", label: "Current or future direction", type: "textarea" },
    ],
  },
  projects: {
    key: "projects", singular: "project", title: "Projects",
    description: "Research and technical case studies, evaluation, outputs, and media.", primaryField: "title",
    fields: [
      { name: "title", label: "Title", required: true }, { name: "slug", label: "URL slug", required: true }, { name: "category", label: "Category" },
      { name: "summary", label: "Short summary", type: "textarea" }, { name: "description", label: "Full description", type: "textarea" },
      { name: "problem", label: "Problem statement", type: "textarea" }, { name: "researchGap", label: "Research gap", type: "textarea" },
      { name: "methodology", label: "Methodology", type: "textarea" }, { name: "contribution", label: "Contribution", type: "textarea" },
      { name: "researcherRole", label: "Your role", type: "textarea" }, { name: "dataset", label: "Datasets", type: "list" },
      { name: "models", label: "Models", type: "list" }, { name: "technologies", label: "Technologies", type: "list" },
      { name: "results", label: "Verified results", type: "textarea" }, { name: "limitations", label: "Limitations", type: "textarea" },
      { name: "futureImprovements", label: "Future improvements", type: "textarea" }, { name: "status", label: "Status" },
      { name: "startDate", label: "Start date", type: "date" }, { name: "endDate", label: "End date", type: "date" },
      { name: "links.github", label: "GitHub URL", type: "url" }, { name: "links.demo", label: "Demo URL", type: "url" },
      { name: "links.paper", label: "Paper URL", type: "url" }, { name: "links.dataset", label: "Dataset URL", type: "url" },
      { name: "links.documentation", label: "Documentation URL", type: "url" },
    ],
  },
  experience: {
    key: "experience", singular: "experience", title: "Work experience",
    description: "Research, academic, laboratory, internship, and industry roles.", primaryField: "role",
    fields: [
      { name: "role", label: "Role", required: true }, { name: "organization", label: "Organization" }, { name: "employmentType", label: "Employment type" },
      { name: "location", label: "Location" }, { name: "startDate", label: "Start date", type: "date" }, { name: "endDate", label: "End date", type: "date" },
      { name: "current", label: "Current role", type: "checkbox" }, { name: "summary", label: "Summary", type: "textarea" },
      { name: "responsibilities", label: "Responsibilities", type: "list" }, { name: "researchContribution", label: "Research contribution", type: "textarea" },
      { name: "technicalContribution", label: "Technical contribution", type: "textarea" }, { name: "tools", label: "Tools", type: "list" },
      { name: "organizationUrl", label: "Organization URL", type: "url" },
    ],
  },
  education: {
    key: "education", singular: "education record", title: "Education",
    description: "Degrees, CGPA, thesis, coursework, and academic highlights.", primaryField: "degree",
    fields: [
      { name: "degree", label: "Degree", required: true }, { name: "institution", label: "Institution" }, { name: "department", label: "Department" },
      { name: "affiliatedUniversity", label: "Affiliated university" }, { name: "startDate", label: "Start date", type: "date" },
      { name: "expectedCompletionDate", label: "Completion date", type: "date" }, { name: "current", label: "Currently enrolled", type: "checkbox" },
      { name: "cgpa", label: "CGPA" }, { name: "cgpaScale", label: "CGPA scale" }, { name: "thesisTitle", label: "Thesis title" },
      { name: "relevantCoursework", label: "Relevant coursework", type: "list" }, { name: "academicHighlights", label: "Academic highlights", type: "list" },
    ],
  },
  achievements: {
    key: "achievements", singular: "achievement", title: "Achievements",
    description: "Awards, recognition, certificates, and verification.", primaryField: "title",
    fields: [
      { name: "title", label: "Title", required: true }, { name: "organization", label: "Organization" }, { name: "category", label: "Category" },
      { name: "date", label: "Date", type: "date" }, { name: "description", label: "Description", type: "textarea" },
      { name: "verificationUrl", label: "Verification URL", type: "url" },
    ],
  },
  activities: {
    key: "activities", singular: "activity", title: "Co-curricular activities",
    description: "Leadership, service, communities, and supporting evidence.", primaryField: "activity",
    fields: [
      { name: "activity", label: "Activity", required: true }, { name: "organization", label: "Organization" }, { name: "position", label: "Position" },
      { name: "category", label: "Category" }, { name: "date", label: "Date", type: "date" }, { name: "description", label: "Description", type: "textarea" },
    ],
  },
  skills: {
    key: "skills", singular: "skill", title: "Research capabilities",
    description: "Concise capabilities assigned to the sections configured under Skill categories.", primaryField: "name",
    fields: [
      { name: "name", label: "Skill", required: true },
      { name: "category", label: "Category", type: "select", required: true, help: "Options are managed in the Skill categories module.", options: [
        { label: "Computer Vision", value: "computer-vision" },
        { label: "Data Analysis", value: "data-analysis" },
        { label: "Machine Learning", value: "machine-learning" },
        { label: "Problem Solving", value: "problem-solving" },
      ] },
      { name: "level", label: "Meaningful level", type: "select", options: ["Research Experience", "Production Experience", "Advanced", "Working Knowledge", "Familiar"] },
      { name: "evidence", label: "Evidence or context", type: "textarea" },
    ],
  },
  sections: {
    key: "sections", singular: "section", title: "Homepage sections",
    description: "Rename, describe, publish, hide, and reorder homepage sections.", primaryField: "heading",
    fields: [
      { name: "key", label: "Section key", required: true, help: "A stable unique identifier, such as featured-publications." },
      { name: "heading", label: "Heading", required: true }, { name: "description", label: "Description", type: "textarea" }, { name: "page", label: "Page" },
    ],
  },
  media: {
    key: "media", singular: "asset", title: "Media & CV", duplicable: false,
    description: "Reusable Cloudinary images, papers, certificates, documents, and CV versions.", primaryField: "alt",
    fields: [
      { name: "alt", label: "Accessible title / alt text" }, { name: "url", label: "Cloudinary URL", type: "url", required: true },
      { name: "publicId", label: "Cloudinary public ID", required: true }, { name: "assetType", label: "Asset type" },
      { name: "resourceType", label: "Resource type", type: "select", options: ["image", "raw", "video"] },
    ],
  },
};
