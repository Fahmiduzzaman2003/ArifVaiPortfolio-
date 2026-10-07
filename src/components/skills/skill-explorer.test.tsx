import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SkillExplorer } from "@/components/skills/skill-explorer";

const categories = [
  { key: "computer-vision", title: "Computer Vision", description: "Visual systems.", visualStyle: "vision-grid" },
  { key: "data-analysis", title: "Data Analysis", description: "Evidence from data.", visualStyle: "data-plot" },
];

const skills = [
  { id: "1", name: "Object detection", category: "computer-vision", level: "Advanced", evidence: "Built evaluated detection pipelines." },
  { id: "2", name: "Segmentation", category: "computer-vision", level: "Research Experience", evidence: "Studied pixel-level prediction." },
  { id: "3", name: "Exploratory analysis", category: "data-analysis", level: "Advanced", evidence: "Used statistical summaries and visual checks." },
];

describe("SkillExplorer", () => {
  afterEach(cleanup);

  it("shows one category and one skill detail at a time", () => {
    render(<SkillExplorer categories={categories} skills={skills} />);
    expect(screen.getByText("Built evaluated detection pipelines.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Segmentation" }));
    expect(screen.getByText("Studied pixel-level prediction.")).toBeInTheDocument();
    expect(screen.queryByText("Built evaluated detection pipelines.")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Data Analysis/i }));
    expect(screen.getByText("Evidence from data.")).toBeInTheDocument();
    expect(screen.getByText("Used statistical summaries and visual checks.")).toBeInTheDocument();
  });
});
