import { Link } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { useJournalStore } from "../store/useJournalStore.js";

export function AwarenessTracePage() {
  const trace = useJournalStore((state) => state.awarenessTrace);

  return (
    <section className="mx-auto max-w-4xl">
      <div className="rounded-md border border-line bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold text-leaf">Dấu vết nhận thức</p>
        <h2 className="mt-1 text-3xl font-bold text-ink">{trace ? "Đã lưu lại" : "Chưa có dấu vết mới"}</h2>

        {trace && (
          <div className="mt-6 grid gap-4">
            <div className="rounded-md bg-mist p-4 leading-7">{trace.awarenessStatement}</div>
            <div>
              <p className="text-sm font-semibold text-ink">Điều mình muốn ghi nhớ</p>
              <p className="mt-2 leading-7 text-slate-700">{trace.reminderStatement}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {trace.themes.map((theme) => (
                <span key={theme} className="rounded-md border border-line bg-white px-3 py-1 text-sm">
                  #{theme}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link to="/map">
            <Button>Nhìn lại bản đồ nhận thức</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
