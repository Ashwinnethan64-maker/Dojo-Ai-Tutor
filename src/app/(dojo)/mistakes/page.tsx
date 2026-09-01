"use client";

import React from "react";
import Link from "next/link";
import {
  Target,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/language-context";

const MISTAKES_LEDGER = [
  {
    id: "1",
    title: "Off-by-One in Iteration Upper Bound",
    category: "off_by_one",
    concept: "Loops & Iterations",
    occurrences: 4,
    lastSeen: "2 hours ago",
    status: "improving",
    mastery: 58,
    severity: 3,
    description: "Indexing upper bound beyond collection bounds, causing an OutOfBounds index error.",
    flashcardCreated: true,
  },
  {
    id: "2",
    title: "Forgot Return Statement (Only Printed)",
    category: "function_error",
    concept: "Functions & Scope",
    occurrences: 3,
    lastSeen: "Yesterday",
    status: "improving",
    mastery: 68,
    severity: 2,
    description: "Printed output directly to stdout rather than returning the computed result from function scope.",
    flashcardCreated: true,
  },
  {
    id: "3",
    title: "Assignment '=' Used in 'if' Condition",
    category: "syntax_error",
    concept: "Conditionals & Logic",
    occurrences: 2,
    lastSeen: "3 days ago",
    status: "resolved",
    mastery: 92,
    severity: 4,
    description: "Used single '=' assignment operator rather than comparison equality operator inside conditional statement.",
    flashcardCreated: true,
  },
  {
    id: "4",
    title: "Variable Hoisting / Uninitialized Reference",
    category: "scope_error",
    concept: "Variables & Scope",
    occurrences: 1,
    lastSeen: "4 days ago",
    status: "needs_work",
    mastery: 35,
    severity: 4,
    description: "Attempted to access identifier before declaration within block scope.",
    flashcardCreated: true,
  },
];

export default function MistakesPage() {
  const { activeLanguage } = useLanguage();

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="warning">{activeLanguage.shortName.toUpperCase()} MEMORY</Badge>
            <span className="text-xs text-[#64748B] font-mono font-bold">
              4 Patterns Fingerprinted
            </span>
          </div>
          <h1 className="font-heading text-3xl font-black text-[#1E293B]">
            {activeLanguage.shortName} Mistake Memory &amp; Cognitive Traps
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl font-medium">
            DOJO automatically fingerprints your unique {activeLanguage.name} coding mistakes and converts recurring slips into targeted learning flashcards and challenges.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card shadowVariant="hard" className="p-5 bg-white">
          <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">Active Weak Spots</span>
          <p className="font-heading text-3xl font-black text-[#1E293B] mt-1">
            2 Areas
          </p>
          <p className="text-[11px] text-[#64748B] mt-1 font-medium">Occurred &gt; 2 times recently</p>
        </Card>
        <Card shadowVariant="yellow" className="p-5 bg-[#FFFDF5]">
          <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">Improving Trends</span>
          <p className="font-heading text-3xl font-black text-[#8B5CF6] mt-1">
            2 Patterns
          </p>
          <p className="text-[11px] text-[#64748B] mt-1 font-medium">Reduced frequency over 30 days</p>
        </Card>
        <Card shadowVariant="mint" className="p-5 bg-white">
          <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">Resolved Traps</span>
          <p className="font-heading text-3xl font-black text-[#059669] mt-1">
            1 Trap
          </p>
          <p className="text-[11px] text-[#64748B] mt-1 font-medium">&gt; 90% mastery achieved</p>
        </Card>
      </div>

      {/* Mistake Ledger List */}
      <div className="space-y-4">
        <h2 className="font-heading text-xl font-black text-[#1E293B]">
          Fingerprinted Mistake Patterns
        </h2>

        <div className="space-y-4">
          {MISTAKES_LEDGER.map((mistake) => (
            <Card key={mistake.id} hoverable shadowVariant="hard" className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={mistake.status === "resolved" ? "success" : "warning"} className="text-[10px]">
                      {mistake.status.replace("_", " ")}
                    </Badge>
                    <Badge variant="purple" className="text-[10px]">
                      {mistake.category}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-[#64748B]">
                      {mistake.concept} • Seen {mistake.occurrences}x ({mistake.lastSeen})
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-[#1E293B]">
                    {mistake.title}
                  </h3>

                  <p className="text-xs text-[#64748B] leading-relaxed max-w-3xl font-medium">
                    {mistake.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <Link href={`/mistakes/${mistake.id}`}>
                    <Button size="sm" variant="secondary" className="text-xs">
                      View Occurrences ({mistake.occurrences})
                    </Button>
                  </Link>
                  <Link href="/workouts/even-index-filter">
                    <Button size="sm" variant="primary" className="text-xs gap-1">
                      <Target className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Target Challenge</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
