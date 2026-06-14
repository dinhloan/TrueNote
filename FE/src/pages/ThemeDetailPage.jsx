import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client.js";
import { Button } from "../components/Button.jsx";
import { useJournalStore } from "../store/useJournalStore.js";

export function ThemeDetailPage() {
  const { themeId } = useParams();
  const token = useJournalStore((state) => state.token);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    api.getTheme(token, themeId).then(setDetail);
  }, [themeId, token]);

  if (!detail) return <p>Đang mở chủ đề...</p>;

  return (
    <section className="mx-auto max-w-5xl">
      <Link to="/map" className="mb-5 inline-flex">
        <Button variant="secondary">
          <ArrowLeft size={18} />
          Quay lại
        </Button>
      </Link>

      <div className="rounded-md border border-line bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold text-leaf">Chủ đề</p>
        <h2 className="text-3xl font-bold text-ink">#{detail.theme.name}</h2>
        <p className="mt-2 text-slate-600">Xuất hiện: {detail.theme.traceCount} lần</p>

        <div className="mt-7 grid gap-5">
          {detail.traces.map((trace) => (
            <article key={trace.id} className="rounded-md border border-line p-4">
              <p className="mb-2 text-sm font-semibold text-slate-500">{new Date(trace.createdAt).toLocaleDateString("vi-VN")}</p>
              <p className="leading-7 text-slate-700">{trace.awarenessStatement}</p>
              <p className="mt-3 font-semibold text-ink">{trace.reminderStatement}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
