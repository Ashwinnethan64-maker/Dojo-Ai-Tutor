"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [hintAggressiveness, setHintAggressiveness] = useState("balanced");
  const [editorTheme, setEditorTheme] = useState("vs-dark");

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
          Settings &amp; Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] font-medium">
          Manage your AI tutor scaffolding, editor workspace, and account configuration
        </p>
      </div>

      {/* AI Tutor Scaffolding Preferences */}
      <Card shadowVariant="hard" className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">AI Tutor &amp; Scaffolding</CardTitle>
          <CardDescription className="text-xs">
            Control how subtly DOJO AI provides hints before suggesting code solutions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setHintAggressiveness("strict")}
              className={`p-4 rounded-2xl border-2 border-[#1E293B] cursor-pointer transition-all ${
                hintAggressiveness === "strict"
                  ? "bg-[#FFFDF5] shadow-[4px_4px_0_#8B5CF6] -translate-y-0.5"
                  : "bg-white shadow-[2px_2px_0_#1E293B] hover:-translate-y-0.5"
              }`}
            >
              <h4 className="font-heading text-xs font-bold text-[#1E293B]">Strict Socratic</h4>
              <p className="mt-1 text-[11px] text-[#64748B] font-medium leading-relaxed">Max reasoning delay. Zero code hints until Level 4.</p>
            </div>

            <div
              onClick={() => setHintAggressiveness("balanced")}
              className={`p-4 rounded-2xl border-2 border-[#1E293B] cursor-pointer transition-all ${
                hintAggressiveness === "balanced"
                  ? "bg-[#FFFDF5] shadow-[4px_4px_0_#8B5CF6] -translate-y-0.5"
                  : "bg-white shadow-[2px_2px_0_#1E293B] hover:-translate-y-0.5"
              }`}
            >
              <h4 className="font-heading text-xs font-bold text-[#1E293B]">Balanced (Recommended)</h4>
              <p className="mt-1 text-[11px] text-[#64748B] font-medium leading-relaxed">Progressive L1 &rarr; L5 cognitive hints.</p>
            </div>

            <div
              onClick={() => setHintAggressiveness("guided")}
              className={`p-4 rounded-2xl border-2 border-[#1E293B] cursor-pointer transition-all ${
                hintAggressiveness === "guided"
                  ? "bg-[#FFFDF5] shadow-[4px_4px_0_#8B5CF6] -translate-y-0.5"
                  : "bg-white shadow-[2px_2px_0_#1E293B] hover:-translate-y-0.5"
              }`}
            >
              <h4 className="font-heading text-xs font-bold text-[#1E293B]">Direct Guided</h4>
              <p className="mt-1 text-[11px] text-[#64748B] font-medium leading-relaxed">Rapid code examples &amp; direct syntax direction.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor Preferences */}
      <Card shadowVariant="hard" className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Coding Workspace</CardTitle>
          <CardDescription className="text-xs">
            Configure Monaco Editor syntax preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl border-2 border-[#1E293B] bg-[#FFFDF5]">
            <div>
              <span className="font-heading text-xs font-bold text-[#1E293B]">Editor Theme</span>
              <p className="text-[11px] text-[#64748B]">Default coding syntax highlight theme</p>
            </div>
            <select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value)}
              className="px-3 py-1.5 rounded-xl border-2 border-[#1E293B] bg-white text-xs font-heading font-bold text-[#1E293B] focus:outline-none"
            >
              <option value="vs-dark">VS Dark (Default)</option>
              <option value="light">Light</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
