"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type AppTheme = "light" | "dark";
export type MonacoTheme = "vs-dark" | "light";

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  editorTheme: MonacoTheme;
  setEditorTheme: (theme: MonacoTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "dojo_app_theme";
const EDITOR_THEME_STORAGE_KEY = "dojo_editor_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>("light");
  const [editorTheme, setEditorThemeState] = useState<MonacoTheme>("vs-dark");

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
      if (storedTheme === "dark" || storedTheme === "light") {
        setThemeState(storedTheme);
        document.documentElement.classList.toggle("dark", storedTheme === "dark");
      }
      const storedEditorTheme = localStorage.getItem(EDITOR_THEME_STORAGE_KEY) as MonacoTheme | null;
      if (storedEditorTheme === "light" || storedEditorTheme === "vs-dark") {
        setEditorThemeState(storedEditorTheme);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // safe fallback
    }
  };

  const setEditorTheme = (newEditorTheme: MonacoTheme) => {
    setEditorThemeState(newEditorTheme);
    try {
      localStorage.setItem(EDITOR_THEME_STORAGE_KEY, newEditorTheme);
    } catch {
      // safe fallback
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, editorTheme, setEditorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "light" as AppTheme,
      setTheme: () => {},
      editorTheme: "vs-dark" as MonacoTheme,
      setEditorTheme: () => {},
    };
  }
  return context;
}
