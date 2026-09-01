"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type MonacoTheme = "vs-dark" | "light";

interface EditorThemeContextType {
  editorTheme: MonacoTheme;
  setEditorTheme: (theme: MonacoTheme) => void;
}

const EditorThemeContext = createContext<EditorThemeContextType | undefined>(undefined);

const EDITOR_THEME_STORAGE_KEY = "dojo_editor_theme";

export function EditorThemeProvider({ children }: { children: React.ReactNode }) {
  const [editorTheme, setEditorThemeState] = useState<MonacoTheme>("vs-dark");

  useEffect(() => {
    try {
      const storedEditorTheme = localStorage.getItem(EDITOR_THEME_STORAGE_KEY) as MonacoTheme | null;
      if (storedEditorTheme === "light" || storedEditorTheme === "vs-dark") {
        setEditorThemeState(storedEditorTheme);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const setEditorTheme = (newEditorTheme: MonacoTheme) => {
    setEditorThemeState(newEditorTheme);
    try {
      localStorage.setItem(EDITOR_THEME_STORAGE_KEY, newEditorTheme);
    } catch {
      // safe fallback
    }
  };

  return (
    <EditorThemeContext.Provider value={{ editorTheme, setEditorTheme }}>
      {children}
    </EditorThemeContext.Provider>
  );
}

export function useEditorTheme() {
  const context = useContext(EditorThemeContext);
  if (!context) {
    return {
      editorTheme: "vs-dark" as MonacoTheme,
      setEditorTheme: () => {},
    };
  }
  return context;
}
