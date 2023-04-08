import React, { useState, useContext, useEffect } from "react";

type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  toggleTheme: (
    theme: Theme
  ) => void /*React.Dispatch<React.SetStateAction<string>>*/;
};

//TODO: VALOR INICIAL DO TEMA PARA CONTEXT VEM DO LOCALSTORAGE DO BROWSER

export const ThemeContext = React.createContext<null | ThemeContextType>(null);

type PropsProviderThemeContext = {
  children: React.ReactNode;
};

export function ThemeContextProvider({ children }: PropsProviderThemeContext) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const body = document.querySelector("body") as HTMLBodyElement;
    body.dataset.theme = theme;
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
