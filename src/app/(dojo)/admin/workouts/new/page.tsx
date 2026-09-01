"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <form onSubmit={handleSave} className="space-y-6 pb-16 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-heading font-bold text-[#1E293B] hover:text-[#8B5CF6]"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          <span>Back to Admin Portal</span>
        </Link>

        <Button type="submit" variant="primary" isLoading={isSaving} className="gap-2 shadow-[4px_4px_0_#1E293B]">
          <Save className="h-4 w-4 stroke-[2.5]" />
          <span>Publish Workout</span>
        </Button>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white shadow-[8px_8px_0_#1E293B] space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
          Create New Coding Workout
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] font-medium">
          Author a new structured workout with canonical solution and multi-tier test cases.
        </p>
      </div>

      {/* Basic Metadata */}
      <Card shadowVariant="hard" className="p-6 space-y-4 bg-white">
        <h2 className="font-heading text-base font-bold text-[#1E293B]">
          1. Basic Information &amp; Taxonomy
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-heading text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              Workout Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Double All Positive Elements"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] text-xs font-medium text-[#1E293B] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-heading text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              URL Slug *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. double-positive-elements"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] text-xs font-mono font-medium text-[#1E293B] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-heading text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              Curriculum Topic
            </label>
            <select
              value={formData.topicId}
              onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] text-xs font-bold text-[#1E293B] focus:outline-none"
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
            <label className="font-heading text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              Difficulty Tier
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] text-xs font-bold text-[#1E293B] focus:outline-none"
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
          <label className="font-heading text-xs font-bold uppercase tracking-wider text-[#1E293B]">
            Learning Objective *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Master list comprehension iteration with condition filters"
            value={formData.learningObjective}
            onChange={(e) => setFormData({ ...formData, learningObjective: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] text-xs font-medium text-[#1E293B] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-heading text-xs font-bold uppercase tracking-wider text-[#1E293B]">
            Problem Description (Markdown) *
          </label>
          <textarea
            rows={3}
            required
            placeholder="Write clear instructions, input constraints, and return specs..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] text-xs font-medium text-[#1E293B] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>
      </Card>

      {/* Code Stubs & Canonical Solution */}
      <Card shadowVariant="hard" className="p-6 space-y-4 bg-white">
        <h2 className="font-heading text-base font-bold text-[#1E293B]">
          2. Code Stubs &amp; Canonical Solution
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-heading text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              Starter Code (Student Template) *
            </label>
            <textarea
              rows={5}
              required
              value={formData.starterCode}
              onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-[#1E293B] bg-[#1E1E1E] text-white font-mono text-xs focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-heading text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              Canonical Solution Code *
            </label>
            <textarea
              rows={5}
              required
              value={formData.solutionCode}
              onChange={(e) => setFormData({ ...formData, solutionCode: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-[#1E293B] bg-[#1E1E1E] text-[#34D399] font-mono text-xs focus:outline-none"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" isLoading={isSaving} size="lg" className="gap-2 shadow-[6px_6px_0_#1E293B]">
          <Save className="h-4 w-4 stroke-[2.5]" />
          <span>Publish Workout</span>
        </Button>
      </div>
    </form>
  );
}
