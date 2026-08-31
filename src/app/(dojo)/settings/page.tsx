"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  const [hintAggressiveness, setHintAggressiveness] = useState("balanced");
  const [editorTheme, setEditorTheme] = useState("vs-dark");

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Settings &amp; Preferences
        </h1>
        <p className="text-sm text-zinc-500">
          Manage your AI tutor scaffolding, editor workspace, and account configuration
        </p>
      </div>

      {/* AI Tutor Scaffolding Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Tutor &amp; Scaffolding</CardTitle>
          <CardDescription className="text-xs">
            Control how subtly DOJO AI provides hints before suggesting code solutions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setHintAggressiveness("strict")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                hintAggressiveness === "strict"
                  ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Strict Socratic</h4>
              <p className="mt-1 text-[11px] text-zinc-500">Max reasoning delay. Zero code hints until Level 4.</p>
            </div>

            <div
              onClick={() => setHintAggressiveness("balanced")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                hintAggressiveness === "balanced"
                  ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Balanced (Recommended)</h4>
              <p className="mt-1 text-[11px] text-zinc-500">Progressive L1 &rarr; L5 cognitive hints.</p>
            </div>

            <div
              onClick={() => setHintAggressiveness("guided")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                hintAggressiveness === "guided"
                  ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Accelerated</h4>
              <p className="mt-1 text-[11px] text-zinc-500">Faster access to pseudocode and debugging steps.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coding Workspace &amp; Editor</CardTitle>
          <CardDescription className="text-xs">
            Configure Monaco Editor syntax highlighting, font sizing, and keybindings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Monaco Theme</p>
              <p className="text-[11px] text-zinc-500">Select active syntax color scheme</p>
            </div>
            <select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value)}
              className="text-xs p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            >
              <option value="vs-dark">VS Code Dark</option>
              <option value="light">VS Code Light</option>
              <option value="hc-black">High Contrast</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Spaced Repetition Schedule</p>
              <p className="text-[11px] text-zinc-500">FSRS daily review target</p>
            </div>
            <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
              10 Cards / Day
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
