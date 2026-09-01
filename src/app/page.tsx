"use client";

import React from "react";
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
  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#1E293B] flex flex-col justify-between selection:bg-[#FBBF24] selection:text-[#1E293B]">
      {/* 1. Header Navigation */}
      <header className="h-20 border-b-2 border-[#1E293B] bg-white px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="group flex items-center">
          <DojoLogo size="lg" priority />
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm" className="shadow-[4px_4px_0_#1E293B]">
              Enter the Dojo &rarr;
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-20 space-y-16">
        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          {/* Playful Floating Geometric Accents */}
          <div className="absolute -top-10 left-0 hidden md:block">
            <GeometricDecoration variant="star" color="yellow" size="lg" rotation={15} />
          </div>
          <div className="absolute top-4 right-0 hidden md:block">
            <GeometricDecoration variant="blob" color="pink" size="lg" />
          </div>

          <div className="inline-flex items-center gap-2">
            <Badge variant="warning" className="text-xs">
              Adaptive Martial Arts Coding Platform
            </Badge>
            <span className="text-xs font-mono font-bold text-[#64748B]">Python 3 • TypeScript • C++ • Java</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-tight text-[#1E293B] leading-[1.1]">
            Master programming through{" "}
            <span className="text-[#8B5CF6] underline decoration-[#FBBF24] decoration-8 underline-offset-4">
              discipline, mistakes,
            </span>{" "}
            and adaptive practice.
          </h1>

          <p className="text-base sm:text-lg text-[#64748B] font-medium max-w-2xl mx-auto leading-relaxed">
            DOJO AI doesn&apos;t give you the answers. It remembers your conceptual slips, schedules active-recall flashcards with FSRS, and guides you to true algorithmic mastery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" variant="primary" className="text-base py-4 px-8 shadow-[6px_6px_0_#1E293B] gap-2">
                <Play className="h-5 w-5 fill-current" />
                <span>Launch Training Floor</span>
              </Button>
            </Link>
            <Link href="/learn/python">
              <Button size="lg" variant="secondary" className="text-base py-4 px-8 shadow-[4px_4px_0_#1E293B]">
                Browse Curriculum &rarr;
              </Button>
            </Link>
          </div>
        </div>

        {/* 3. Core Pedagogical Loop Card Matrix */}
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
            <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center text-white shadow-[3px_3px_0_#1E293B]">
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

        {/* 4. Developer / Open Source Project Showcase Section */}
        <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white shadow-[8px_8px_0_#1E293B] flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#8B5CF6]/10 text-[#8B5CF6] font-mono text-[11px] font-bold border border-[#8B5CF6]">
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
                className="w-full sm:w-auto gap-2 text-xs font-bold shadow-[4px_4px_0_#1E293B] focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
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
                className="w-full sm:w-auto gap-2 text-xs font-bold shadow-[3px_3px_0_#1E293B] focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
              >
                <LinkedInIcon className="h-4 w-4 text-[#0077B5]" />
                <span>Connect on LinkedIn</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </Button>
            </a>
          </div>
        </div>
      </main>

      {/* 5. Polished Footer */}
      <footer className="border-t-2 border-[#1E293B] bg-white py-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-heading font-bold text-[#64748B]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <span>© 2026 DOJO AI</span>
            <span className="hidden sm:inline">•</span>
            <span>Built by Ashwin Nethan</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-[#8B5CF6]">Discipline + Playfulness + Mastery</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/learn/python" className="hover:text-[#1E293B] transition-colors">
              Curriculum
            </Link>
            <Link href="/workouts" className="hover:text-[#1E293B] transition-colors">
              Workouts
            </Link>
            <Link href="/structured-workouts" className="hover:text-[#1E293B] transition-colors">
              Structured Track
            </Link>
            <a
              href="https://github.com/Ashwinnethan64-maker/Dojo-Ai-Tutor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#1E293B] transition-colors"
              aria-label="GitHub Repository"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/ashwin-nethan-a59259366/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#0077B5] transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedInIcon className="h-3.5 w-3.5 text-[#0077B5]" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
