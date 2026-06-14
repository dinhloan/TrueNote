import { BookOpen, ClipboardCheck, LogOut, Map, PenLine, Sparkles } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useJournalStore } from "../store/useJournalStore.js";
import { Button } from "./Button.jsx";

const navItems = [
  { to: "/", label: "Hôm nay", icon: PenLine },
  { to: "/reality", label: "Thực tế", icon: BookOpen },
  { to: "/verification", label: "Kiểm chứng", icon: ClipboardCheck },
  { to: "/close", label: "Chốt lại", icon: Sparkles },
  { to: "/map", label: "Bản đồ", icon: Map }
];

export function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useJournalStore();

  function handleLogout() {
    logout();
    navigate("/auth");
  }

  return (
    <div className="min-h-screen bg-mist">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-line bg-white px-4 py-4 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <div className="mb-6 flex items-center justify-between gap-4 lg:block">
            <div>
              <p className="text-xs font-semibold uppercase text-leaf">TrueNote</p>
              <h1 className="text-xl font-bold text-ink">Awareness Journal</h1>
            </div>
            <Button variant="ghost" className="lg:hidden" onClick={handleLogout} aria-label="Đăng xuất">
              <LogOut size={18} />
            </Button>
          </div>

          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `focus-ring flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold ${
                    isActive ? "bg-leaf text-white" : "text-ink hover:bg-mist"
                  }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 hidden border-t border-line pt-5 lg:block">
            <p className="text-sm font-semibold text-ink">{user?.name}</p>
            <p className="mb-4 break-all text-xs text-slate-500">{user?.email}</p>
            <Button variant="secondary" className="w-full" onClick={handleLogout}>
              <LogOut size={16} />
              Đăng xuất
            </Button>
          </div>
        </aside>

        <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
