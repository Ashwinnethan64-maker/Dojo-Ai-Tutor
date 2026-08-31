"use client";

import React from "react";
import { Calendar, Code2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BeltBadge } from "@/components/dojo/belt";

export default function ProfilePage() {
  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Profile Header Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md shrink-0">
            A
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  Ashwin
                </h1>
                <p className="text-xs text-zinc-500 font-mono">@ashwin_coder</p>
              </div>
              <BeltBadge belt="yellow" size="md" />
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Passionate software practitioner working through Python foundations and algorithm reasoning in DOJO AI.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                Joined August 2026
              </span>
              <span className="flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-indigo-500" />
                Primary Track: Python
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Belts Earned & Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dojo Belts &amp; Ranks</CardTitle>
          <CardDescription className="text-xs">
            Authentic progression tiers validated through demonstrated problem solving
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-center space-y-1">
              <BeltBadge belt="white" size="sm" showIcon={false} />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Achieved</p>
            </div>
            <div className="p-3 rounded-xl border border-indigo-500/50 bg-indigo-50/20 dark:bg-indigo-950/20 text-center space-y-1">
              <BeltBadge belt="yellow" size="sm" showIcon={false} />
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Current Rank</p>
            </div>
            <div className="p-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 opacity-50 text-center space-y-1">
              <BeltBadge belt="orange" size="sm" showIcon={false} />
              <p className="text-[11px] text-zinc-400">Locked (74%)</p>
            </div>
            <div className="p-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 opacity-40 text-center space-y-1">
              <BeltBadge belt="green" size="sm" showIcon={false} />
              <p className="text-[11px] text-zinc-400">Locked</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
