"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEditorTheme } from "@/contexts/theme-context";
import { Sparkles, Code2 } from "lucide-react";

export default function SettingsPage() {
  const { editorTheme, setEditorTheme } = useEditorTheme();
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
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
          Settings &amp; Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] font-medium">
          Manage your Monaco coding workspace and Sensei AI tutoring scaffolding
        </p>
      </div>

      {/* 1. Monaco Coding Workspace Preferences */}
      <Card shadowVariant="hard" className="bg-white border-2 border-[#1E293B]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-[#8B5CF6]" />
            <CardTitle className="text-lg">Coding Workspace</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Configure Monaco Editor syntax preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-[#1E293B] bg-[#FFFDF5]">
            <div>
              <span className="font-heading text-xs font-bold text-[#1E293B]">Monaco Theme</span>
              <p className="text-[11px] text-[#64748B]">Syntax highlight theme in the workout coding editor</p>
            </div>
            <select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border-2 border-[#1E293B] bg-white text-xs font-heading font-bold text-[#1E293B] focus:outline-none cursor-pointer shadow-[2px_2px_0_#1E293B]"
            >
              <option value="vs-dark">VS Dark (Default)</option>
              <option value="light">Light Editor</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 2. Sensei AI Scaffolding Preferences */}
      <Card shadowVariant="hard" className="bg-white border-2 border-[#1E293B]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#F472B6]" />
            <CardTitle className="text-lg">Sensei AI Scaffolding</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Control how subtly Sensei provides progressive Socratic hints before suggesting code solutions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setHintAggressiveness("strict")}
              className={`p-4 rounded-2xl border-2 border-[#1E293B] cursor-pointer transition-all ${
                hintAggressiveness === "strict"
                  ? "bg-[#FFFDF5] shadow-[4px_4px_0_#8B5CF6] -translate-y-0.5 ring-2 ring-[#8B5CF6]/30"
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
                  ? "bg-[#FFFDF5] shadow-[4px_4px_0_#8B5CF6] -translate-y-0.5 ring-2 ring-[#8B5CF6]/30"
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
                  ? "bg-[#FFFDF5] shadow-[4px_4px_0_#8B5CF6] -translate-y-0.5 ring-2 ring-[#8B5CF6]/30"
                  : "bg-white shadow-[2px_2px_0_#1E293B] hover:-translate-y-0.5"
              }`}
            >
              <h4 className="font-heading text-xs font-bold text-[#1E293B]">Direct Guided</h4>
              <p className="mt-1 text-[11px] text-[#64748B] font-medium leading-relaxed">Rapid code examples &amp; direct syntax direction.</p>
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
