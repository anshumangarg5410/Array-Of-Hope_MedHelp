export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) {
  const variants = {
    primary:
      "bg-slate-950 text-white shadow-glow hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100",
    secondary:
      "glass-panel text-slate-900 hover:bg-white/80 dark:text-slate-100 dark:hover:bg-white/10",
    ghost:
      "bg-transparent text-slate-700 hover:bg-white/40 dark:text-slate-200 dark:hover:bg-white/5",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-3 text-sm sm:text-base",
    lg: "px-6 py-3.5 text-base",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-sky-300/70 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
