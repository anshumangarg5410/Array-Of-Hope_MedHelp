import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import SectionHeading from "../components/SectionHeading";

const roles = [
  {
    title: "Patient",
    description: "Upload prescriptions, check interactions, ask the AI assistant, and stay connected with your doctor.",
    role: "patient",
  },
  {
    title: "Doctor",
    description: "Review patient history, inspect flagged interactions, and coordinate medication decisions quickly.",
    role: "doctor",
  },
];

export default function RoleSelectionPage() {
  return (
    <div className="section-shell py-16">
      <SectionHeading
        eyebrow="Authentication"
        title="Choose the experience that matches your workflow"
        body="A clean role-based entry flow keeps the app focused for patients and doctors from the first click."
        align="center"
      />

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
        {roles.map((item) => (
          <Card key={item.role} className="rounded-[2rem] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-glow">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-emerald-400" />
            <h3 className="mt-6 font-display text-3xl font-semibold text-slate-950 dark:text-white">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
            <div className="mt-8 flex gap-3">
              <Link to={`/auth/login?role=${item.role}`}>
                <Button>Login</Button>
              </Link>
              <Link to={`/auth/signup?role=${item.role}`}>
                <Button variant="secondary">Signup</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
