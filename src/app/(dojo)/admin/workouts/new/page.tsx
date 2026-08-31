"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Terminal,
  Layers,
  HelpCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminNewWorkoutPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    topicId: "loops",
    difficulty: "easy" as const,
    learningObjective: "",
    description: "",
    instructions: "Implement the required function to satisfy the problem objective.",
    concepts: "Loops, Range, Iterations",
    starterCode: "def solve(numbers):\n    # Write your solution here\n    pass\n",
    solutionCode: "def solve(numbers):\n    return [n * 2 for n in numbers]\n",
    hints: [
      "Consider using a for loop or list comprehension.",
      "Multiply each element by 2 before returning.",
    ],
    visibleTestCases: [
      { stdin: "solve([1, 2, 3])", expectedOutput: "[2, 4, 6]" },
    ],
    hiddenTestCases: [
      { stdin: "solve([])", expectedOutput: "[]" },
    ],
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.starterCode || !formData.solutionCode) {
      alert("Please complete all required fields.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workout: {
            ...formData,
            languageId: "python",
            concepts: formData.concepts.split(",").map((c) => c.trim()),
            isPublished: true,
            isAiGenerated: false,
            approvalStatus: "approved",
          },
        }),
      });

      if (res.ok) {
        router.push("/admin");
      }
    } catch (err) {
      console.error(err);
      alert("Failed saving workout");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-16 max-w-5xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Admin Portal</span>
        </Link>

        <Button type="submit" isLoading={isSaving} className="gap-1.5 shadow-sm">
          <Save className="h-4 w-4" />
          <span>Publish Workout</span>
        </Button>
      </div>

      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] space-y-1">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Create New Coding Workout
        </h1>
        <p className="text-xs text-zinc-500">
          Author a new structured workout with canonical solution and multi-tier test cases.
        </p>
      </div>

      {/* Basic Metadata */}
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          1. Basic Information &amp; Taxonomy
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Workout Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Double All Positive Elements"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              URL Slug *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. double-positive-elements"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Curriculum Topic
            </label>
            <select
              value={formData.topicId}
              onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs"
            >
              <option value="intro">Introduction</option>
              <option value="variables">Variables &amp; Types</option>
              <option value="conditionals">Conditionals</option>
              <option value="loops">Loops &amp; Iteration</option>
              <option value="functions">Functions &amp; Scope</option>
              <option value="lists">Lists &amp; Sequences</option>
              <option value="dictionaries">Dictionaries</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Difficulty Tier
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
              className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs"
            >
              <option value="intro">Introductory</option>
              <option value="easy">Easy (White/Yellow Belt)</option>
              <option value="medium">Medium (Orange/Green Belt)</option>
              <option value="hard">Hard (Blue/Purple Belt)</option>
              <option value="master">Master (Brown/Black Belt)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Learning Objective *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Master list comprehension iteration with condition filters"
            value={formData.learningObjective}
            onChange={(e) => setFormData({ ...formData, learningObjective: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Problem Description (Markdown) *
          </label>
          <textarea
            rows={3}
            required
            placeholder="Write clear instructions, input constraints, and return specs..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs"
          />
        </div>
      </Card>

      {/* Code Stubs & Canonical Solution */}
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          2. Code Stubs &amp; Canonical Solution
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Starter Code (Student Template) *
            </label>
            <textarea
              rows={5}
              required
              value={formData.starterCode}
              onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
              className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-[#16161a] text-zinc-100 font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Canonical Solution Code *
            </label>
            <textarea
              rows={5}
              required
              value={formData.solutionCode}
              onChange={(e) => setFormData({ ...formData, solutionCode: e.target.value })}
              className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-[#16161a] text-emerald-300 font-mono text-xs"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSaving} size="lg" className="gap-2 shadow-md">
          <Save className="h-4 w-4" />
          <span>Publish Workout</span>
        </Button>
      </div>
    </form>
  );
}
