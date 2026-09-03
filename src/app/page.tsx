"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  RotateCcw,
  Zap,
  Target,
  BrainCircuit,
  Play,
  Code2,
  ExternalLink,
  CheckCircle2,
  Terminal,
  Layers,
  Award,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BeltBadge } from "@/components/dojo/belt";
import { GeometricDecoration } from "@/components/dojo/geometric-decoration";
import { DojoLogo } from "@/components/dojo/logo";

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"python" | "javascript" | "cpp">("python");

  const codeSnippets = {
    python: {
      filename: "main.py",
      lang: "Python 3.12",
      code: `def to_fahrenheit(celsius):\n    # Return the converted temperature\n    return (celsius * 9 / 5) + 32\n\n# Assertion tests verify exact return value\nassert to_fahrenheit(0) == 32.0\nassert to_fahrenheit(100) == 212.0`,
      testInput: "to_fahrenheit(0)",
      testExpected: "32.0",
      testActual: "32.0",
      hint: "Remember the order of operations: multiply by 9, divide by 5, then add 32.",
    },
    javascript: {
      filename: "solution.js",
      lang: "JavaScript ES2024",
      code: `function filterEvens(nums) {\n  // Filter and return only even integers\n  return nums.filter(n => n % 2 === 0);\n}\n\n// Verified with strict array comparison\nassert.deepStrictEqual(filterEvens([1, 2, 3, 4]), [2, 4]);`,
      testInput: "filterEvens([1, 2, 3, 4])",
      testExpected: "[2, 4]",
      testActual: "[2, 4]",
      hint: "Use the remainder operator: n % 2 === 0 cleanly identifies even numbers.",
    },
    cpp: {
      filename: "solution.cpp",
      lang: "C++ (GCC 13)",
      code: `int isPalindromeVector(const vector<int>& nums) {\n  int left = 0, right = nums.size() - 1;\n  while (left < right) {\n    if (nums[left] != nums[right]) return 0;\n    left++; right--;\n  }\n  return 1;\n}`,
      testInput: "isPalindromeVector({1, 2, 3, 2, 1})",
      testExpected: "1",
      testActual: "1",
      hint: "Two pointers converging from opposite ends provide an optimal O(N) check.",
    },
  };

  const currentSnippet = codeSnippets[activeTab];

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#1E293B] flex flex-col justify-between selection:bg-[#FBBF24] selection:text-[#1E293B]">
      {/* 1. Header Navigation - Clean hierarchy with subtle Sign In & non-competing Get Started */}
      <header className="h-20 border-b-2 border-[#1E293B] bg-white px-6 sm:px-12 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="group flex items-center gap-2" aria-label="DOJO AI Tutor Home">
          <DojoLogo size="lg" priority />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-heading font-bold text-[#64748B]">
          <Link href="#product-preview" className="hover:text-[#1E293B] transition-colors">
            Workspace Preview
          </Link>
          <Link href="/learn/python" className="hover:text-[#1E293B] transition-colors">
            Curriculum
          </Link>
          <Link href="/structured-workouts" className="hover:text-[#1E293B] transition-colors">
            Practice Track
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button
              variant="primary"
              size="sm"
              className="text-xs font-bold shadow-[4px_4px_0_#1E293B]"
            >
              <span>Enter the Dojo</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section - Unambiguous Single Dominant CTA */}
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-20 space-y-20">
        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          {/* Decorative Floating Shapes */}
          <div className="absolute -top-10 left-0 hidden md:block">
            <GeometricDecoration variant="star" color="yellow" size="lg" rotation={15} />
          </div>
          <div className="absolute top-4 right-0 hidden md:block">
            <GeometricDecoration variant="blob" color="pink" size="lg" />
          </div>

          <div className="inline-flex items-center gap-2">
            <Badge variant="purple" className="text-xs">
              Adaptive Martial Arts Coding Platform
            </Badge>
            <span className="text-xs font-mono font-bold text-[#64748B]">
              Python • JavaScript • C++ • Java
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-tight text-[#1E293B] leading-[1.15]">
            Practice Coding.{" "}
            <span className="text-[#7C3AED] underline decoration-[#FBBF24] decoration-8 underline-offset-4">
              Build Real Skill.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#64748B] font-medium max-w-2xl mx-auto leading-relaxed">
            DOJO AI Tutor turns coding challenges into disciplined training workouts with deterministic test execution, mistake memory, and tiered AI Sensei guidance.
          </p>

          {/* Primary Action vs Secondary Outline Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto text-base py-4 px-9 shadow-[6px_6px_0_#1E293B] gap-2.5 font-black focus-visible:ring-[#7C3AED]"
              >
                <Play className="h-5 w-5 fill-current" />
                <span>Start Learning</span>
              </Button>
            </Link>
            <a href="#product-preview" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto text-base py-4 px-8 shadow-[4px_4px_0_#1E293B] gap-2 font-bold"
              >
                <Layers className="h-5 w-5 stroke-[2.5]" />
                <span>See How It Works</span>
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs font-heading font-bold text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#059669] stroke-[2.5]" />
              Zero-setup browser sandbox
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#059669] stroke-[2.5]" />
              Free open source track
            </span>
          </div>
        </div>

        {/* 3. Authentic Product Showcase / "Your Coding Dojo" Preview */}
        <section id="product-preview" className="scroll-mt-28 space-y-4">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <Badge variant="warning" className="text-xs">
              Interactive Workspace
            </Badge>
            <h2 className="font-heading text-2xl sm:text-4xl font-black text-[#1E293B]">
              Inside Your Coding Dojo
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] font-medium">
              Real function invocation, deterministic test assertions, and progressive guidance designed to build algorithmic reflexes.
            </p>
          </div>

          {/* Interactive Mockup Container */}
          <div className="rounded-3xl border-2 border-[#1E293B] bg-white shadow-[8px_8px_0_#1E293B] overflow-hidden">
            {/* Top Workspace Header */}
            <div className="px-4 py-3 bg-[#FFFDF5] border-b-2 border-[#1E293B] flex flex-wrap items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444] border border-[#1E293B]" />
                  <div className="w-3 h-3 rounded-full bg-[#FBBF24] border border-[#1E293B]" />
                  <div className="w-3 h-3 rounded-full bg-[#34D399] border border-[#1E293B]" />
                </div>
                <span className="text-xs font-mono font-bold text-[#1E293B] pl-2 border-l border-[#1E293B]/20">
                  {currentSnippet.filename}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#7C3AED]/10 text-[#7C3AED] font-bold border border-[#7C3AED]/30">
                  {currentSnippet.lang}
                </span>
              </div>

              {/* Language Selector Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#1E293B]">
                {(["python", "javascript", "cpp"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-3 py-1 rounded-lg text-xs font-heading font-bold transition-all ${
                      activeTab === lang
                        ? "bg-[#7C3AED] text-white shadow-[2px_2px_0_#1E293B]"
                        : "text-[#64748B] hover:text-[#1E293B]"
                    }`}
                  >
                    {lang === "cpp" ? "C++" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor + Test Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
              {/* Code Editor Pane */}
              <div className="lg:col-span-7 p-5 bg-[#0F172A] text-slate-200 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto flex flex-col justify-between">
                <pre className="text-emerald-400">
                  <code>{currentSnippet.code}</code>
                </pre>
                <div className="pt-4 mt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                  <span>UTF-8 • 4 Spaces</span>
                  <span className="text-[#34D399] font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Sandbox Active
                  </span>
                </div>
              </div>

              {/* Live Test Suite & Sensei Hints Pane */}
              <div className="lg:col-span-5 bg-[#FFFDF5] border-t-2 lg:border-t-0 lg:border-l-2 border-[#1E293B] p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-xs uppercase tracking-wider text-[#1E293B] flex items-center gap-1.5">
                      <Terminal className="h-4 w-4 text-[#7C3AED] stroke-[2.5]" />
                      Verified Test Harness
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#34D399]/20 border border-[#059669] text-[#059669] text-[11px] font-mono font-bold">
                      2/2 Passed (18ms)
                    </span>
                  </div>

                  {/* Assertion Card */}
                  <div className="p-3 rounded-2xl bg-white border border-[#1E293B] shadow-[3px_3px_0_#1E293B] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                      <span>INPUT ASSERTION</span>
                      <span className="text-[#059669] font-bold">✓ MATCH</span>
                    </div>
                    <div className="font-mono text-xs text-[#1E293B] font-bold bg-[#F8FAFC] p-2 rounded-xl border border-slate-200">
                      {currentSnippet.testInput}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>
                        <span className="text-[#64748B] block text-[10px]">EXPECTED</span>
                        <span className="font-bold text-[#059669]">{currentSnippet.testExpected}</span>
                      </div>
                      <div>
                        <span className="text-[#64748B] block text-[10px]">ACTUAL RETURN</span>
                        <span className="font-bold text-[#059669]">{currentSnippet.testActual}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sensei Hint Box */}
                  <div className="p-3 rounded-2xl bg-[#FBBF24]/15 border border-[#1E293B] shadow-[3px_3px_0_#1E293B] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-heading font-black text-[#1E293B]">
                      <Sparkles className="h-3.5 w-3.5 text-[#7C3AED] fill-[#7C3AED]" />
                      <span>Sensei Guidance (Level 1)</span>
                    </div>
                    <p className="text-xs text-[#1E293B]/80 leading-relaxed font-medium">
                      &ldquo;{currentSnippet.hint}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Micro CTA */}
                <Link href="/workouts" className="block pt-2">
                  <Button variant="primary" size="sm" className="w-full text-xs font-bold gap-2">
                    <span>Try a Practice Workout Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Truthful Credibility & Platform Statistics Strip */}
        <section className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white shadow-[6px_6px_0_#1E293B]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#1E293B]/10">
            <div className="pt-4 md:pt-0 space-y-1">
              <span className="font-heading text-3xl sm:text-4xl font-black text-[#7C3AED]">4</span>
              <p className="font-heading font-bold text-xs uppercase text-[#1E293B] tracking-wider">
                Native Runtimes
              </p>
              <span className="text-[11px] text-[#64748B] font-medium block">
                Python, JS, C++, Java
              </span>
            </div>

            <div className="pt-4 md:pt-0 space-y-1">
              <span className="font-heading text-3xl sm:text-4xl font-black text-[#FBBF24]">8</span>
              <p className="font-heading font-bold text-xs uppercase text-[#1E293B] tracking-wider">
                Belt Tiers
              </p>
              <span className="text-[11px] text-[#64748B] font-medium block">
                White to Black Belt
              </span>
            </div>

            <div className="pt-4 md:pt-0 space-y-1">
              <span className="font-heading text-3xl sm:text-4xl font-black text-[#059669]">FSRS</span>
              <p className="font-heading font-bold text-xs uppercase text-[#1E293B] tracking-wider">
                Mistake Retention
              </p>
              <span className="text-[11px] text-[#64748B] font-medium block">
                Memory-based Spaced Repetition
              </span>
            </div>

            <div className="pt-4 md:pt-0 space-y-1">
              <span className="font-heading text-3xl sm:text-4xl font-black text-[#1E293B]">0ms</span>
              <p className="font-heading font-bold text-xs uppercase text-[#1E293B] tracking-wider">
                Local Setup
              </p>
              <span className="text-[11px] text-[#64748B] font-medium block">
                Instant Sandboxed Testing
              </span>
            </div>
          </div>
        </section>

        {/* 5. Core Pedagogical Loop Card Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable shadowVariant="hard" className="p-8 bg-white space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FBBF24] border-2 border-[#1E293B] flex items-center justify-center text-[#1E293B] shadow-[3px_3px_0_#1E293B]">
              <BrainCircuit className="h-6 w-6 stroke-[2.5]" />
            </div>
            <h3 className="font-heading text-xl font-black text-[#1E293B]">
              Mistake Memory Engine
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-medium">
              Every off-by-one error, variable scope leak, and syntax slip is fingerprinted to tailor your personal training regime.
            </p>
          </Card>

          <Card hoverable shadowVariant="yellow" className="p-8 bg-[#FFFDF5] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] border-2 border-[#1E293B] flex items-center justify-center text-white shadow-[3px_3px_0_#1E293B]">
              <RotateCcw className="h-6 w-6 stroke-[2.5]" />
            </div>
            <h3 className="font-heading text-xl font-black text-[#1E293B]">
              FSRS Spaced Repetition
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-medium">
              Active recall flashcards are generated from your actual workout mistakes to cement long-term conceptual retention.
            </p>
          </Card>

          <Card hoverable shadowVariant="mint" className="p-8 bg-white space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#34D399] border-2 border-[#1E293B] flex items-center justify-center text-[#1E293B] shadow-[3px_3px_0_#1E293B]">
              <Target className="h-6 w-6 stroke-[2.5]" />
            </div>
            <h3 className="font-heading text-xl font-black text-[#1E293B]">
              8-Tier Belt Progression
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-medium">
              Advance from White Belt to Black Belt by proving genuine code mastery, consistency, and problem-solving grit.
            </p>
          </Card>
        </div>

        {/* 6. Developer / Open Source Project Showcase Section */}
        <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white shadow-[8px_8px_0_#1E293B] flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#7C3AED]/10 text-[#7C3AED] font-mono text-[11px] font-bold border border-[#7C3AED]">
                OPEN SOURCE PROJECT
              </span>
              <span className="text-xs font-mono font-bold text-[#64748B]">
                Built by Ashwin Nethan
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
              Crafted with Deliberate Engineering
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] font-medium max-w-xl leading-relaxed">
              Explore the complete open-source codebase on GitHub, test the multi-language sandboxes, or connect directly on LinkedIn.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href="https://github.com/Ashwinnethan64-maker/Dojo-Ai-Tutor"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View DOJO AI source code on GitHub"
              className="w-full sm:w-auto"
            >
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto gap-2 text-xs font-bold shadow-[4px_4px_0_#1E293B] focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
              >
                <GitHubIcon className="h-4 w-4" />
                <span>View on GitHub</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </Button>
            </a>

            <a
              href="https://www.linkedin.com/in/ashwin-nethan-a59259366/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect with Ashwin Nethan on LinkedIn"
              className="w-full sm:w-auto"
            >
              <Button
                variant="secondary"
                size="md"
                className="w-full sm:w-auto gap-2 text-xs font-bold shadow-[3px_3px_0_#1E293B] focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
              >
                <LinkedInIcon className="h-4 w-4 text-[#0077B5]" />
                <span>Connect on LinkedIn</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </Button>
            </a>
          </div>
        </div>
      </main>

      {/* 7. Accessible Footer with Generous 44px+ Tap Targets */}
      <footer className="border-t-2 border-[#1E293B] bg-white py-12 px-6 sm:px-12 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <DojoLogo size="sm" priority />
            <p className="text-xs text-[#64748B] font-medium max-w-sm leading-relaxed">
              Adaptive programming workouts engineered with mistake fingerprinting, spaced repetition, and real-world execution sandboxes.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-heading font-black text-xs uppercase tracking-wider text-[#1E293B]">
              Learning Paths
            </span>
            <ul className="space-y-2 text-xs font-heading font-bold text-[#64748B]">
              <li>
                <Link
                  href="/learn/python"
                  className="hover:text-[#1E293B] transition-colors py-1.5 inline-block min-h-[36px]"
                >
                  Python Mastery
                </Link>
              </li>
              <li>
                <Link
                  href="/workouts"
                  className="hover:text-[#1E293B] transition-colors py-1.5 inline-block min-h-[36px]"
                >
                  Algorithmic Workouts
                </Link>
              </li>
              <li>
                <Link
                  href="/structured-workouts"
                  className="hover:text-[#1E293B] transition-colors py-1.5 inline-block min-h-[36px]"
                >
                  Structured 4-Language Track
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="font-heading font-black text-xs uppercase tracking-wider text-[#1E293B]">
              Open Source
            </span>
            <ul className="space-y-2 text-xs font-heading font-bold text-[#64748B]">
              <li>
                <a
                  href="https://github.com/Ashwinnethan64-maker/Dojo-Ai-Tutor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#1E293B] transition-colors py-1.5 min-h-[36px]"
                >
                  <GitHubIcon className="h-4 w-4" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/ashwin-nethan-a59259366/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#0077B5] transition-colors py-1.5 min-h-[36px]"
                >
                  <LinkedInIcon className="h-4 w-4 text-[#0077B5]" />
                  <span>LinkedIn Profile</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[#1E293B]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-heading font-bold text-[#64748B]">
          <span>© 2026 DOJO AI • Built with discipline by Ashwin Nethan</span>
          <span className="text-[#7C3AED]">Discipline + Playfulness + Mastery</span>
        </div>
      </footer>
    </div>
  );
}
