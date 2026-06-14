import { BarChart3 } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useJournalStore } from "../store/useJournalStore.js";

export function AwarenessMapPage() {
  const { map, loadMap } = useJournalStore();

  useEffect(() => {
    loadMap();
  }, [loadMap]);

  const maxCount = Math.max(1, ...map.themes.map((theme) => theme.traceCount));

  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center gap-3">
        <BarChart3 className="text-leaf" />
        <h2 className="text-3xl font-bold text-ink">Bản đồ nhận thức</h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-md border border-line bg-white p-5 shadow-soft">
          <h3 className="mb-4 text-lg font-bold">Chủ đề lặp lại nhiều nhất</h3>
          <div className="grid gap-4">
            {map.themes.length === 0 && <p className="text-slate-600">Có vài điều cũ vẫn đang chờ được nhìn rõ.</p>}
            {map.themes.map((theme) => (
              <Link key={theme.id} to={`/themes/${theme.id}`} className="focus-ring block rounded-md border border-line p-3 hover:bg-mist">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-semibold">#{theme.name}</span>
                  <span className="text-sm text-slate-600">{theme.traceCount} dấu vết</span>
                </div>
                <div className="h-2 rounded bg-mist">
                  <div className="h-2 rounded bg-clay" style={{ width: `${(theme.traceCount / maxCount) * 100}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-line bg-white p-5 shadow-soft">
          <h3 className="mb-4 text-lg font-bold">Hành trình gần đây</h3>
          <div className="grid gap-4">
            {map.timeline.map((trace) => (
              <article key={trace.id} className="border-l-2 border-leaf pl-4">
                <p className="text-xs font-semibold text-slate-500">{new Date(trace.createdAt).toLocaleDateString("vi-VN")}</p>
                <p className="mt-1 leading-7 text-slate-700">{trace.awarenessStatement}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
