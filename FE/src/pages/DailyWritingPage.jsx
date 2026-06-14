import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { TextAreaField } from "../components/TextAreaField.jsx";
import { useJournalStore } from "../store/useJournalStore.js";
import { formatDate, todayIsoDate } from "../utils/text.js";

export function DailyWritingPage() {
  const navigate = useNavigate();
  const { dailyEntry, loadToday, saveDailyDraft } = useJournalStore();
  const [content, setContent] = useState("");
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    loadToday().then((entry) => {
      if (entry) setContent(entry.rawContent || "");
    });
  }, [loadToday]);

  useEffect(() => {
    if (!dailyEntry) return;
    const timer = window.setTimeout(async () => {
      await saveDailyDraft(content, content.trim() ? "raw" : "writing");
      setSavedAt(new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
    }, 650);

    return () => window.clearTimeout(timer);
  }, [content, dailyEntry, saveDailyDraft]);

  const displayDate = useMemo(() => formatDate(dailyEntry?.date || todayIsoDate()), [dailyEntry?.date]);

  async function handleContinue() {
    await saveDailyDraft(content, "raw");
    navigate("/reality");
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-leaf">{displayDate}</p>
          <h2 className="text-3xl font-bold text-ink">Nhật ký hôm nay</h2>
        </div>
        {savedAt && (
          <div className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm text-slate-600">
            <CheckCircle2 size={16} className="text-leaf" />
            Đã tự lưu lúc {savedAt}
          </div>
        )}
      </div>

      <div className="rounded-md border border-line bg-white p-5 shadow-soft sm:p-7">
        <TextAreaField
          label="Hôm nay trong bạn đang có gì?"
          rows={14}
          value={content}
          onChange={setContent}
          placeholder="Mình đang nghĩ..."
        />
        <div className="mt-5 flex justify-end">
          <Button onClick={handleContinue} disabled={!content.trim()}>
            Dừng lại và nhìn rõ hơn
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
