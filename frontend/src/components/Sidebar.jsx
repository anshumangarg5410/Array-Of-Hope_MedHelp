import { NavLink } from "react-router-dom";

export default function Sidebar({ items, title, subtitle }) {
  return (
    <aside className="glass-panel rounded-[2rem] p-5 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "text-slate-600 hover:bg-white/50 dark:text-slate-300 dark:hover:bg-white/5"
              }`
            }
          >
            <span>{item.label}</span>
            <span className="text-xs opacity-70">{item.shortcut}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
