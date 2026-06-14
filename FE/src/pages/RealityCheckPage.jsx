import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { TextAreaField } from "../components/TextAreaField.jsx";
import { useJournalStore } from "../store/useJournalStore.js";
import { itemsToLines, linesToItems } from "../utils/text.js";

export function RealityCheckPage() {
  const navigate = useNavigate();
  const { dailyEntry, loadToday, loadReality, realityCheck, saveReality } = useJournalStore();
  const [factsText, setFactsText] = useState("");

  useEffect(() => {
    loadToday().then(() => loadReality());
  }, [loadReality, loadToday]);

  useEffect(() => {
    if (realityCheck?.facts) setFactsText(itemsToLines(realityCheck.facts));
  }, [realityCheck]);

  async function handleContinue() {
    await saveReality(linesToItems(factsText));
    navigate("/verification");
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="rounded-md border border-line bg-white p-5 shadow-soft">
        <p className="mb-3 text-sm font-semibold uppercase text-leaf">Nhật ký ban đầu</p>
        <div className="whitespace-pre-wrap rounded-md bg-mist p-4 leading-7 text-slate-700">
          {dailyEntry?.rawContent || "Chưa có nội dung hôm nay."}
        </div>
      </aside>

      <div className="rounded-md border border-line bg-white p-5 shadow-soft sm:p-7">
        <p className="text-sm font-semibold text-leaf">Bước 2</p>
        <h2 className="mb-5 text-3xl font-bold text-ink">Thực tế có gì?</h2>
        <TextAreaField
          label="Trong những điều vừa viết, điều gì thật sự đã xảy ra?"
          rows={12}
          value={factsText}
          onChange={setFactsText}
          placeholder="- Họ chưa trả lời tin nhắn trong 5 tiếng"
        />
        <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => navigate("/")}>
            <ArrowLeft size={18} />
            Quay lại
          </Button>
          <Button onClick={handleContinue} disabled={!linesToItems(factsText).length}>
            Tiếp tục
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
