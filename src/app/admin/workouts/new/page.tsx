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
      } else {
        alert("Failed to create workout.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving workout.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button size="sm" variant="secondary" className="px-2.5">
              <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-black text-[#1E293B]">
              Create New Workout
            </h1>
            <p className="text-xs text-[#64748B] font-medium">
              Author and configure manual or AI-seeded coding challenges
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Metadata */}
        <Card shadowVariant="hard" className="p-6 bg-white space-y-4">
          <h3 className="font-heading font-bold text-sm text-[#1E293B] border-b pb-2">
            1. Core Workout Metadata
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-heading font-bold text-[#1E293B]">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Double the Elements"
                className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] text-xs font-medium focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-heading font-bold text-[#1E293B]">Slug (URL Identifier)</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. double-elements"
                className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] text-xs font-medium focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-heading font-bold text-[#1E293B]">Topic ID</label>
              <input
                type="text"
                required
                value={formData.topicId}
                onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] text-xs font-medium focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-heading font-bold text-[#1E293B]">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] text-xs font-heading font-bold focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-heading font-bold text-[#1E293B]">Concepts (Comma separated)</label>
              <input
                type="text"
                value={formData.concepts}
                onChange={(e) => setFormData({ ...formData, concepts: e.target.value })}
                placeholder="Loops, Iterations, Lists"
                className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] text-xs font-medium focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-heading font-bold text-[#1E293B]">Short Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief summary displayed on curriculum cards..."
              className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] text-xs font-medium focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>
        </Card>

        {/* Starter & Canonical Solution Code */}
        <Card shadowVariant="hard" className="p-6 bg-white space-y-4">
          <h3 className="font-heading font-bold text-sm text-[#1E293B] border-b pb-2">
            2. Starter &amp; Solution Code
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-heading font-bold text-[#1E293B]">Starter Code Template</label>
            <textarea
              rows={4}
              required
              value={formData.starterCode}
              onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
              className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] font-mono text-xs focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-heading font-bold text-[#1E293B]">Canonical Solution Code</label>
            <textarea
              rows={4}
              required
              value={formData.solutionCode}
              onChange={(e) => setFormData({ ...formData, solutionCode: e.target.value })}
              className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] font-mono text-xs focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3">
          <Link href="/admin">
            <Button size="md" variant="secondary">
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            size="md"
            variant="primary"
            isLoading={isSaving}
            className="gap-2 shadow-[4px_4px_0_#1E293B]"
          >
            <Save className="h-4 w-4 stroke-[2.5]" />
            <span>Publish Workout</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
