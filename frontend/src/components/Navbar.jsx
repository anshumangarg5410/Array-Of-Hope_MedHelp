import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { useAppContext } from "../utils/AppContext";
import Brand from "./Brand";

export default function Navbar() {
  const { session, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/30 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/30">
      <div className="section-shell flex items-center justify-between py-4">
        <Brand compact />

        <nav className="hidden items-center gap-6 lg:flex">
          <a
            className="text-sm text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            href="/"
          >
            Home
          </a>
          <a
            className="text-sm text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            href="/#features"
          >
            Features
          </a>
          <NavLink className="text-sm text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" to="/patient/dashboard">
            Dashboard
          </NavLink>
          <NavLink className="text-sm text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" to="/doctor/dashboard">
            Doctor
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session.isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to={session.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"}>
                <Button size="sm">Open app</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/auth/login?role=patient" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/auth/role">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
