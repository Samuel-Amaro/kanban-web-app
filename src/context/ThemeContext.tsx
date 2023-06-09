import React, { useState, useContext, useEffect } from "react";

type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  toggleTheme: (theme: Theme) => void;
};

export const ThemeContext = React.createContext<null | ThemeContextType>(null);

type PropsProviderThemeContext = {
  children: React.ReactNode;
};

export function ThemeContextProvider({ children }: PropsProviderThemeContext) {
  const themeOption = localStorage.getItem("themeOption");
  const [theme, setTheme] = useState<Theme>(themeOption ? themeOption as Theme : "light");

  useEffect(() => {
    const body = document.querySelector("body") as HTMLBodyElement;
    body.dataset.theme = theme;
    localStorage.setItem("themeOption", theme);
  }, [theme]);

  function toggleTheme(theme: Theme) {
    setTheme(theme);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("Error in theme context");
  }

  return themeContext;
}
