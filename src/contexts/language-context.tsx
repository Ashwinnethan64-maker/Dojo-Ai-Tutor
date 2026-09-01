"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SupportedLanguageId = "python" | "javascript" | "typescript" | "cpp" | "java";

export interface SupportedLanguage {
  id: SupportedLanguageId;
  name: string;
  version: string;
  shortName: string;
  badge: string;
  editorLanguage: string;
  defaultFilename: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    id: "python",
    name: "Python 3.12",
    version: "3.12",
    shortName: "Python",
    badge: "Mastery Track",
    editorLanguage: "python",
    defaultFilename: "main.py",
  },
  {
    id: "javascript",
    name: "JavaScript",
    version: "ES2024 / Node 20",
    shortName: "JavaScript",
    badge: "Mastery Track",
    editorLanguage: "javascript",
    defaultFilename: "index.js",
  },
  {
    id: "typescript",
    name: "TypeScript",
    version: "5.4",
    shortName: "TypeScript",
    badge: "Mastery Track",
    editorLanguage: "typescript",
    defaultFilename: "index.ts",
  },
  {
    id: "cpp",
    name: "C++ (GCC 13)",
    version: "C++20",
    shortName: "C++",
    badge: "Mastery Track",
    editorLanguage: "cpp",
    defaultFilename: "main.cpp",
  },
  {
    id: "java",
    name: "Java (OpenJDK 21)",
    version: "21",
    shortName: "Java",
    badge: "Mastery Track",
    editorLanguage: "java",
    defaultFilename: "Main.java",
  },
];

const LANGUAGE_STORAGE_KEY = "dojo_active_language_id";

interface LanguageContextType {
  activeLanguage: SupportedLanguage;
  activeLanguageId: SupportedLanguageId;
  setActiveLanguage: (id: SupportedLanguageId) => void;
  languages: SupportedLanguage[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [activeLanguageId, setActiveLanguageId] = useState<SupportedLanguageId>("python");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguageId | null;
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.id === stored)) {
        setActiveLanguageId(stored);
      }
    } catch {
      // safe fallback
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const handleSetLanguage = (id: SupportedLanguageId) => {
    // Single-select radio semantics: setting an ID completely switches the active language
    setActiveLanguageId(id);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, id);
    } catch {
      // safe storage fallback
    }
  };

  const activeLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.id === activeLanguageId) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        activeLanguage,
        activeLanguageId,
        setActiveLanguage: handleSetLanguage,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for non-provider contexts or testing
    const defaultLang = SUPPORTED_LANGUAGES[0];
    return {
      activeLanguage: defaultLang,
      activeLanguageId: "python" as SupportedLanguageId,
      setActiveLanguage: () => {},
      languages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
}
