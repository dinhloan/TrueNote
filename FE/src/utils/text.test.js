import { describe, expect, it } from "vitest";
import { linesToItems } from "./text.js";

describe("text utilities", () => {
  it("turns multiline notes into clean unique-ready items", () => {
    expect(linesToItems("- Họ chưa trả lời\n\n* Mình chưa hỏi lý do\n  Hôm nay mình ngủ ít ")).toEqual([
      "Họ chưa trả lời",
      "Mình chưa hỏi lý do",
      "Hôm nay mình ngủ ít"
    ]);
  });
});
