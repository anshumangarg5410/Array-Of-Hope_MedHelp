import Card from "../components/Card";
import Timeline from "../components/Timeline";
import { useAppContext } from "../utils/AppContext";

export default function MedicalHistoryPage() {
  const { historyTimeline } = useAppContext();

  return (
    <div className="space-y-6">
      <Card className="p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Medical history</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-slate-950 dark:text-white">
          A timeline of uploads, safety checks, and clinician follow-up
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          This page keeps the patient story easy to read over time, which makes medication changes less error-prone and future consultations faster.
        </p>
      </Card>

      <Timeline items={historyTimeline} />
    </div>
  );
}
