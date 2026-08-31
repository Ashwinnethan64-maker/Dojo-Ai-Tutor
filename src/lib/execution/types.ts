import { z } from "zod";

export const ExecuteRequestSchema = z.object({
  workoutId: z.string().optional(),
  languageId: z.string().default("python"),
  sourceCode: z
    .string()
    .min(1, "Source code cannot be empty")
    .max(64000, "Source code exceeds maximum size limit (64 KB)"),
  stdin: z.string().max(16000, "Stdin exceeds limit").optional().default(""),
});

export type ExecuteRequest = z.infer<typeof ExecuteRequestSchema>;

export type ExecutionResultStatus =
  | "Queued"
  | "Processing"
  | "Accepted"
  | "Wrong Answer"
  | "Compilation Error"
  | "Runtime Error"
  | "Time Limit"
  | "Memory Limit"
  | "System Error";

export interface ExecutionResultResponse {
  id: string;
  status: ExecutionResultStatus;
  passedTests: number;
  totalTests: number;
  stdout: string;
  stderr: string;
  compileOutput: string | null;
  executionTimeMs: number;
  memoryKb: number;
  testResults?: {
    testIndex: number;
    stdin: string;
    expectedOutput: string;
    actualOutput?: string;
    passed: boolean;
    isHidden: boolean;
    errorMessage?: string;
  }[];
}

// In-memory rate limiter per IP / user
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit = 15, windowSeconds = 60): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
}
