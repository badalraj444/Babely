import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();

  const isDark = theme === "forest";
  const toggleTheme = () => {
    setTheme(isDark ? "wireframe" : "forest");
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      aria-label="Toggle Theme"
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
};

export default ThemeToggle;
