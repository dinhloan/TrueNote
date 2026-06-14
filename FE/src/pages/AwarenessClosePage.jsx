import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { Rating } from "../components/Rating.jsx";
import { TextAreaField } from "../components/TextAreaField.jsx";
import { useJournalStore } from "../store/useJournalStore.js";
import { linesToItems } from "../utils/text.js";

export function AwarenessClosePage() {
  const navigate = useNavigate();
  const { loadToday, loadVerification, verification, saveTrace } = useJournalStore();
  const [form, setForm] = useState({
    awarenessStatement: "",
    reminderStatement: "",
    certaintyLevel: 4,
    themes: ""
  });

  useEffect(() => {
    loadToday().then(() => loadVerification());
  }, [loadToday, loadVerification]);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSave() {
    await saveTrace({
      verificationId: verification.id,
      awarenessStatement: form.awarenessStatement,
      reminderStatement: form.reminderStatement,
      certaintyLevel: form.certaintyLevel,
      themes: linesToItems(form.themes)
    });
    navigate("/traces");
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-5">
        <p className="text-sm font-semibold text-leaf">Bước 4</p>
        <h2 className="text-3xl font-bold text-ink">Chốt nhận thức</h2>
      </div>

      <div className="grid gap-5 rounded-md border border-line bg-white p-5 shadow-soft sm:p-7">
        {verification?.reasoningConclusion && (
          <div className="rounded-md bg-mist p-4 leading-7 text-slate-700">{verification.reasoningConclusion}</div>
        )}
        <TextAreaField
          label="Khi điều mình tin không còn chắc như trước, mình nhận ra gì?"
          rows={5}
          value={form.awarenessStatement}
          onChange={(value) => update("awarenessStatement", value)}
        />
        <TextAreaField
          label="Điều mình muốn ghi nhớ"
          rows={3}
          value={form.reminderStatement}
          onChange={(value) => update("reminderStatement", value)}
        />
        <TextAreaField
          label="Chủ đề liên kết"
          rows={3}
          value={form.themes}
          onChange={(value) => update("themes", value)}
          placeholder="- sợ bị bỏ rơi"
        />
        <Rating
          label="Mức độ mình tin chắc nhận thức này"
          value={form.certaintyLevel}
          onChange={(value) => update("certaintyLevel", value)}
        />
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!verification || !form.awarenessStatement.trim() || !form.reminderStatement.trim()}>
            <Save size={18} />
            Lưu dấu vết nhận thức
          </Button>
        </div>
      </div>
    </section>
  );
}
