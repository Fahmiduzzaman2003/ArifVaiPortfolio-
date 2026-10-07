import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProfileShowcase } from "@/components/home/profile-showcase";

vi.mock("framer-motion", () => ({ useReducedMotion: () => false }));

describe("ProfileShowcase", () => {
  afterEach(() => { cleanup(); vi.useRealTimers(); });

  it("starts with the portrait, flips to the author profile, and respects manual selection", () => {
    vi.useFakeTimers();
    render(<ProfileShowcase name="Arif Rahman" identityHighlights="Researcher | Explores reliable computer vision." />);

    const portrait = screen.getByRole("button", { name: "Portrait" });
    const author = screen.getByRole("button", { name: "self.py" });
    expect(portrait).toHaveAttribute("aria-pressed", "true");

    act(() => vi.advanceTimersByTime(4300));
    expect(author).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(portrait);
    expect(portrait).toHaveAttribute("aria-pressed", "true");
    act(() => vi.advanceTimersByTime(7000));
    expect(portrait).toHaveAttribute("aria-pressed", "true");
  });

  it("uses distinct personal defaults and leisure interests when no custom values are configured", () => {
    render(<ProfileShowcase name="Arif Rahman" />);
    expect(screen.getAllByText("Curious mind")).toHaveLength(2);
    expect(screen.getByText("Persistent builder")).toBeInTheDocument();
    expect(screen.getByText("Teacher at heart")).toBeInTheDocument();
    expect(screen.getByText("PhD-bound")).toBeInTheDocument();
    expect(screen.getByText("Photography")).toBeInTheDocument();
    expect(screen.getByText("~/identity/self.py")).toBeInTheDocument();
    expect(screen.getByText(/useful work, built with care/i)).toBeInTheDocument();
  });

  it("lets visitors explore one trait at a time", () => {
    render(<ProfileShowcase name="Arif Rahman" />);
    fireEvent.click(screen.getByRole("button", { name: "self.py" }));
    const persistentBuilder = screen.getByRole("button", { name: /persistent builder/i });

    fireEvent.click(persistentBuilder);

    expect(persistentBuilder).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Turns complexity into steady, thoughtful progress.")).toBeInTheDocument();
    expect(screen.queryByText("Finds energy in difficult questions and unfamiliar ideas.")).not.toBeInTheDocument();
  });
});
