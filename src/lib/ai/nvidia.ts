import { OpenAI } from "openai";

/**
 * Server-side NVIDIA DeepSeek AI Client Provider
 * Connects to NVIDIA's OpenAI-compatible endpoint: https://integrate.api.nvidia.com/v1
 * Models:
 *  - Fast Model (Low Latency / Hints / Streaming): deepseek-ai/deepseek-v4-pro-0813
 *  - Reasoning Model (Deep Conceptual Analysis): deepseek-ai/deepseek-v4-pro-0813
 */
export function getNvidiaClient(): OpenAI | null {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey || apiKey === "your-nvidia-api-key") {
    return null;
  }

  const baseURL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";

  return new OpenAI({
    apiKey,
    baseURL,
    timeout: 10000, // 10s maximum timeout
  });
}

export function getNvidiaModel(): string {
  return process.env.NVIDIA_MODEL || "deepseek-ai/deepseek-v4-pro-0813";
}

export function getFastModel(): string {
  return process.env.AI_FAST_MODEL || process.env.NVIDIA_MODEL || "deepseek-ai/deepseek-v4-pro-0813";
}

export function getReasoningModel(): string {
  return process.env.AI_REASONING_MODEL || process.env.NVIDIA_MODEL || "deepseek-ai/deepseek-v4-pro-0813";
}
