import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DailyWritingPage } from "./DailyWritingPage.jsx";
import { useJournalStore } from "../store/useJournalStore.js";

describe("DailyWritingPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useJournalStore.setState({
      token: "token",
      user: { id: "u1", name: "Tester", email: "test@example.com" },
      dailyEntry: { id: "d1", date: "2026-05-14", rawContent: "", status: "writing" },
      loadToday: vi.fn().mockResolvedValue({ id: "d1", date: "2026-05-14", rawContent: "", status: "writing" }),
      saveDailyDraft: vi.fn().mockResolvedValue({ id: "d1", date: "2026-05-14", rawContent: "Một dòng rõ hơn", status: "raw" })
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("autosaves the draft and allows moving to reality check", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DailyWritingPage />} />
          <Route path="/reality" element={<p>Reality page</p>} />
        </Routes>
      </MemoryRouter>
    );

    await act(async () => {});

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Hôm nay trong bạn đang có gì?"), {
        target: { value: "Một dòng rõ hơn" }
      });
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700);
    });

    expect(useJournalStore.getState().saveDailyDraft).toHaveBeenCalledWith("Một dòng rõ hơn", "raw");

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Dừng lại và nhìn rõ hơn/i }));
    });

    expect(screen.getByText("Reality page")).toBeInTheDocument();
  });
});
