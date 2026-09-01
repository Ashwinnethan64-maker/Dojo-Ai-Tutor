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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BeltBadge } from "@/components/dojo/belt";
import { GeometricDecoration } from "@/components/dojo/geometric-decoration";
import { DojoLogo } from "@/components/dojo/logo";

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
            <span className="text-xs font-mono font-bold text-[#64748B]">Python 3 • TypeScript • C++</span>
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
      </main>

      {/* 4. Footer */}
      <footer className="border-t-2 border-[#1E293B] bg-white py-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-heading font-bold text-[#64748B]">
          <div className="flex items-center gap-2">
            <span>© 2026 DOJO AI</span>
            <span>•</span>
            <span>Discipline + Playfulness + Mastery</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/learn/python" className="hover:text-[#1E293B]">Curriculum</Link>
            <Link href="/workouts" className="hover:text-[#1E293B]">Workouts</Link>
            <Link href="/login" className="hover:text-[#1E293B]">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
