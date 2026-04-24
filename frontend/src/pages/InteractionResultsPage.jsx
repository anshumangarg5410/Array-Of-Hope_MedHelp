import Card from "../components/Card";
import AlertCard from "../components/AlertCard";
import { useAppContext } from "../utils/AppContext";

export default function InteractionResultsPage() {
  const { uploadState } = useAppContext();

  const counts = uploadState.interactions.reduce(
    (accumulator, item) => ({
      ...accumulator,
      [item.severity]: accumulator[item.severity] + 1,
    }),
    { Severe: 0, Moderate: 0, Safe: 0 },
  );

  return (
    <div className="space-y-6">
      <Card className="p-7">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Interaction report</p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-slate-950 dark:text-white">
              Safety alerts generated from the latest prescription
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Simple microcopy helps patients understand risk while still giving clinicians enough context to act.
            </p>
          </div>
          {[
            ["Severe", counts.Severe, "rose"],
            ["Moderate", counts.Moderate, "amber"],
            ["Safe", counts.Safe, "emerald"],
          ].map(([label, value, tone]) => (
            <div
              key={label}
              className={`rounded-[2rem] p-5 ${
                tone === "rose"
                  ? "bg-rose-50/80 text-rose-900 dark:bg-rose-400/10 dark:text-rose-100"
                  : tone === "amber"
                    ? "bg-amber-50/80 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100"
                    : "bg-emerald-50/80 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-100"
              }`}
            >
              <p className="text-sm uppercase tracking-[0.2em] opacity-75">{label}</p>
              <p className="mt-3 text-4xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-3">
        {uploadState.interactions.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}
