import React, { useState, useContext, useEffect } from "react";

type ThemeContextType = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
};

export const ThemeContext = React.createContext<null | ThemeContextType>(null);

type PropsProviderThemeContext = {
  children: React.ReactNode;
};

export function ThemeContextProvider({ children }: PropsProviderThemeContext) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const body = document.querySelector("body") as HTMLBodyElement;
    body.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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