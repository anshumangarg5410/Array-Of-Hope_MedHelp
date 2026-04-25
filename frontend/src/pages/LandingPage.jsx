import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import Button from "../components/Button";
import Card from "../components/Card";
import SectionHeading from "../components/SectionHeading";
import { featureCards } from "../utils/mockData";
import { useAppContext } from "../utils/AppContext";

const storySteps = [
  "Upload prescription",
  "Extract medicines",
  "Validate dosage logic",
  "Check interactions",
  "Alert patient and doctor",
];

export default function LandingPage() {
  const { session } = useAppContext();
  
  return (
    <div>
      <section className="section-shell grid min-h-[88vh] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="animate-slideUp">
          <div className="mb-5">
            <Brand showTagline={false} />
          </div>
          <span className="inline-flex rounded-full border border-white/50 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            Smart Prescription Safety
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-6xl">
            Smart Prescription Safety <span className="text-gradient">& Health Insights</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            MedHelp gives patients and doctors a modern care layer to scan prescriptions, understand medication risks, and stay aligned through guided health conversations.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {session.isAuthenticated ? (
              <Link to={session.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"}>
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/login?role=patient">
                  <Button size="lg">Login</Button>
                </Link>
                <Link to="/auth/role">
                  <Button variant="secondary" size="lg">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {storySteps.map((step, index) => (
              <span
                key={step}
                className="rounded-full border border-white/40 bg-white/60 px-4 py-2 text-sm text-slate-600 shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                {index + 1}. {step}
              </span>
            ))}
          </div>
        </div>

        <div className="relative animate-float">
          <Card className="relative overflow-hidden rounded-[2rem] p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100/80 via-white/50 to-emerald-100/70 dark:from-sky-500/10 dark:via-white/5 dark:to-emerald-400/10" />
            <div className="relative grid gap-4">
              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Today's upload</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Cardiology prescription</h3>
                  </div>
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-400/10 dark:text-rose-200">
                    Severe alert
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">OCR</p>
                    <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">3 medicines found</p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">AI</p>
                    <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">Next-step guidance</p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Doctor</p>
                    <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">Message ready</p>
                  </div>
                </div>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-5">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Safety graph</p>
                  <div className="mt-5 space-y-3">
                    {[78, 42, 92].map((value, index) => (
                      <div key={value}>
                        <div className="mb-2 flex justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                          <span>{["Interactions", "Adherence", "Follow-up"][index]}</span>
                          <span>{value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-5">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Dose intelligence</p>
                  <div className="mt-4 space-y-3">
                    {["Pediatric", "Adult", "Geriatric"].map((label) => (
                      <div key={label} className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 dark:bg-white/5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
                        <span className="text-xs text-slate-400">Adaptive suggestions</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="features" className="section-shell py-20">
        <SectionHeading
          eyebrow="Capabilities"
          title="Built like a premium health SaaS, focused on confidence at every step"
          body="From OCR prescription intake to care-team coordination, every surface is designed to feel calm, actionable, and safety-first."
          align="center"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature, index) => (
            <Card
              key={feature.title}
              className="group rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-glow"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:bg-white/10 dark:text-sky-200">
                {feature.badge}
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-slate-950 dark:text-white">{feature.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
