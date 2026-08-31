"use client";

import React, { useState } from "react";
import {
  Bell,
  Code2,
  ChevronDown,
  Moon,
  Sun,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export function Header({ onToggleMobileMenu }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="h-16 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-[#0e0e11]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Quick Language Selector */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 cursor-pointer hover:border-zinc-300 transition-colors">
          <Code2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            Python Core
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600" />
        </Button>

        {/* User Profile avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-200 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-semibold text-xs shadow-xs">
            A
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
              Ashwin
            </p>
            <p className="text-[10px] text-zinc-500 font-mono">Yellow Belt</p>
          </div>
        </div>
      </div>
    </header>
  );
}
