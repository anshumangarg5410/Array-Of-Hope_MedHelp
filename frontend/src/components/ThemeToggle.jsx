import Button from "./Button";
import { useAppContext } from "../utils/AppContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAppContext();

  return (
    <Button variant="secondary" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "light" ? "Dark mode" : "Light mode"}
    </Button>
  );
}
