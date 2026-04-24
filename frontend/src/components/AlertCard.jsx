import Card from "./Card";

const severityStyles = {
  Severe:
    "border-rose-300/70 bg-rose-50/70 text-rose-950 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100",
  Moderate:
    "border-amber-300/70 bg-amber-50/80 text-amber-950 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100",
  Safe:
    "border-emerald-300/70 bg-emerald-50/80 text-emerald-950 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100",
};

export default function AlertCard({ alert }) {
  return (
    <Card className={`border p-5 ${severityStyles[alert.severity]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] dark:bg-white/10">
            {alert.severity}
          </span>
          <h3 className="mt-4 text-xl font-semibold">{alert.drugs.join(" + ")}</h3>
          <p className="mt-3 text-sm leading-6 opacity-90">{alert.message}</p>
        </div>
      </div>
      <p className="mt-4 rounded-2xl bg-white/60 px-4 py-3 text-sm dark:bg-white/10">{alert.action}</p>
    </Card>
  );
}
