import { describe, expect, it } from "vitest";
import { motionDurations } from "@/lib/motion";

describe("motion language", () => {
  it("keeps interaction durations ordered and restrained", () => {
    expect(motionDurations.micro).toBeLessThan(motionDurations.component);
    expect(motionDurations.component).toBeLessThan(motionDurations.story);
    expect(motionDurations.ambient).toBeGreaterThan(8);
  });
});
