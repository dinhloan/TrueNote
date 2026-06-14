import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { AwarenessClosePage } from "./pages/AwarenessClosePage.jsx";
import { AwarenessMapPage } from "./pages/AwarenessMapPage.jsx";
import { AwarenessTracePage } from "./pages/AwarenessTracePage.jsx";
import { DailyWritingPage } from "./pages/DailyWritingPage.jsx";
import { RealityCheckPage } from "./pages/RealityCheckPage.jsx";
import { ThemeDetailPage } from "./pages/ThemeDetailPage.jsx";
import { VerificationPage } from "./pages/VerificationPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DailyWritingPage />} />
          <Route path="/reality" element={<RealityCheckPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/close" element={<AwarenessClosePage />} />
          <Route path="/traces" element={<AwarenessTracePage />} />
          <Route path="/map" element={<AwarenessMapPage />} />
          <Route path="/themes/:themeId" element={<ThemeDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
