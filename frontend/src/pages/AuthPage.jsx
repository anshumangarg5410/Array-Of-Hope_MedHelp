import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { useAppContext } from "../utils/AppContext";

export default function AuthPage() {
  const { mode } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "patient";
  const isSignup = mode === "signup";
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: role === "doctor" ? "Dr. Alex Morgan" : "Ria Patel",
    email: role === "doctor" ? "doctor@careflow.ai" : "patient@careflow.ai",
    password: "",
    age: "",
    pastDiseases: "",
    ongoingMedicines: "",
  });
  const [errors, setErrors] = useState({});

  const pageCopy = useMemo(
    () => ({
      title: isSignup ? "Create your secure workspace" : "Welcome back to medication safety",
      body: isSignup
        ? "Set up your MedHelp account and continue to the live product demo."
        : "Sign in to access your dashboard, prescription workflows, and messaging tools.",
    }),
    [isSignup],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    if (isSignup) {
      if (!form.name.trim()) {
        nextErrors.name = "Name is required.";
      }

      if (!form.age || Number(form.age) <= 0) {
        nextErrors.age = "Age must be a valid number.";
      }

      if (!form.pastDiseases.trim()) {
        nextErrors.pastDiseases = "Add past diseases or write None.";
      }

      if (!form.ongoingMedicines.trim()) {
        nextErrors.ongoingMedicines = "Add ongoing medicines or write None.";
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    login({
      role,
      name: form.name,
      email: form.email,
      age: Number(form.age) || undefined,
      pastDiseases: form.pastDiseases
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      ongoingMedicines: form.ongoingMedicines
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    });
    navigate(role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard");
  };

  return (
    <div className="section-shell grid min-h-[85vh] items-center gap-8 py-16 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="max-w-xl">
        <span className="inline-flex rounded-full border border-white/40 bg-white/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          {role === "doctor" ? "Doctor access" : "Patient access"}
        </span>
        <h1 className="mt-6 font-display text-5xl font-semibold leading-tight text-slate-950 dark:text-white">
          {pageCopy.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">{pageCopy.body}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {["Role aware flows", "Mock local persistence", "Responsive glassmorphism UI"].map((item) => (
            <Card key={item} className="rounded-[1.75rem] p-4 text-sm text-slate-600 dark:text-slate-300">
              {item}
            </Card>
          ))}
        </div>
      </div>

      <Card className="mx-auto w-full max-w-xl rounded-[2rem] p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Selected role</label>
            <div className="glass-panel rounded-2xl px-4 py-4 text-sm capitalize text-slate-700 dark:text-slate-200">
              {role}
            </div>
          </div>

          {isSignup ? (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Name</label>
                <input
                  className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Enter your full name"
                />
                {errors.name ? <p className="mt-2 text-sm text-rose-500">{errors.name}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Age</label>
                <input
                  type="number"
                  min="1"
                  className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
                  value={form.age}
                  onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
                  placeholder="Enter age"
                />
                {errors.age ? <p className="mt-2 text-sm text-rose-500">{errors.age}</p> : null}
              </div>
            </>
          ) : null}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email address</label>
            <input
              className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="name@example.com"
            />
            {errors.email ? <p className="mt-2 text-sm text-rose-500">{errors.email}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
            <input
              type="password"
              className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Enter a secure password"
            />
            {errors.password ? <p className="mt-2 text-sm text-rose-500">{errors.password}</p> : null}
          </div>

          {isSignup ? (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Past Diseases</label>
                <textarea
                  rows="4"
                  className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
                  value={form.pastDiseases}
                  onChange={(event) => setForm((current) => ({ ...current, pastDiseases: event.target.value }))}
                  placeholder={"One per line\nHypertension\nAsthma"}
                />
                {errors.pastDiseases ? <p className="mt-2 text-sm text-rose-500">{errors.pastDiseases}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Ongoing Medicines</label>
                <textarea
                  rows="4"
                  className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
                  value={form.ongoingMedicines}
                  onChange={(event) => setForm((current) => ({ ...current, ongoingMedicines: event.target.value }))}
                  placeholder={"One per line\nWarfarin 5mg\nMetoprolol 25mg"}
                />
                {errors.ongoingMedicines ? <p className="mt-2 text-sm text-rose-500">{errors.ongoingMedicines}</p> : null}
              </div>
            </>
          ) : null}

          <Button className="w-full">{isSignup ? "Create account" : "Login"}</Button>
        </form>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          {isSignup ? "Already have an account?" : "Need a new account?"}{" "}
          <Link
            to={`/auth/${isSignup ? "login" : "signup"}?role=${role}`}
            className="font-medium text-sky-700 dark:text-sky-300"
          >
            {isSignup ? "Login" : "Signup"}
          </Link>
        </p>
      </Card>
    </div>
  );
}
