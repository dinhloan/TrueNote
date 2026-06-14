import { Navigate, Outlet } from "react-router-dom";
import { useJournalStore } from "../store/useJournalStore.js";

export function ProtectedRoute() {
  const token = useJournalStore((state) => state.token);
  return token ? <Outlet /> : <Navigate to="/auth" replace />;
}
