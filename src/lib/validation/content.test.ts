import { describe, expect, it } from "vitest";
import { contentUpdate, normalizeContentInput } from "@/lib/validation/content";

describe("admin content normalization", () => {
  it("repairs a legacy publication URL stored in the slug field", () => {
    const value = normalizeContentInput("publications", {
      title: "DateFNet",
      slug: "https://arxiv.org/abs/1706.03762",
      links: { code: "https://github.com/example/datefnet" },
    });
    expect(value).toMatchObject({
      slug: "datefnet",
      links: {
        pdf: "https://arxiv.org/abs/1706.03762",
        code: "https://github.com/example/datefnet",
      },
    });
  });

  it("generates a slug and removes empty optional fields on creation", () => {
    const value = normalizeContentInput("projects", { title: "Vision & BioML", slug: "", status: "  " }, { creating: true });
    expect(value).toEqual({ title: "Vision & BioML", slug: "vision-bioml" });
  });

  it("normalizes DOI URLs", () => {
    const value = normalizeContentInput("publications", { doi: " https://doi.org/10.1000/example " });
    expect(value.doi).toBe("10.1000/example");
  });

  it("validates admin-managed profile and social URLs", () => {
    expect(normalizeContentInput("profile", { social: { linkedIn: "https://linkedin.com/in/researcher", whatsApp: "https://wa.me/8801000000000" } })).toMatchObject({ social: { linkedIn: "https://linkedin.com/in/researcher", whatsApp: "https://wa.me/8801000000000" } });
    expect(() => normalizeContentInput("profile", { social: { facebook: "javascript:alert(1)" } })).toThrow("Enter a complete http:// or https:// URL");
  });

  it("turns blank patch values into MongoDB unsets without replacing sibling links", () => {
    expect(contentUpdate({ summary: "", links: { pdf: "", code: "https://example.com/code" } })).toEqual({
      $set: { "links.code": "https://example.com/code" },
      $unset: { summary: 1, "links.pdf": 1 },
    });
  });

  it("rejects nested operator injection", () => {
    expect(() => normalizeContentInput("projects", { links: { $set: { title: "unsafe" } } })).toThrow("Invalid field name");
  });

  it("requires module identity fields when creating records", () => {
    expect(() => normalizeContentInput("achievements", { description: "Missing title" }, { creating: true })).toThrow("This field is required");
  });

  it("normalizes admin-managed skill category keys", () => {
    expect(normalizeContentInput("skill-categories", { title: "Computer Vision", key: "Computer Vision" }, { creating: true }))
      .toMatchObject({ title: "Computer Vision", key: "computer-vision" });
  });
});
