import { describe, expect, it } from "vitest";
import { buildChartScale, buildEducationStages, buildStairSegments } from "@/components/education/education-trajectory";

describe("education trajectory", () => {
  it("orders SSC, HSC, and BSc from left to right and normalizes unlike scales", () => {
    const stages = buildEducationStages([
      { degree: "BSc in CSE", cgpa: "3.90", cgpaScale: "4.00" },
      { degree: "Higher Secondary Certificate", cgpa: "4.75", cgpaScale: "5" },
      { degree: "SSC", cgpa: "5.00", cgpaScale: "5.00" },
    ]);

    expect(stages.map((stage) => stage.key)).toEqual(["ssc", "hsc", "bsc"]);
    expect(stages.map((stage) => stage.ratio)).toEqual([1, 0.95, 0.975]);
    expect(stages[0].x).toBeLessThan(stages[1].x);
    expect(stages[1].x).toBeLessThan(stages[2].x);
  });

  it("keeps missing or non-numeric results unplotted", () => {
    const stages = buildEducationStages([{ degree: "BSC", cgpa: "Result pending", cgpaScale: "4.00" }]);

    expect(stages[0].record).toBeNull();
    expect(stages[1].record).toBeNull();
    expect(stages[2].record).not.toBeNull();
    expect(stages[2].ratio).toBeNull();
  });

  it("builds one horizontal step per qualification with vertical transitions", () => {
    const stages = buildEducationStages([
      { degree: "SSC", cgpa: "5", cgpaScale: "5" },
      { degree: "HSC", cgpa: "4", cgpaScale: "5" },
      { degree: "BSc", cgpa: "3.6", cgpaScale: "4" },
    ]);
    const segments = buildStairSegments(stages);

    expect(segments.filter((segment) => segment.kind === "plateau")).toHaveLength(3);
    expect(segments.filter((segment) => segment.kind === "connector")).toHaveLength(2);
    expect(segments.every((segment) => segment.recorded)).toBe(true);
    expect(segments[0].path).toMatch(/^M .+ H .+$/);
    expect(segments[1].path).toMatch(/^M .+ V .+$/);
  });

  it("uses an explicit focused scale so close high scores form readable steps", () => {
    const stages = buildEducationStages([
      { degree: "SSC", cgpa: "4.5", cgpaScale: "5" },
      { degree: "HSC", cgpa: "4.75", cgpaScale: "5" },
      { degree: "BSc", cgpa: "3.89 With Distinction", cgpaScale: "4" },
    ]);

    expect(buildChartScale(stages)).toEqual({ min: 85, max: 100, ticks: [100, 95, 90, 85] });
    expect(stages[0].y).toBeGreaterThan(stages[1].y);
    expect(stages[1].y).toBeGreaterThan(stages[2].y);
  });
});
