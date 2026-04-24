import Brand from "./Brand";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/30 bg-white/30 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/20">
      <div className="section-shell flex flex-col gap-8 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Brand compact />
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
            MedHelp brings prescription safety, guided care, and calm communication into one modern health workspace.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-300">
          <a className="transition hover:text-slate-950 dark:hover:text-white" href="/">
            Home
          </a>
          <a className="transition hover:text-slate-950 dark:hover:text-white" href="/#features">
            Features
          </a>
          <a className="transition hover:text-slate-950 dark:hover:text-white" href="mailto:contact@medhelp.app">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
