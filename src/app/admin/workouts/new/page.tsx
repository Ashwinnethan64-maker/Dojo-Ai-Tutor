"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PRESET_TOPICS = [
  { id: "introduction", label: "Introduction & Fundamentals" },
  { id: "variables", label: "Variables & Data Types" },
  { id: "conditionals", label: "Conditionals & Logic (if/else)" },
  { id: "loops", label: "Loops & Iterations (for/while)" },
  { id: "functions", label: "Functions & Scope" },
  { id: "lists", label: "Lists, Arrays & Sequences" },
  { id: "dictionaries", label: "Dictionaries & Hash Maps" },
  { id: "strings", label: "String Manipulation" },
  { id: "recursion", label: "Recursion & Call Stacks" },
  { id: "classes", label: "Object-Oriented Programming" },
];

const PRESET_CONCEPTS = [
  "Loops",
  "Range",
  "Iterations",
  "Conditionals",
  "Functions",
  "Arrays",
  "List Indexing",
  "Vectors",
  "Pointers",
  "Recursion",
  "Strings",
  "Hash Maps",
  "Type Casting",
  "Memory Management",
];

export default function AdminNewWorkoutPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customConceptInput, setCustomConceptInput] = useState("");
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>(["Loops", "Range", "Iterations"]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    topicId: "loops",
    languageId: "python",
    difficulty: "easy" as const,
    learningObjective: "",
    description: "",
    instructions: "Implement the required function to satisfy the problem objective.",
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

  const handleLanguageChange = (lang: string) => {
    let starter = "def solve(numbers):\n    pass\n";
    let solution = "def solve(numbers):\n    return [n * 2 for n in numbers]\n";
    let visibleTc = [{ stdin: "solve([1, 2, 3])", expectedOutput: "[2, 4, 6]" }];
    let hiddenTc = [{ stdin: "solve([])", expectedOutput: "[]" }];

    if (lang === "javascript") {
      starter = "function solve(numbers) {\n  // Return doubled numbers\n  return [];\n}\n";
      solution = "function solve(numbers) {\n  return numbers.map(n => n * 2);\n}\n";
      visibleTc = [{ stdin: "solve([1, 2, 3])", expectedOutput: "[2, 4, 6]" }];
      hiddenTc = [{ stdin: "solve([])", expectedOutput: "[]" }];
    } else if (lang === "typescript") {
      starter = "function solve(numbers: number[]): number[] {\n  return [];\n}\n";
      solution = "function solve(numbers: number[]): number[] {\n  return numbers.map(n => n * 2);\n}\n";
    } else if (lang === "cpp") {
      starter = "#include <vector>\n\nstd::vector<int> solve(const std::vector<int>& numbers) {\n    std::vector<int> res;\n    return res;\n}\n";
      solution = "#include <vector>\n\nstd::vector<int> solve(const std::vector<int>& numbers) {\n    std::vector<int> res;\n    for (int n : numbers) res.push_back(n * 2);\n    return res;\n}\n";
      visibleTc = [{ stdin: "solve({1, 2, 3})", expectedOutput: "{2, 4, 6}" }];
      hiddenTc = [{ stdin: "solve({})", expectedOutput: "{}" }];
    } else if (lang === "java") {
      starter = "import java.util.*;\n\npublic class Solution {\n    public static int[] solve(int[] numbers) {\n        return new int[0];\n    }\n}\n";
      solution = "import java.util.*;\n\npublic class Solution {\n    public static int[] solve(int[] numbers) {\n        int[] res = new int[numbers.length];\n        for (int i = 0; i < numbers.length; i++) res[i] = numbers[i] * 2;\n        return res;\n    }\n}\n";
      visibleTc = [{ stdin: "solve(new int[]{1, 2, 3})", expectedOutput: "[2, 4, 6]" }];
      hiddenTc = [{ stdin: "solve(new int[]{})", expectedOutput: "[]" }];
    }

    setFormData((prev) => ({
      ...prev,
      languageId: lang,
      starterCode: starter,
      solutionCode: solution,
      visibleTestCases: visibleTc,
      hiddenTestCases: hiddenTc,
    }));
  };

  const handleToggleConcept = (c: string) => {
    if (selectedConcepts.includes(c)) {
      setSelectedConcepts(selectedConcepts.filter((item) => item !== c));
    } else {
      setSelectedConcepts([...selectedConcepts, c]);
    }
  };

  const handleAddCustomConcept = () => {
    const trimmed = customConceptInput.trim();
    if (trimmed && !selectedConcepts.includes(trimmed)) {
      setSelectedConcepts([...selectedConcepts, trimmed]);
      setCustomConceptInput("");
    }
  };

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
            concepts: selectedConcepts,
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
                onChange={(e) => {
                  const titleVal = e.target.value;
                  const autoSlug = titleVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  setFormData({ ...formData, title: titleVal, slug: autoSlug });
                }}
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-heading font-bold text-[#1E293B]">Topic ID</label>
                <button
                  type="button"
                  onClick={() => setIsCustomTopic(!isCustomTopic)}
                  className="text-[10px] text-[#8B5CF6] font-heading font-bold hover:underline"
                >
                  {isCustomTopic ? "Select from list" : "+ Custom topic"}
                </button>
              </div>

              {isCustomTopic ? (
                <input
                  type="text"
                  required
                  value={formData.topicId}
                  onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                  placeholder="e.g. dynamic-programming"
                  className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] text-xs font-medium focus:outline-none focus:border-[#8B5CF6]"
                />
              ) : (
                <select
                  value={formData.topicId}
                  onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] text-xs font-medium bg-white focus:outline-none focus:border-[#8B5CF6]"
                >
                  {PRESET_TOPICS.map((t) => (
                    <option key={t.id} value={t.id}>{t.label} ({t.id})</option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-heading font-bold text-[#1E293B]">Target Language</label>
              <select
                value={formData.languageId}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] text-xs font-medium bg-white focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="python">Python 3.12</option>
                <option value="javascript">JavaScript (Node 20)</option>
                <option value="typescript">TypeScript 5.4</option>
                <option value="cpp">C++ (GCC 13)</option>
                <option value="java">Java (OpenJDK 21)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-heading font-bold text-[#1E293B]">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] text-xs font-medium bg-white focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="intro">Introductory (White Belt)</option>
                <option value="easy">Easy (Yellow Belt)</option>
                <option value="medium">Medium (Orange Belt)</option>
                <option value="hard">Hard (Green Belt+)</option>
              </select>
            </div>
          </div>

          {/* Concepts Selector */}
          <div className="space-y-2 pt-2 border-t">
            <label className="text-xs font-heading font-bold text-[#1E293B]">Concepts &amp; Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_CONCEPTS.map((c) => {
                const isSelected = selectedConcepts.includes(c);
                return (
                  <Badge
                    key={c}
                    variant={isSelected ? "purple" : "secondary"}
                    onClick={() => handleToggleConcept(c)}
                    className="cursor-pointer text-xs select-none hover:opacity-80"
                  >
                    {isSelected ? `✓ ${c}` : `+ ${c}`}
                  </Badge>
                );
              })}
            </div>

            {/* Custom Concept Input */}
            <div className="flex items-center gap-2 pt-1 max-w-sm">
              <input
                type="text"
                value={customConceptInput}
                onChange={(e) => setCustomConceptInput(e.target.value)}
                placeholder="Add custom concept..."
                className="flex-1 p-2 rounded-xl border border-[#1E293B] text-xs focus:outline-none focus:border-[#8B5CF6]"
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleAddCustomConcept}
                className="text-xs"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-heading font-bold text-[#1E293B]">Learning Objective</label>
            <input
              type="text"
              required
              value={formData.learningObjective}
              onChange={(e) => setFormData({ ...formData, learningObjective: e.target.value })}
              placeholder="e.g. Master list iteration and avoid off-by-one errors"
              className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] text-xs font-medium focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-heading font-bold text-[#1E293B]">Description &amp; Problem Statement</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of problem requirements and constraints..."
              className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] text-xs font-medium focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>
        </Card>

        {/* Code Templates */}
        <Card shadowVariant="hard" className="p-6 bg-white space-y-4">
          <h3 className="font-heading font-bold text-sm text-[#1E293B] border-b pb-2">
            2. Code Stubs &amp; Canonical Solution ({formData.languageId.toUpperCase()})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-heading font-bold text-[#1E293B]">Starter Code Template</label>
              <textarea
                rows={7}
                required
                value={formData.starterCode}
                onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-[#1E293B] bg-[#1E1E1E] text-[#4ADE80] font-mono text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-heading font-bold text-[#1E293B]">Canonical Solution Code</label>
              <textarea
                rows={7}
                required
                value={formData.solutionCode}
                onChange={(e) => setFormData({ ...formData, solutionCode: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-[#1E293B] bg-[#1E1E1E] text-[#4ADE80] font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin">
            <Button size="sm" variant="secondary">
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            size="sm"
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
