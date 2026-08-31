import { z } from "zod";

export const GeneratedWorkoutRequestSchema = z.object({
  languageId: z.string().default("python"),
  targetWeakness: z.string(),
  conceptSlug: z.string(),
  difficulty: z.enum(["intro", "easy", "medium", "hard", "master"]).default("easy"),
  userMasteryScore: z.number().min(0).max(100).default(50),
  recentMistakeTitles: z.array(z.string()).optional().default([]),
});

export type GeneratedWorkoutRequest = z.infer<typeof GeneratedWorkoutRequestSchema>;

export const GeneratedWorkoutSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  learningObjective: z.string().min(10),
  concepts: z.array(z.string()).min(1),
  difficulty: z.enum(["intro", "easy", "medium", "hard", "master"]),
  starterCode: z.string().min(10),
  solutionCode: z.string().min(10),
  hints: z.array(z.string()).min(2),
  visibleTestCases: z
    .array(
      z.object({
        stdin: z.string(),
        expectedOutput: z.string(),
      })
    )
    .min(1),
  hiddenTestCases: z
    .array(
      z.object({
        stdin: z.string(),
        expectedOutput: z.string(),
      })
    )
    .min(1),
  requiresAdminApproval: z.boolean().default(false),
});

export type GeneratedWorkout = z.infer<typeof GeneratedWorkoutSchema>;
