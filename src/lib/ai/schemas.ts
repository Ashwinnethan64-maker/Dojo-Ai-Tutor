import { z } from "zod";

export const HintRequestSchema = z.object({
  languageId: z.string().default("python"),
  workoutId: z.string(),
  workoutTitle: z.string(),
  learningObjective: z.string(),
  currentCode: z.string(),
  executionResult: z
    .object({
      status: z.string(),
      stdout: z.string().optional(),
      stderr: z.string().optional(),
      passedTests: z.number().optional(),
      totalTests: z.number().optional(),
    })
    .optional(),
  currentHintLevel: z.number().min(1).max(5).default(1),
  previousHints: z.array(z.string()).optional().default([]),
  knownWeaknesses: z.array(z.string()).optional().default([]),
});

export type HintRequest = z.infer<typeof HintRequestSchema>;

export const HintResponseSchema = z.object({
  hintLevel: z.number().min(1).max(5),
  message: z.string(),
  concept: z.string(),
  shouldRevealSolution: z.boolean(),
  followUpPrompt: z.string().optional(),
});

export type HintResponse = z.infer<typeof HintResponseSchema>;

export const MistakeAnalysisSchema = z.object({
  category: z.string(),
  conceptSlug: z.string(),
  title: z.string(),
  explanation: z.string(),
  rootCause: z.string(),
  severity: z.number().min(1).max(5),
  confidence: z.number().min(0).max(1),
  shouldGenerateFlashcard: z.boolean(),
  recommendedFollowup: z.string(),
});

export type MistakeAnalysis = z.infer<typeof MistakeAnalysisSchema>;

export const FlashcardGenerationSchema = z.object({
  frontQuestion: z.string(),
  backAnswer: z.string(),
  explanation: z.string(),
  conceptSlug: z.string(),
  codeContext: z.string().optional(),
});

export type FlashcardGeneration = z.infer<typeof FlashcardGenerationSchema>;
