export type SkillCategoryPreset = {
  key: string;
  title: string;
  description: string;
  visualStyle: "vision-grid" | "data-plot" | "neural-network" | "logic-path" | "tool-stack";
};

export const defaultSkillCategories: SkillCategoryPreset[] = [
  { key: "computer-vision", title: "Computer Vision", description: "Visual learning for detection, classification, segmentation, and applied imaging systems.", visualStyle: "vision-grid" },
  { key: "data-analysis", title: "Data Analysis", description: "Turning raw observations into reliable patterns, comparisons, and research evidence.", visualStyle: "data-plot" },
  { key: "machine-learning", title: "Machine Learning", description: "Model development, evaluation, and interpretation grounded in real research questions.", visualStyle: "neural-network" },
  { key: "problem-solving", title: "Problem Solving", description: "Structured reasoning, programming, and tool selection for ambiguous technical challenges.", visualStyle: "logic-path" },
];

export const skillVisualStyles = [
  { label: "Vision focus grid", value: "vision-grid" },
  { label: "Data plot", value: "data-plot" },
  { label: "Neural network", value: "neural-network" },
  { label: "Problem-solving path", value: "logic-path" },
  { label: "General tool stack", value: "tool-stack" },
] as const;
