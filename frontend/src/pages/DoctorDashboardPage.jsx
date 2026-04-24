import { useState } from "react";
import Card from "../components/Card";
import ChatBox from "../components/ChatBox";
import { useAppContext } from "../utils/AppContext";
import { doctorPatientDetails, doctorStats } from "../utils/mockData";

export default function DoctorDashboardPage() {
  const { patientList, doctorMessages, sendDoctorMessage } = useAppContext();
  const [activePatientId, setActivePatientId] = useState(patientList[0]?.id);
  const activePatient = patientList.find((patient) => patient.id === activePatientId);
  const detail = doctorPatientDetails[activePatientId];

  return (
    <div className="space-y-6">
      <Card className="p-7">
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Doctor dashboard</p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-slate-950 dark:text-white">
              Review patients, inspect flagged interactions, and guide next steps
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              The doctor workspace prioritizes at-risk patients, keeps uploaded prescriptions accessible, and preserves clear communication trails.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {doctorStats.map((stat) => (
              <Card key={stat.label} className="rounded-[1.75rem] p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{stat.value}</p>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Patients</p>
          <div className="mt-5 space-y-3">
            {patientList.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setActivePatientId(patient.id)}
                className={`w-full rounded-[1.5rem] p-4 text-left transition ${
                  activePatientId === patient.id
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "bg-white/70 text-slate-700 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{patient.name}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      patient.risk === "High"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-200"
                        : patient.risk === "Moderate"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
                    }`}
                  >
                    {patient.risk}
                  </span>
                </div>
                <p className="mt-2 text-sm opacity-80">
                  {patient.condition} • Age {patient.age}
                </p>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Patient details</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                  {activePatient?.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{detail?.notes}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {detail?.vitals.map((vital) => (
                    <span
                      key={vital}
                      className="rounded-full bg-white/70 px-4 py-2 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300"
                    >
                      {vital}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] bg-gradient-to-br from-rose-50/90 via-white/70 to-amber-50/90 p-5 dark:from-rose-400/10 dark:via-white/5 dark:to-amber-400/10">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Flagged interactions</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-white/80 p-4 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-200">
                    Warfarin + Ibuprofen marked as severe due to increased bleeding risk.
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-200">
                    Suggested next step: confirm alternative pain management and update the prescription note.
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <ChatBox
            title="Patient communication"
            subtitle="Continue the discussion with quick async replies."
            messages={doctorMessages}
            onSend={(message) => sendDoctorMessage(message, "doctor")}
            placeholder="Reply to patient..."
          />
        </div>
      </div>
    </div>
  );
}
