import { MdOutlineNightlight, MdOutlineWbSunny } from "react-icons/md";

import type { ThemeMode } from "@/hooks/useTheme";

type ThemeToggleProps = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

const ThemeToggle = ({ theme, toggleTheme }: ThemeToggleProps) => {
  const nextMode = theme === "light" ? "oscuro" : "claro";

  return (
    <button
      className="theme-toggle-button"
      onClick={toggleTheme}
      aria-label={`Cambiar a modo ${nextMode}`}
      title={`Cambiar a modo ${nextMode}`}
      type="button"
    >
      {theme === "light" ? <MdOutlineNightlight /> : <MdOutlineWbSunny />}
    </button>
  );
};

export default ThemeToggle;