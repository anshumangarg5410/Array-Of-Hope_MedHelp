import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import SectionHeading from "../components/SectionHeading";

const roles = [
  {
    title: "Patient",
    description: "Upload prescriptions, check interactions, ask the AI assistant, and stay connected with your doctor.",
    role: "patient",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
        <path
          d="M12 12.5a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 2c-4.4 0-7.75 2.3-7.75 5.05 0 .8.65 1.45 1.45 1.45h12.6c.8 0 1.45-.65 1.45-1.45 0-2.75-3.35-5.05-7.75-5.05Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Doctor",
    description: "Review patient history, inspect flagged interactions, and coordinate medication decisions quickly.",
    role: "doctor",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
        <path
          d="M8 4.75A2.75 2.75 0 0 1 10.75 2h2.5A2.75 2.75 0 0 1 16 4.75V6h2.25A2.75 2.75 0 0 1 21 8.75v8.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25v-8.5A2.75 2.75 0 0 1 5.75 6H8V4.75Zm2 0V6h4V4.75a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75ZM11 10v2H9a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2v-2a1 1 0 1 0-2 0Z"
          fill="currentColor"
        />
      </svg>
    ),
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-emerald-400 text-white shadow-glow">
              {item.icon}
            </div>
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
