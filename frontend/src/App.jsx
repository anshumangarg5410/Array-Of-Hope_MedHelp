import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import FloatingChatbot from "./components/FloatingChatbot";
import { useAppContext } from "./utils/AppContext";
import LandingPage from "./pages/LandingPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import AuthPage from "./pages/AuthPage";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import PrescriptionUploadPage from "./pages/PrescriptionUploadPage";
import InteractionResultsPage from "./pages/InteractionResultsPage";
import ChatPage from "./pages/ChatPage";
import MedicalHistoryPage from "./pages/MedicalHistoryPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";

const patientNav = [
  { to: "/patient/dashboard", label: "Overview", shortcut: "01" },
  { to: "/patient/upload", label: "Upload & OCR", shortcut: "02" },
  { to: "/patient/results", label: "Interactions", shortcut: "03" },
  { to: "/patient/chat", label: "AI + Doctor Chat", shortcut: "04" },
  { to: "/patient/history", label: "Medical History", shortcut: "05" },
];

const doctorNav = [{ to: "/doctor/dashboard", label: "Doctor Workspace", shortcut: "01" }];

function ProtectedRoute({ role }) {
  const { session } = useAppContext();

  if (!session.isAuthenticated) {
    return <Navigate to={`/auth/login?role=${role}`} replace />;
  }

  if (session.role !== role) {
    return <Navigate to={session.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"} replace />;
  }

  return <Outlet />;
}

function DashboardLayout({ role, title, subtitle, items }) {
  return (
    <div className="section-shell py-8">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar items={items} title={title} subtitle={subtitle} />
        <main>
          <Outlet context={{ role }} />
        </main>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return null;
}

export default function App() {
  const location = useLocation();
  const hideGlobalChrome = location.pathname === "/auth/login" || location.pathname === "/auth/signup";

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-400/10" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <ScrollToTop />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/role" element={<RoleSelectionPage />} />
            <Route path="/auth/:mode" element={<AuthPage />} />

            <Route element={<ProtectedRoute role="patient" />}>
              <Route
                element={
                  <DashboardLayout
                    role="patient"
                    title="Patient hub"
                    subtitle="Manage prescriptions, interaction checks, and personalized care guidance."
                    items={patientNav}
                  />
                }
              >
                <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
                <Route path="/patient/upload" element={<PrescriptionUploadPage />} />
                <Route path="/patient/results" element={<InteractionResultsPage />} />
                <Route path="/patient/chat" element={<ChatPage />} />
                <Route path="/patient/history" element={<MedicalHistoryPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute role="doctor" />}>
              <Route
                element={
                  <DashboardLayout
                    role="doctor"
                    title="Doctor hub"
                    subtitle="Review patient uploads, track flagged interactions, and keep communication streamlined."
                    items={doctorNav}
                  />
                }
              >
                <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        {!hideGlobalChrome ? <Footer /> : null}
        {!hideGlobalChrome ? <FloatingChatbot /> : null}
      </div>
    </div>
  );
}
