"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { Sun, Moon, Laptop, Sparkles, Code2 } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme, editorTheme, setEditorTheme } = useTheme();
  const [hintAggressiveness, setHintAggressiveness] = useState("balanced");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B] dark:text-white">
          Settings &amp; Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] font-medium">
          Manage your global application theme, AI tutor scaffolding, and Monaco editor preferences
        </p>
      </div>

      {/* 1. Global Application Theme Settings */}
      <Card shadowVariant="hard" className="bg-white dark:bg-[#1E293B] border-2 border-[#1E293B] dark:border-[#334155]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-[#FBBF24]" />
            <CardTitle className="text-lg dark:text-white">Application Theme</CardTitle>
          </div>
          <CardDescription className="text-xs dark:text-[#94A3B8]">
            Customize the overall look and feel of the DOJO AI platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Light Mode Tile */}
            <div
              onClick={() => setTheme("light")}
              className={`p-4 rounded-2xl border-2 border-[#1E293B] cursor-pointer transition-all flex items-center justify-between ${
                theme === "light"
                  ? "bg-[#FFFDF5] shadow-[4px_4px_0_#8B5CF6] -translate-y-0.5 ring-2 ring-[#8B5CF6]/30"
                  : "bg-white dark:bg-[#0F172A] shadow-[2px_2px_0_#1E293B] hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FFFDF5] border-2 border-[#1E293B] flex items-center justify-center text-[#FBBF24]">
                  <Sun className="h-4 w-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-bold text-[#1E293B] dark:text-white">DOJO Light (Cream &amp; Slate)</h4>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Playful geometric high contrast</p>
                </div>
              </div>
              {theme === "light" && <span className="w-3 h-3 rounded-full bg-[#8B5CF6]" />}
            </div>

            {/* Dark Mode Tile */}
            <div
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-2xl border-2 border-[#1E293B] cursor-pointer transition-all flex items-center justify-between ${
                theme === "dark"
                  ? "bg-[#0F172A] shadow-[4px_4px_0_#8B5CF6] -translate-y-0.5 ring-2 ring-[#8B5CF6]/30"
                  : "bg-white dark:bg-[#0F172A] shadow-[2px_2px_0_#1E293B] hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#1E293B] border-2 border-[#1E293B] flex items-center justify-center text-[#8B5CF6]">
                  <Moon className="h-4 w-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-bold text-[#1E293B] dark:text-white">DOJO Dark (Midnight Slate)</h4>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Deep navy with high-visibility accents</p>
                </div>
              </div>
              {theme === "dark" && <span className="w-3 h-3 rounded-full bg-[#8B5CF6]" />}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Monaco Coding Workspace Preferences */}
      <Card shadowVariant="hard" className="bg-white dark:bg-[#1E293B] border-2 border-[#1E293B] dark:border-[#334155]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-[#8B5CF6]" />
            <CardTitle className="text-lg dark:text-white">Coding Workspace (Monaco Editor)</CardTitle>
          </div>
          <CardDescription className="text-xs dark:text-[#94A3B8]">
            Configure editor syntax highlighting theme independently from the website theme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-[#0F172A]">
            <div>
              <span className="font-heading text-xs font-bold text-[#1E293B] dark:text-white">Monaco Theme</span>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Syntax highlighting palette in the workouts editor</p>
            </div>
            <select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-[#1E293B] text-xs font-heading font-bold text-[#1E293B] dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="vs-dark">VS Dark (Default)</option>
              <option value="light">Light Editor</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 3. AI Tutor Scaffolding Preferences */}
      <Card shadowVariant="hard" className="bg-white dark:bg-[#1E293B] border-2 border-[#1E293B] dark:border-[#334155]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#F472B6]" />
            <CardTitle className="text-lg dark:text-white">Sensei AI Scaffolding</CardTitle>
          </div>
          <CardDescription className="text-xs dark:text-[#94A3B8]">
            Control how subtly Sensei provides Socratic hints before suggesting code solutions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setHintAggressiveness("strict")}
              className={`p-4 rounded-2xl border-2 border-[#1E293B] cursor-pointer transition-all ${
                hintAggressiveness === "strict"
                  ? "bg-[#FFFDF5] dark:bg-[#0F172A] shadow-[4px_4px_0_#8B5CF6] -translate-y-0.5 ring-2 ring-[#8B5CF6]/30"
                  : "bg-white dark:bg-[#1E293B] shadow-[2px_2px_0_#1E293B] hover:-translate-y-0.5"
              }`}
            >
              <h4 className="font-heading text-xs font-bold text-[#1E293B] dark:text-white">Strict Socratic</h4>
              <p className="mt-1 text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium leading-relaxed">Max reasoning delay. Zero code hints until Level 4.</p>
            </div>

            <div
              onClick={() => setHintAggressiveness("balanced")}
              className={`p-4 rounded-2xl border-2 border-[#1E293B] cursor-pointer transition-all ${
                hintAggressiveness === "balanced"
                  ? "bg-[#FFFDF5] dark:bg-[#0F172A] shadow-[4px_4px_0_#8B5CF6] -translate-y-0.5 ring-2 ring-[#8B5CF6]/30"
                  : "bg-white dark:bg-[#1E293B] shadow-[2px_2px_0_#1E293B] hover:-translate-y-0.5"
              }`}
            >
              <h4 className="font-heading text-xs font-bold text-[#1E293B] dark:text-white">Balanced (Recommended)</h4>
              <p className="mt-1 text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium leading-relaxed">Progressive L1 &rarr; L5 cognitive hints.</p>
            </div>

            <div
              onClick={() => setHintAggressiveness("guided")}
              className={`p-4 rounded-2xl border-2 border-[#1E293B] cursor-pointer transition-all ${
                hintAggressiveness === "guided"
                  ? "bg-[#FFFDF5] dark:bg-[#0F172A] shadow-[4px_4px_0_#8B5CF6] -translate-y-0.5 ring-2 ring-[#8B5CF6]/30"
                  : "bg-white dark:bg-[#1E293B] shadow-[2px_2px_0_#1E293B] hover:-translate-y-0.5"
              }`}
            >
              <h4 className="font-heading text-xs font-bold text-[#1E293B] dark:text-white">Direct Guided</h4>
              <p className="mt-1 text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium leading-relaxed">Rapid code examples &amp; direct syntax direction.</p>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={handleSave} variant="primary" size="md" className="shadow-[3px_3px_0_#1E293B]">
              {savedSuccess ? "Preferences Saved!" : "Save Preferences"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
