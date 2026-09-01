import { NextResponse } from "next/server";
import { getCurriculumForLanguage } from "@/data/curriculum-registry";
import { SupportedLanguageId } from "@/contexts/language-context";

export interface SearchResultItem {
  id: string;
  category: "workout" | "curriculum" | "concept" | "mistake";
  title: string;
  subtitle: string;
  href: string;
  language: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim().toLowerCase();
    const languageId = (searchParams.get("lang") || "python") as SupportedLanguageId;

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const topics = getCurriculumForLanguage(languageId);
    const results: SearchResultItem[] = [];

    // 1. Search Workouts in active language
    for (const topic of topics) {
      for (const workout of topic.workouts) {
        if (
          workout.title.toLowerCase().includes(query) ||
          workout.description.toLowerCase().includes(query) ||
          workout.concepts.some((c) => c.toLowerCase().includes(query))
        ) {
          results.push({
            id: `wkt-${workout.slug}`,
            category: "workout",
            title: workout.title,
            subtitle: `${topic.title} • ${workout.difficulty.toUpperCase()}`,
            href: `/workouts/${workout.slug}`,
            language: languageId,
          });
        }
      }
    }

    // 2. Search Curriculum Modules in active language
    for (const topic of topics) {
      if (
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.learningObjective.toLowerCase().includes(query)
      ) {
        results.push({
          id: `curr-${topic.slug}`,
          category: "curriculum",
          title: topic.title,
          subtitle: topic.description,
          href: `/learn`,
          language: languageId,
        });
      }
    }

    // 3. Search Concepts
    const foundConcepts = new Set<string>();
    for (const topic of topics) {
      for (const workout of topic.workouts) {
        for (const concept of workout.concepts) {
          if (concept.toLowerCase().includes(query) && !foundConcepts.has(concept)) {
            foundConcepts.add(concept);
            results.push({
              id: `concept-${concept}`,
              category: "concept",
              title: concept,
              subtitle: `Concept tested in ${workout.title}`,
              href: `/workouts/${workout.slug}`,
              language: languageId,
            });
          }
        }
      }
    }

    // 4. Search Common Mistakes
    for (const topic of topics) {
      for (const mistake of topic.commonMistakes) {
        if (mistake.toLowerCase().includes(query)) {
          results.push({
            id: `mistake-${topic.slug}-${mistake.slice(0, 10)}`,
            category: "mistake",
            title: mistake,
            subtitle: `Trap in ${topic.title}`,
            href: `/mistakes`,
            language: languageId,
          });
        }
      }
    }

    return NextResponse.json({ results: results.slice(0, 8) });
  } catch (error: any) {
    console.error("Search API exception:", error);
    return NextResponse.json({ error: "Failed to execute search query" }, { status: 500 });
  }
}
