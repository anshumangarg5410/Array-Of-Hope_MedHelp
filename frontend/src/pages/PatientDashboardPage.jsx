import { useMemo, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import SectionHeading from "../components/SectionHeading";
import Modal from "../components/Modal";
import { useAppContext } from "../utils/AppContext";
import { patientStats, personalizationSuggestions } from "../utils/mockData";

export default function PatientDashboardPage() {
  const { session, uploadState } = useAppContext();
  const [doseTab, setDoseTab] = useState("adults");
  const [gender, setGender] = useState("women");
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(
    () => personalizationSuggestions[doseTab][gender],
    [doseTab, gender],
  );

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <SectionHeading
              eyebrow="Patient dashboard"
              title={`Welcome back, ${session.name || "Patient"}`}
              body="Stay on top of medication safety with OCR uploads, interaction alerts, timeline tracking, and personalized health support."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {patientStats.map((stat) => (
                <Card key={stat.label} className="rounded-[1.75rem] p-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{stat.value}</p>
                </Card>
              ))}
            </div>
          </div>
          <Card className="rounded-[2rem] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Latest summary</p>
            <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950 dark:text-white">
              Last checked {uploadState.lastCheckedAt}
            </h3>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-rose-50/80 p-4 text-sm text-rose-900 dark:bg-rose-400/10 dark:text-rose-100">
                Severe interaction present. Review with your doctor before taking both medicines.
              </div>
              <div className="rounded-2xl bg-white/70 p-4 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
                Suggested next step: switch to your upload flow to re-check a new prescription or continue the doctor chat.
              </div>
            </div>
            <Button className="mt-6 w-full" onClick={() => setOpen(true)}>
              View care summary
            </Button>
          </Card>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Personalization</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                Dose category and gender-based insights
              </h3>
            </div>
            <div className="flex gap-2">
              {["women", "men"].map((item) => (
                <Button
                  key={item}
                  variant={gender === item ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setGender(item)}
                >
                  {item === "women" ? "Women" : "Men"}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {["kids", "adults", "geriatric"].map((tab) => (
              <button
                key={tab}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  doseTab === tab
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "glass-panel text-slate-600 dark:text-slate-300"
                }`}
                onClick={() => setDoseTab(tab)}
              >
                {tab === "kids" ? "Kids" : tab === "adults" ? "Adults" : "Geriatric"}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {suggestions.map((item) => (
              <Card key={item} className="rounded-[1.75rem] p-5">
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{item}</p>
              </Card>
            ))}
            <Card className="rounded-[1.75rem] p-5">
              <h4 className="text-lg font-semibold text-slate-950 dark:text-white">Extra modules</h4>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Period Tracker and Sex Awareness panels can be expanded later with secure, consent-based workflows.
              </p>
            </Card>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Extracted medicines</p>
          <div className="mt-5 space-y-3">
            {uploadState.extracted.map((medicine) => (
              <div
                key={`${medicine.name}-${medicine.dose}`}
                className="flex flex-col justify-between gap-3 rounded-[1.5rem] bg-white/70 p-4 dark:bg-white/5 sm:flex-row sm:items-center"
              >
                <div>
                  <h4 className="font-semibold text-slate-950 dark:text-white">{medicine.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{medicine.schedule}</p>
                </div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-400/10 dark:text-sky-200">
                  {medicine.dose}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Care summary">
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
          You currently have one severe interaction, one moderate interaction, and one safe pairing in your recent report. The recommended flow is to review the upload, avoid the severe combination, and continue the doctor conversation for a medication alternative.
        </p>
      </Modal>
    </div>
  );
}
