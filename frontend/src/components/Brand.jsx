import { Link } from "react-router-dom";
import logo from "../assets/medhelp-logo.svg";

export default function Brand({ to = "/", showTagline = true, compact = false }) {
  return (
    <Link to={to} className="flex items-center gap-3">
      <img
        src={logo}
        alt="MedHelp logo"
        className={compact ? "h-11 w-11 rounded-2xl shadow-glow" : "h-12 w-12 rounded-2xl shadow-glow sm:h-14 sm:w-14"}
      />
      <div>
        <p className={`${compact ? "text-lg" : "text-xl"} font-display font-semibold text-slate-900 dark:text-white`}>
          MedHelp
        </p>
        {showTagline ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Your Partner in Health & Care</p>
        ) : null}
      </div>
    </Link>
  );
}
