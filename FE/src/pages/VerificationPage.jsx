import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { Rating } from "../components/Rating.jsx";
import { TextAreaField } from "../components/TextAreaField.jsx";
import { useJournalStore } from "../store/useJournalStore.js";
import { itemsToLines, linesToItems } from "../utils/text.js";

export function VerificationPage() {
  const navigate = useNavigate();
  const { loadToday, loadReality, loadVerification, realityCheck, verification, saveVerification } = useJournalStore();
  const [form, setForm] = useState({
    beliefBeingChecked: "",
    beliefLevelBefore: 4,
    supportingBasis: "",
    isBasisEnough: "not_enough",
    alternativePossibilities: "",
    reasoningConclusion: "",
    beliefLevelAfter: 2
  });

  useEffect(() => {
    loadToday().then(async () => {
      await loadReality();
      await loadVerification();
    });
  }, [loadReality, loadToday, loadVerification]);

  useEffect(() => {
    if (!verification) return;
    setForm({
      beliefBeingChecked: verification.beliefBeingChecked || "",
      beliefLevelBefore: verification.beliefLevelBefore || 4,
      supportingBasis: itemsToLines(verification.supportingBasis),
      isBasisEnough: verification.isBasisEnough || "not_enough",
      alternativePossibilities: itemsToLines(verification.alternativePossibilities),
      reasoningConclusion: verification.reasoningConclusion || "",
      beliefLevelAfter: verification.beliefLevelAfter || 2
    });
  }, [verification]);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleContinue() {
    await saveVerification({
      ...form,
      supportingBasis: linesToItems(form.supportingBasis),
      alternativePossibilities: linesToItems(form.alternativePossibilities)
    });
    navigate("/close");
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-5 xl:grid-cols-[340px_1fr]">
      <aside className="rounded-md border border-line bg-white p-5 shadow-soft">
        <p className="mb-4 text-sm font-semibold uppercase text-leaf">Thực tế đã ghi</p>
        <ul className="grid gap-3">
          {(realityCheck?.facts || []).map((fact) => (
            <li key={fact} className="rounded-md bg-mist px-3 py-2 text-sm leading-6 text-slate-700">
              {fact}
            </li>
          ))}
        </ul>
      </aside>

      <div className="rounded-md border border-line bg-white p-5 shadow-soft sm:p-7">
        <p className="text-sm font-semibold text-leaf">Bước 3</p>
        <h2 className="mb-5 text-3xl font-bold text-ink">Kiểm chứng</h2>

        <div className="grid gap-5">
          <TextAreaField
            label="Điều mình đang tin"
            rows={3}
            value={form.beliefBeingChecked}
            onChange={(value) => update("beliefBeingChecked", value)}
          />
          <Rating
            label="Mức độ mình đang tin trước khi kiểm chứng"
            value={form.beliefLevelBefore}
            onChange={(value) => update("beliefLevelBefore", value)}
          />
          <TextAreaField
            label="Cơ sở nào khiến mình tin vậy?"
            rows={4}
            value={form.supportingBasis}
            onChange={(value) => update("supportingBasis", value)}
          />

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-ink">Cơ sở này đã đủ để kết luận chưa?</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                ["enough", "Đủ"],
                ["not_enough", "Chưa đủ"],
                ["unsure", "Chưa chắc"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`focus-ring h-10 rounded-md border text-sm font-semibold ${
                    form.isBasisEnough === value ? "border-leaf bg-leaf text-white" : "border-line bg-white"
                  }`}
                  onClick={() => update("isBasisEnough", value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <TextAreaField
            label="Có khả năng nào khác cũng hợp lý không?"
            rows={5}
            value={form.alternativePossibilities}
            onChange={(value) => update("alternativePossibilities", value)}
          />
          <TextAreaField
            label="Sau khi kiểm chứng, mình thấy gì?"
            rows={4}
            value={form.reasoningConclusion}
            onChange={(value) => update("reasoningConclusion", value)}
          />
          <Rating
            label="Mức độ mình còn tin sau khi kiểm chứng"
            value={form.beliefLevelAfter}
            onChange={(value) => update("beliefLevelAfter", value)}
          />
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => navigate("/reality")}>
            <ArrowLeft size={18} />
            Quay lại
          </Button>
          <Button onClick={handleContinue} disabled={!form.beliefBeingChecked.trim()}>
            Tiếp tục
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
