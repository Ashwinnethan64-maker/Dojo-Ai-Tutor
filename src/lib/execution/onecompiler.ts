/**
 * OneCompiler API Service Client
 * Endpoint: POST https://api.onecompiler.com/v1/run
 * Auth: X-API-Key: process.env.ONECOMPILER_API_KEY
 */

export interface OneCompilerFile {
  name: string;
  content: string;
}

export interface OneCompilerRunRequest {
  language: string;
  stdin?: string;
  files: OneCompilerFile[];
}

export interface OneCompilerRunResponse {
  status: "success" | "failed" | string;
  exception?: string | null;
  stdout?: string | null;
  stderr?: string | null;
  executionTime?: number | null;
  limitRemaining?: number | null;
}

// Map Dojo AI language identifiers to OneCompiler language slugs and filenames
export const ONECOMPILER_LANGUAGE_CONFIG: Record<
  string,
  { language: string; filename: string }
> = {
  python: { language: "python", filename: "main.py" },
  python3: { language: "python", filename: "main.py" },
  javascript: { language: "javascript", filename: "index.js" },
  js: { language: "javascript", filename: "index.js" },
  typescript: { language: "typescript", filename: "index.ts" },
  ts: { language: "typescript", filename: "index.ts" },
  cpp: { language: "cpp", filename: "main.cpp" },
  "c++": { language: "cpp", filename: "main.cpp" },
  c: { language: "c", filename: "main.c" },
  java: { language: "java", filename: "Main.java" },
  go: { language: "go", filename: "main.go" },
  rust: { language: "rust", filename: "main.rs" },
};

export class OneCompilerService {
  private static readonly API_URL = "https://api.onecompiler.com/v1/run";
  private static readonly TIMEOUT_MS = 8000;

  /**
   * Executes arbitrary source code via OneCompiler API
   */
  public static async execute(
    sourceCode: string,
    languageId = "python",
    stdin = ""
  ): Promise<OneCompilerRunResponse> {
    const apiKey = process.env.ONECOMPILER_API_KEY;
    if (!apiKey) {
      throw new Error("ONECOMPILER_API_KEY is not configured.");
    }

    const config =
      ONECOMPILER_LANGUAGE_CONFIG[languageId.toLowerCase()] ||
      ONECOMPILER_LANGUAGE_CONFIG.python;

    const payload: OneCompilerRunRequest = {
      language: config.language,
      stdin: stdin || undefined,
      files: [
        {
          name: config.filename,
          content: sourceCode,
        },
      ],
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `OneCompiler API responded with HTTP ${response.status}: ${errorText}`
        );
      }

      const data = (await response.json()) as OneCompilerRunResponse;
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        return {
          status: "failed",
          exception: "TimeLimitExceeded: Execution timed out after 8 seconds.",
          stdout: null,
          stderr: "TimeLimitExceeded: Execution timed out after 8 seconds.\n",
          executionTime: 8000,
        };
      }
      throw error;
    }
  }
}
