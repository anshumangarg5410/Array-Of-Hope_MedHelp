import { useMemo, useState, useEffect } from "react";
import ChatBox from "../components/ChatBox";
import Card from "../components/Card";
import Button from "../components/Button";
import SectionHeading from "../components/SectionHeading";
import Modal from "../components/Modal";
import { useAppContext } from "../utils/AppContext";
import { api } from "../services/api";

export default function PatientDashboardPage() {
  const {
    session,
    uploadState,
    setUploadState,
    addManualPrescription,
    patientPortalMessages,
    sendPatientPortalMessage,
  } = useAppContext();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [doseTab, setDoseTab] = useState("adults");
  const [gender, setGender] = useState("women");
  const [open, setOpen] = useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [entryMode, setEntryMode] = useState("upload");
  const [manualPrescription, setManualPrescription] = useState({
    title: "",
    medicines: "",
  });

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
      
      // Auto-set the doseTab based on actual data
      if (data.ageCategory === "Child") setDoseTab("kids");
      if (data.ageCategory === "Adult") setDoseTab("adults");
      if (data.ageCategory === "Geriatric") setDoseTab("geriatric");

      if (data.sex === "Male") setGender("men");
      if (data.sex === "Female") setGender("women");
      
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session.isAuthenticated) {
      fetchProfile();
    }
  }, [session.isAuthenticated]);

  // Fallback suggestions if we want to keep them dynamic
  const suggestions = useMemo(() => {
    const defaultSuggestions = [
      "Keep an updated list of your active medications and current diseases.",
      "Always check for drug interactions when adding new prescriptions.",
    ];
    return defaultSuggestions;
  }, []);

  const [saving, setSaving] = useState(false);

  const handleManualPrescriptionSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await api.addPrescription(manualPrescription);
      
      // Update the global upload state so the dashboard "Latest Summary" updates
      if (response.aiResult) {
        setUploadState(prev => ({
          ...prev,
          interactions: response.aiResult,
          lastCheckedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
      }

      setManualPrescription({
        title: "",
        medicines: "",
      });
      setPrescriptionModalOpen(false);
      
      // Instantly refresh the dashboard with new database data
      await fetchProfile();
      
      // If unsafe, scroll to the summary or show a toast? 
      // For now, the "Latest Summary" card will update automatically.
    } catch (err) {
      console.error("Failed to save prescription:", err);
      alert("Failed to save prescription. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500">Loading your health dashboard...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-rose-500">Failed to load profile. Please log in again.</div>;
  }

  // Dynamic calculations
  const activePrescriptionsCount = profile.prescriptions?.length || 0;
  const flaggedCombinationsCount = profile.aiHistory?.filter(h => h.riskLevel === 'High').length || 0;
  
  // Calculate a mock wellness score: start at 100, subtract for severe diseases or high risk
  const severeDiseases = profile.currentDiseases?.filter(d => d.severity === 'Severe').length || 0;
  const wellnessScore = Math.max(0, 100 - (severeDiseases * 5) - (flaggedCombinationsCount * 10));

  const patientStats = [
    { label: "Active prescriptions", value: activePrescriptionsCount },
    { label: "Flagged combinations", value: flaggedCombinationsCount },
    { label: "Doctor responses", value: 0 }, // Placeholder since Doctor portal isn't built
    { label: "Wellness score", value: `${wellnessScore}%` },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <SectionHeading
              eyebrow="Patient dashboard"
              title={`Welcome back, ${profile.name || "Patient"}`}
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
              {uploadState.interactions && !uploadState.interactions.isSafe ? (
                <div className="rounded-2xl bg-rose-50/80 p-4 text-sm text-rose-900 dark:bg-rose-400/10 dark:text-rose-100">
                  {uploadState.interactions.explanation || "Severe interaction present. Review with your doctor before taking both medicines."}
                </div>
              ) : (
                <div className="rounded-2xl bg-green-50/80 p-4 text-sm text-green-900 dark:bg-green-400/10 dark:text-green-100">
                  Your recent prescription looks safe! No negative interactions found.
                </div>
              )}
              <div className="rounded-2xl bg-white/70 p-4 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
                Suggested next step: add another prescription, re-check the upload flow, or continue the doctor conversation.
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="flex-1" onClick={() => setOpen(true)}>
                View care summary
              </Button>
              <Button className="flex-1" variant="secondary" onClick={() => setPrescriptionModalOpen(true)}>
                Add Prescription
              </Button>
            </div>
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
            {suggestions.map((item, index) => (
              <Card key={index} className="rounded-[1.75rem] p-5">
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{item}</p>
              </Card>
            ))}
            <Card className="rounded-[1.75rem] p-5">
              <h4 className="text-lg font-semibold text-slate-950 dark:text-white">Health Profile Info</h4>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Blood Group: {profile.bloodGroup || "Not specified"}<br/>
                Allergies: {profile.allergies?.length > 0 ? profile.allergies.join(", ") : "None"}<br/>
              </p>
            </Card>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Ongoing Medicines</p>
          <div className="mt-5 space-y-3">
            {profile.currentMedications && profile.currentMedications.length > 0 ? (
              profile.currentMedications.map((medicine, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-between gap-3 rounded-[1.5rem] bg-white/70 p-4 dark:bg-white/5 sm:flex-row sm:items-center"
                >
                  <div>
                    <h4 className="font-semibold text-slate-950 dark:text-white">{medicine.medicineName || medicine}</h4>
                    {medicine.frequency && <p className="text-sm text-slate-500 dark:text-slate-400">{medicine.frequency}</p>}
                  </div>
                  {medicine.dosage && (
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-400/10 dark:text-sky-200">
                      {medicine.dosage}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] bg-white/70 p-4 dark:bg-white/5 text-sm text-slate-500">
                No active medications found in your profile.
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">My Health Data</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                Past prescriptions and ongoing diseases
              </h3>
            </div>
            <Button variant="secondary" onClick={() => setPrescriptionModalOpen(true)}>
              Add Prescription
            </Button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Past Prescriptions</p>
              {profile.prescriptions && profile.prescriptions.length > 0 ? (
                profile.prescriptions.map((prescription, idx) => (
                  <div key={idx} className="rounded-[1.5rem] bg-white/70 p-4 dark:bg-white/5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold text-slate-950 dark:text-white">{prescription.diagnosis || "General Visit"}</h4>
                      <span className="text-xs text-slate-400">{new Date(prescription.issuedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {prescription.medications?.map((item, mIdx) => (
                        <span
                          key={mIdx}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300"
                        >
                          {item.medicineName || item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No prescriptions added yet.</p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Diseases</p>
              {profile.currentDiseases && profile.currentDiseases.length > 0 ? (
                profile.currentDiseases.map((disease, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-[1.5rem] bg-white/70 px-4 py-3 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-200"
                  >
                    <span>{disease.diseaseName || disease}</span>
                    <span className="text-xs text-emerald-500">Ongoing</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No active diseases recorded.</p>
              )}
              
              <div className="rounded-[1.5rem] bg-sky-50/80 p-4 text-sm text-sky-900 dark:bg-sky-400/10 dark:text-sky-100">
                Age: {profile.age || "Not specified"} • Sex: {profile.sex || "Not specified"}
              </div>
            </div>
          </div>
        </Card>


      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Care summary">
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
          This feature will dynamically summarize your past health reports once the full AI pipeline is integrated. Stay tuned!
        </p>
      </Modal>

      <Modal open={prescriptionModalOpen} onClose={() => setPrescriptionModalOpen(false)} title="Add Prescription">
        <div className="flex gap-2">
          {["upload", "manual"].map((mode) => (
            <button
              key={mode}
              className={`rounded-full px-4 py-2 text-sm transition ${
                entryMode === mode
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "glass-panel text-slate-600 dark:text-slate-300"
              }`}
              onClick={() => setEntryMode(mode)}
            >
              {mode === "upload" ? "Upload Image" : "Add Manually"}
            </button>
          ))}
        </div>

        {entryMode === "upload" ? (
          <div className="mt-6 rounded-[1.5rem] bg-white/70 p-5 text-sm leading-7 text-slate-600 dark:bg-white/5 dark:text-slate-300">
            Use the existing upload workflow from the sidebar to add an image-based prescription. This option keeps the experience consistent with OCR processing and interaction checks.
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleManualPrescriptionSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Prescription title
              </label>
              <input
                className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
                value={manualPrescription.title}
                onChange={(event) =>
                  setManualPrescription((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Ex: General physician visit"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Medicines
              </label>
              <textarea
                rows="5"
                className="glass-panel w-full rounded-2xl border-0 px-4 py-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
                value={manualPrescription.medicines}
                onChange={(event) =>
                  setManualPrescription((current) => ({
                    ...current,
                    medicines: event.target.value,
                  }))
                }
                placeholder={"One medicine per line\nParacetamol 650mg\nMetformin 500mg"}
              />
            </div>
            <Button className="w-full" type="submit">
              Save prescription
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
