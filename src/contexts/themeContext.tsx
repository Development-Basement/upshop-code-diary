import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const possibleThemes = ["light", "dark"] as const;

export type Theme = (typeof possibleThemes)[number];
export const DEFAULT_THEME: Theme = "dark";

type ThemeContextProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextProps>(
  {} as ThemeContextProps,
);

export function ThemeContextProvider({ children }: { children: JSX.Element }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  const applyTheme = (theme: Theme) => {
    const html = document.getElementsByTagName("html")[0];
    html?.setAttribute("data-theme", theme);
    if (theme === "dark") {
      html?.classList.add("dark");
    } else {
      html?.classList.remove("dark"); // light is by default
    }
  };

  // never changes
  const handleThemeChange = useCallback((theme: Theme) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    handleThemeChange(storedTheme ?? DEFAULT_THEME);
  }, [handleThemeChange]);

  const value = useMemo(
    () => ({ theme, setTheme: handleThemeChange }),
    [theme, handleThemeChange],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
