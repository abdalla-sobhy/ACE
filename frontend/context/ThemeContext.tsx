
"use client";
import React, { createContext, useEffect, useState, ReactNode } from "react";
import { setTheme as setThemeCookie, type Theme } from "@/app/actions/theme";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({
  children,
  initialTheme = "light"
}: {
  children: ReactNode;
  initialTheme?: Theme;
}) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  // Apply theme class on mount
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // Update cookie via server action
    await setThemeCookie(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
