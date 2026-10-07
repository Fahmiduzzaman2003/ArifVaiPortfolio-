import { describe, expect, it } from "vitest";
import { safeExternalHref } from "@/lib/utils";
describe("safeExternalHref", () => { it("accepts secure web URLs", () => expect(safeExternalHref("https://doi.org/10.1/test")).toBe("https://doi.org/10.1/test")); it("rejects placeholders and executable protocols", () => { expect(safeExternalHref("YOUR_DOI")).toBeUndefined(); expect(safeExternalHref("javascript:alert(1)")).toBeUndefined(); }); });
