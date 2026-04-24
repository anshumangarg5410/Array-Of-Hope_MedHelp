export default function Modal({ open, title, children, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-[2rem] p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">{title}</h3>
          <button
            className="rounded-full p-2 text-slate-500 transition hover:bg-white/60 dark:hover:bg-white/10"
            onClick={onClose}
            aria-label="Close modal"
          >
            x
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
