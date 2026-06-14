import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { useJournalStore } from "../store/useJournalStore.js";

export function AuthPage() {
  const navigate = useNavigate();
  const { authenticate, token, loading, error } = useJournalStore();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  if (token) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = mode === "register" ? form : { email: form.email, password: form.password };
    await authenticate(mode, payload);
    navigate("/");
  }

  return (
    <main className="min-h-screen bg-mist px-4 py-10">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-md border border-line bg-white shadow-soft lg:grid-cols-[1fr_420px]">
        <div className="bg-ink px-8 py-10 text-white sm:px-12">
          <p className="text-sm font-semibold uppercase text-emerald-200">TrueNote</p>
          <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight">Viết để tự hiểu chính mình.</h1>
          <div className="mt-10 grid gap-4 text-sm leading-7 text-slate-100">
            <p>Viết ra để thấy rõ.</p>
            <p>Kiểm chứng để không còn tin mù mờ.</p>
            <p>Chốt lại để nhận thức được lưu vết.</p>
          </div>
        </div>

        <form className="px-6 py-8 sm:px-8" onSubmit={handleSubmit}>
          <div className="mb-6 grid grid-cols-2 rounded-md border border-line bg-mist p-1">
            <button
              type="button"
              className={`rounded px-3 py-2 text-sm font-semibold ${mode === "login" ? "bg-white shadow-sm" : ""}`}
              onClick={() => setMode("login")}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              className={`rounded px-3 py-2 text-sm font-semibold ${mode === "register" ? "bg-white shadow-sm" : ""}`}
              onClick={() => setMode("register")}
            >
              Đăng ký
            </button>
          </div>

          {mode === "register" && (
            <label className="mb-4 block">
              <span className="mb-2 block text-sm font-semibold">Tên</span>
              <input
                className="focus-ring h-11 w-full rounded-md border border-line px-3"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </label>
          )}

          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-semibold">Email</span>
            <input
              className="focus-ring h-11 w-full rounded-md border border-line px-3"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>

          <label className="mb-5 block">
            <span className="mb-2 block text-sm font-semibold">Mật khẩu</span>
            <input
              className="focus-ring h-11 w-full rounded-md border border-line px-3"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              minLength={8}
              required
            />
          </label>

          {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <Button className="w-full" disabled={loading}>
            {mode === "register" ? "Tạo tài khoản" : "Đi vào nhật ký"}
          </Button>
        </form>
      </section>
    </main>
  );
}
