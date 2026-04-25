import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { useAppContext } from "../utils/AppContext";
import { api } from "../services/api";
import { writeStorage, storageKeys } from "../utils/storage";

export default function AuthPage() {
  const { mode } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "patient";
  const isSignup = mode === "signup";
  const { login } = useAppContext();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    sex: "Male",
    phone: "",
    bloodGroup: "A+",
    allergies: "",
    currentDiseases: "",
    currentMedications: "",
  });
  const [errors, setErrors] = useState({});

  const pageCopy = useMemo(
    () => ({
      title: isSignup ? (step === 1 ? "Create your secure workspace" : "Medical Profile") : "Welcome back to medication safety",
      body: isSignup
        ? (step === 1 ? "Set up your MedHelp account." : "Add your medical history to enable AI safety checks.")
        : "Sign in to access your dashboard, prescription workflows, and messaging tools.",
    }),
    [isSignup, step],
  );

  const handleNextStep = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.password.trim()) nextErrors.password = "Password is required.";
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.age || Number(form.age) <= 0) nextErrors.age = "Valid age is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStep(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    setAuthError("");

    if (!isSignup) {
      if (!form.email.trim()) nextErrors.email = "Email is required.";
      if (!form.password.trim()) nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);

    try {
      if (isSignup) {
        // Register flow
        const payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          age: Number(form.age),
          sex: form.sex,
          phone: form.phone,
          bloodGroup: form.bloodGroup,
          allergies: form.allergies.split(",").map(i => i.trim()).filter(Boolean),
          currentDiseases: form.currentDiseases.split(",").map(i => i.trim()).filter(Boolean).map(disease => ({ diseaseName: disease, severity: 'Moderate', status: 'Ongoing' })),
          currentMedications: form.currentMedications.split(",").map(i => i.trim()).filter(Boolean).map(medicine => ({ medicineName: medicine, dosage: 'Standard', frequency: 'Daily' })),
        };

        await api.register(payload);

        // Auto-login after register
        const loginData = await api.login({ email: form.email, password: form.password });
        writeStorage(storageKeys.token, loginData.token);
        login({ role, name: loginData.user.name, email: loginData.user.email, userId: loginData.user._id });
        navigate(role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard");

      } else {
        // Login flow
        const loginData = await api.login({ email: form.email, password: form.password });
        writeStorage(storageKeys.token, loginData.token);
        login({ role, name: loginData.user.name, email: loginData.user.email, userId: loginData.user._id });
        navigate(role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard");
      }
    } catch (err) {
      setAuthError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
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
      </div>

      <Card className="mx-auto w-full max-w-xl rounded-[2rem] p-8">
        {authError && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {authError}
          </div>
        )}

        <form className="space-y-5" onSubmit={isSignup && step === 1 ? handleNextStep : handleSubmit}>
          {(!isSignup || step === 1) && (
            <>
              {isSignup && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Name</label>
                    <input
                      className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="mt-2 text-sm text-rose-500">{errors.name}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Age</label>
                      <input
                        type="number"
                        min="1"
                        className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
                        value={form.age}
                        onChange={(event) => setForm({ ...form, age: event.target.value })}
                        placeholder="Age"
                      />
                      {errors.age && <p className="mt-2 text-sm text-rose-500">{errors.age}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Sex</label>
                      <select
                        className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none bg-transparent dark:text-white"
                        value={form.sex}
                        onChange={(event) => setForm({ ...form, sex: event.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Phone</label>
                      <input
                        className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
                        value={form.phone}
                        onChange={(event) => setForm({ ...form, phone: event.target.value })}
                        placeholder="Phone Number"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Blood Group</label>
                      <select
                        className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none bg-transparent dark:text-white"
                        value={form.bloodGroup}
                        onChange={(event) => setForm({ ...form, bloodGroup: event.target.value })}
                      >
                        <option value="A+">A+</option>
                        <option value="B+">B+</option>
                        <option value="O+">O+</option>
                        <option value="AB+">AB+</option>
                        <option value="A-">A-</option>
                        <option value="B-">B-</option>
                        <option value="O-">O-</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email address</label>
                <input
                  type="email"
                  className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="name@example.com"
                />
                {errors.email && <p className="mt-2 text-sm text-rose-500">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
                <input
                  type="password"
                  className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Enter a secure password"
                />
                {errors.password && <p className="mt-2 text-sm text-rose-500">{errors.password}</p>}
              </div>
            </>
          )}

          {isSignup && step === 2 && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Allergies (comma separated)</label>
                <input
                  className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
                  value={form.allergies}
                  onChange={(event) => setForm({ ...form, allergies: event.target.value })}
                  placeholder="E.g. Peanuts, Penicillin"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Current Diseases (comma separated)</label>
                <input
                  className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
                  value={form.currentDiseases}
                  onChange={(event) => setForm({ ...form, currentDiseases: event.target.value })}
                  placeholder="E.g. Type 2 Diabetes, Hypertension"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Current Medications (comma separated)</label>
                <input
                  className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
                  value={form.currentMedications}
                  onChange={(event) => setForm({ ...form, currentMedications: event.target.value })}
                  placeholder="E.g. Metformin, Lisinopril"
                />
              </div>

              <div className="flex gap-4">
                <Button type="button" className="w-1/3 bg-slate-200 text-slate-800 hover:bg-slate-300" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="w-2/3" disabled={loading}>
                  {loading ? "Registering..." : "Complete Registration"}
                </Button>
              </div>
            </>
          )}

          {(!isSignup || step === 1) && (
            <Button className="w-full" disabled={loading}>
              {loading ? "Processing..." : isSignup ? "Next Step" : "Login"}
            </Button>
          )}
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
