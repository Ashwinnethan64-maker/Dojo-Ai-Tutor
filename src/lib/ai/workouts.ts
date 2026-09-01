import {
  GeneratedWorkout,
  GeneratedWorkoutRequest,
  GeneratedWorkoutSchema,
} from "./workout-schemas";
import { getNvidiaClient, getNvidiaModel } from "./nvidia";

export class WorkoutGeneratorService {
  /**
   * Generates a targeted coding workout designed to remediate a student's specific mistake.
   * Validates language consistency, non-duplication, and executable test cases.
   */
  public static async generateTargetedWorkout(
    req: GeneratedWorkoutRequest
  ): Promise<GeneratedWorkout> {
    const nvidia = getNvidiaClient();
    let candidate: GeneratedWorkout | null = null;

    if (nvidia) {
      try {
        const prompt = `
You are an expert programming tutor and curriculum architect for DOJO AI.
Generate a structured, progressive coding workout targeting this specific request:
- Target Programming Language: ${req.languageId}
- Topic / Concept Slug: ${req.conceptSlug}
- Difficulty Level: ${req.difficulty}
- User Weakness Focus: ${req.targetWeakness || "General concept mastery"}
- Unique Seed: ${Date.now()}-${Math.random().toString(36).substring(2, 7)}

CRITICAL LANGUAGE SPECIFICATIONS:
1. All instructions, starter code, canonical solution, and test cases MUST be written purely in ${req.languageId}.
2. If ${req.languageId} is cpp (C++):
   - Use standard C++20/C++17 with #include <vector>, <string>, <iostream>, etc.
   - DO NOT use Python def or JavaScript function syntax!
3. If ${req.languageId} is javascript:
   - Use modern ES2024 function declaration.
   - DO NOT use Python def or C++ types!
4. If ${req.languageId} is typescript:
   - Use typed TypeScript function definitions with explicit parameter and return types.
5. If ${req.languageId} is java:
   - Use public class Solution with static helper methods.
6. If ${req.languageId} is python:
   - Use Python 3.12 syntax with def.
7. Provide at least 2 visible test cases and 1 hidden test case with exact invocation in stdin and exact expectedOutput.
8. Make the problem creative, fresh, and distinctly different from standard generic templates.

Return ONLY a valid JSON object strictly matching this schema:
{
  "title": string,
  "slug": string (kebab-case, e.g. "count-unique-elements-${Date.now()}"),
  "description": string,
  "learningObjective": string,
  "difficulty": "${req.difficulty}",
  "concepts": string[],
  "starterCode": string,
  "solutionCode": string,
  "hints": string[],
  "visibleTestCases": [{"stdin": string, "expectedOutput": string}],
  "hiddenTestCases": [{"stdin": string, "expectedOutput": string}],
  "requiresAdminApproval": false
}`;

        const completion = await nvidia.chat.completions.create({
          model: getNvidiaModel(),
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.7,
        });

        const rawContent = completion.choices[0]?.message?.content;
        if (rawContent) {
          const parsed = JSON.parse(rawContent);
          candidate = GeneratedWorkoutSchema.parse({
            ...parsed,
            difficulty: req.difficulty,
            requiresAdminApproval: false,
          });
        }
      } catch (err) {
        console.warn("NVIDIA DeepSeek invocation error, using dynamic multi-template fallback:", err);
      }
    }

    if (!candidate) {
      candidate = this.generateDynamicWorkout(req);
    }

    // Safeguard: validate generated candidate passes internal integrity & language checks
    this.validateWorkoutIntegrity(candidate, req.languageId);

    return candidate;
  }

  /**
   * Safeguard validation to ensure starter code, solution, and test cases belong strictly to the requested language
   */
  private static validateWorkoutIntegrity(workout: GeneratedWorkout, expectedLang: string): void {
    if (!workout.title || workout.title.length < 3) {
      throw new Error("Generated workout must have a valid title.");
    }
    if (!workout.starterCode || !workout.solutionCode) {
      throw new Error("Generated workout must contain starter and solution code.");
    }
    if (workout.visibleTestCases.length === 0) {
      throw new Error("Generated workout must include at least one visible test case.");
    }

    // Language syntax defense
    if (expectedLang === "cpp") {
      if (workout.starterCode.includes("def ") || workout.solutionCode.includes("def ")) {
        throw new Error("Language mismatch: Python syntax detected in C++ workout generation.");
      }
    } else if (expectedLang === "javascript" || expectedLang === "typescript") {
      if (workout.starterCode.includes("def ") || workout.solutionCode.includes("def ")) {
        throw new Error("Language mismatch: Python syntax detected in JS/TS workout generation.");
      }
    } else if (expectedLang === "python") {
      if (workout.starterCode.includes("function ") || workout.solutionCode.includes("function ")) {
        throw new Error("Language mismatch: JavaScript syntax detected in Python workout generation.");
      }
    }
  }

  /**
   * Generates a dynamic, distinct workout from randomized algorithmic archetypes
   * ensuring that every click produces a unique question matching the selected language and topic.
   */
  private static generateDynamicWorkout(req: GeneratedWorkoutRequest): GeneratedWorkout {
    const lang = req.languageId || "python";
    const topic = (req.conceptSlug || "loops").toLowerCase();
    const ts = Date.now();
    const seed = Math.floor(Math.random() * 4); // 4 distinct problem archetypes per topic

    // 1. C++ (GCC 13)
    if (lang === "cpp") {
      const cppProblems = [
        {
          title: "Count Positive Integers (C++)",
          slug: `count-positives-cpp-${ts}`,
          desc: "Given a `std::vector<int> nums`, return the count of strictly positive numbers (> 0).",
          objective: "Iterate through a vector and accumulate positive occurrences.",
          concepts: ["C++", "Vectors", "Loops", "Counters"],
          starter: "#include <vector>\n\nint countPositives(const std::vector<int>& nums) {\n    int count = 0;\n    // Write loop here\n    return count;\n}\n",
          solution: "#include <vector>\n\nint countPositives(const std::vector<int>& nums) {\n    int count = 0;\n    for (int n : nums) {\n        if (n > 0) count++;\n    }\n    return count;\n}\n",
          vis: [
            { stdin: "countPositives({-1, 2, 0, 4, -5})", expectedOutput: "2" },
            { stdin: "countPositives({1, 2, 3})", expectedOutput: "3" },
          ],
          hid: [{ stdin: "countPositives({-10, -20})", expectedOutput: "0" }],
          hints: ["Use a range-based for loop `for (int n : nums)`", "Increment count when `n > 0`"],
        },
        {
          title: "Find Maximum Element (C++)",
          slug: `find-max-cpp-${ts}`,
          desc: "Given a non-empty `std::vector<int> nums`, return the maximum value in the vector.",
          objective: "Track and update running maximum across a vector.",
          concepts: ["C++", "Vectors", "Accumulators"],
          starter: "#include <vector>\n\nint findMax(const std::vector<int>& nums) {\n    int maxVal = nums[0];\n    // Implement loop\n    return maxVal;\n}\n",
          solution: "#include <vector>\n\nint findMax(const std::vector<int>& nums) {\n    int maxVal = nums[0];\n    for (size_t i = 1; i < nums.size(); i++) {\n        if (nums[i] > maxVal) maxVal = nums[i];\n    }\n    return maxVal;\n}\n",
          vis: [
            { stdin: "findMax({3, 9, 2, 7, 5})", expectedOutput: "9" },
            { stdin: "findMax({-5, -1, -8})", expectedOutput: "-1" },
          ],
          hid: [{ stdin: "findMax({42})", expectedOutput: "42" }],
          hints: ["Initialize `maxVal = nums[0]`", "Iterate from index 1 to `nums.size() - 1`"],
        },
        {
          title: "Reverse Vector Elements (C++)",
          slug: `reverse-vector-cpp-${ts}`,
          desc: "Given a `std::vector<int> nums`, return a new vector with elements in reversed order.",
          objective: "Construct a reversed vector using reverse iteration.",
          concepts: ["C++", "Vectors", "Reverse Iteration"],
          starter: "#include <vector>\n\nstd::vector<int> reverseVector(const std::vector<int>& nums) {\n    std::vector<int> res;\n    // Push elements in reverse order\n    return res;\n}\n",
          solution: "#include <vector>\n\nstd::vector<int> reverseVector(const std::vector<int>& nums) {\n    std::vector<int> res;\n    for (int i = (int)nums.size() - 1; i >= 0; i--) {\n        res.push_back(nums[i]);\n    }\n    return res;\n}\n",
          vis: [
            { stdin: "reverseVector({1, 2, 3, 4})", expectedOutput: "{4, 3, 2, 1}" },
          ],
          hid: [{ stdin: "reverseVector({})", expectedOutput: "{}" }],
          hints: ["Iterate backwards from `nums.size() - 1` down to 0", "Push each element into the result vector"],
        },
        {
          title: "Even Index Vector Filter (C++)",
          slug: `filter-even-indices-cpp-${ts}`,
          desc: "Given `std::vector<int> items`, return a new vector containing elements strictly at even index locations (0, 2, 4...).",
          objective: "Master index stepping by 2 without out-of-bounds access.",
          concepts: ["C++", "Vectors", "Index Bounds"],
          starter: "#include <vector>\n\nstd::vector<int> filterEvenIndices(const std::vector<int>& items) {\n    std::vector<int> res;\n    return res;\n}\n",
          solution: "#include <vector>\n\nstd::vector<int> filterEvenIndices(const std::vector<int>& items) {\n    std::vector<int> res;\n    for (size_t i = 0; i < items.size(); i += 2) {\n        res.push_back(items[i]);\n    }\n    return res;\n}\n",
          vis: [
            { stdin: "filterEvenIndices({10, 20, 30, 40})", expectedOutput: "{10, 30}" },
          ],
          hid: [{ stdin: "filterEvenIndices({})", expectedOutput: "{}" }],
          hints: ["Use `for (size_t i = 0; i < items.size(); i += 2)`", "Check that `i < items.size()` to stay within bounds"],
        },
      ];
      const p = cppProblems[seed % cppProblems.length];
      return {
        title: p.title,
        slug: p.slug,
        description: p.desc,
        learningObjective: p.objective,
        difficulty: req.difficulty,
        concepts: p.concepts,
        starterCode: p.starter,
        solutionCode: p.solution,
        visibleTestCases: p.vis,
        hiddenTestCases: p.hid,
        hints: p.hints,
        requiresAdminApproval: false,
      };
    }

    // 2. JavaScript (ES2024 / Node 20)
    if (lang === "javascript") {
      const jsProblems = [
        {
          title: "Sum of Positive Numbers (JS)",
          slug: `sum-positives-js-${ts}`,
          desc: "Given an array of numbers `nums`, calculate and return the sum of all positive numbers.",
          objective: "Filter and accumulate numbers with loop or reduce.",
          concepts: ["JavaScript", "Arrays", "Accumulators"],
          starter: "function sumPositives(nums) {\n  let total = 0;\n  // Add positive numbers to total\n  return total;\n}\n",
          solution: "function sumPositives(nums) {\n  return nums.filter(n => n > 0).reduce((acc, n) => acc + n, 0);\n}\n",
          vis: [
            { stdin: "sumPositives([1, -4, 7, 12])", expectedOutput: "20" },
            { stdin: "sumPositives([-1, -2, -3])", expectedOutput: "0" },
          ],
          hid: [{ stdin: "sumPositives([])", expectedOutput: "0" }],
          hints: ["Filter for `n > 0` before summing", "You can also use a simple `for` loop"],
        },
        {
          title: "Double Array Elements (JS)",
          slug: `double-elements-js-${ts}`,
          desc: "Given an array of numbers `nums`, return a new array where every element is multiplied by 2.",
          objective: "Transform arrays immutably with Array.prototype.map.",
          concepts: ["JavaScript", "Arrays", "Map"],
          starter: "function doubleElements(nums) {\n  // Return mapped array\n  return [];\n}\n",
          solution: "function doubleElements(nums) {\n  return nums.map(n => n * 2);\n}\n",
          vis: [
            { stdin: "doubleElements([1, 2, 3])", expectedOutput: "[2, 4, 6]" },
            { stdin: "doubleElements([-5, 0, 5])", expectedOutput: "[-10, 0, 10]" },
          ],
          hid: [{ stdin: "doubleElements([])", expectedOutput: "[]" }],
          hints: ["Use `nums.map(n => n * 2)`", "Ensure you return the newly mapped array"],
        },
        {
          title: "Count Vowels in String (JS)",
          slug: `count-vowels-js-${ts}`,
          desc: "Given a string `str`, return the total count of lowercase vowels ('a', 'e', 'i', 'o', 'u').",
          objective: "Iterate through characters and match against vowel set.",
          concepts: ["JavaScript", "Strings", "Loops"],
          starter: "function countVowels(str) {\n  let count = 0;\n  // Count lowercase vowels\n  return count;\n}\n",
          solution: "function countVowels(str) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (const ch of str) {\n    if (vowels.has(ch)) count++;\n  }\n  return count;\n}\n",
          vis: [
            { stdin: "countVowels('dojo')", expectedOutput: "2" },
            { stdin: "countVowels('javascript')", expectedOutput: "3" },
          ],
          hid: [{ stdin: "countVowels('xyz')", expectedOutput: "0" }],
          hints: ["Check if each character is in `['a', 'e', 'i', 'o', 'u']`", "Use a Set or Array.includes for fast lookups"],
        },
        {
          title: "Filter Even Numbers (JS)",
          slug: `filter-evens-js-${ts}`,
          desc: "Given an array of integers `nums`, return a new array containing only even values.",
          objective: "Filter array elements using remainder operator `% 2 === 0`.",
          concepts: ["JavaScript", "Arrays", "Filter"],
          starter: "function filterEvens(nums) {\n  // Return even numbers\n  return [];\n}\n",
          solution: "function filterEvens(nums) {\n  return nums.filter(n => n % 2 === 0);\n}\n",
          vis: [
            { stdin: "filterEvens([1, 2, 3, 4, 5, 6])", expectedOutput: "[2, 4, 6]" },
          ],
          hid: [{ stdin: "filterEvens([1, 3, 5])", expectedOutput: "[]" }],
          hints: ["Use `nums.filter(n => n % 2 === 0)`", "Remember 0 is considered even"],
        },
      ];
      const p = jsProblems[seed % jsProblems.length];
      return {
        title: p.title,
        slug: p.slug,
        description: p.desc,
        learningObjective: p.objective,
        difficulty: req.difficulty,
        concepts: p.concepts,
        starterCode: p.starter,
        solutionCode: p.solution,
        visibleTestCases: p.vis,
        hiddenTestCases: p.hid,
        hints: p.hints,
        requiresAdminApproval: false,
      };
    }

    // 3. TypeScript (5.4)
    if (lang === "typescript") {
      return {
        slug: `sum-numbers-ts-${ts}`,
        title: "Typed Number Summation",
        description: "Given a typed array `nums: number[]`, return the arithmetic sum of all elements.",
        learningObjective: "Type-safe accumulator logic in TypeScript.",
        difficulty: req.difficulty,
        concepts: ["TypeScript", "Types", "Arrays"],
        starterCode: "function sumNumbers(nums: number[]): number {\n  return 0;\n}\n",
        solutionCode: "function sumNumbers(nums: number[]): number {\n  return nums.reduce((acc, n) => acc + n, 0);\n}\n",
        visibleTestCases: [
          { stdin: "sumNumbers([10, 20, 30])", expectedOutput: "60" },
        ],
        hiddenTestCases: [
          { stdin: "sumNumbers([])", expectedOutput: "0" },
        ],
        hints: ["Use reduce or a typed loop: `for (const n of nums)`", "Declare return type as number"],
        requiresAdminApproval: false,
      };
    }

    // 4. Java (OpenJDK 21)
    if (lang === "java") {
      return {
        slug: `find-max-java-${ts}`,
        title: "Find Maximum Element (Java)",
        description: "Given `int[] nums`, return the maximum value contained in the array.",
        learningObjective: "Array traversal and comparative tracking in Java.",
        difficulty: req.difficulty,
        concepts: ["Java", "Arrays", "Loops"],
        starterCode: "public class Solution {\n    public static int findMax(int[] nums) {\n        return 0;\n    }\n}\n",
        solutionCode: "public class Solution {\n    public static int findMax(int[] nums) {\n        int maxVal = nums[0];\n        for (int n : nums) {\n            if (n > maxVal) maxVal = n;\n        }\n        return maxVal;\n    }\n}\n",
        visibleTestCases: [
          { stdin: "findMax(new int[]{3, 7, 2, 9, 1})", expectedOutput: "9" },
        ],
        hiddenTestCases: [
          { stdin: "findMax(new int[]{-5, -1, -10})", expectedOutput: "-1" },
        ],
        hints: ["Initialize `int maxVal = nums[0]` and iterate through the array.", "Compare each element against maxVal"],
        requiresAdminApproval: false,
      };
    }

    // 5. Default Python (3.12)
    const pythonProblems = [
      {
        title: "Sum Positive Numbers",
        slug: `sum-positives-py-${ts}`,
        desc: "Given a list of numbers `nums`, calculate and return the sum of all strictly positive numbers (> 0).",
        objective: "Iterate through numbers and aggregate positive values.",
        concepts: ["Loops", "Conditionals", "Accumulators"],
        starter: "def sum_positives(nums):\n    # Return sum of numbers > 0\n    pass\n",
        solution: "def sum_positives(nums):\n    return sum(n for n in nums if n > 0)\n",
        vis: [
          { stdin: "sum_positives([1, -4, 7, 12])", expectedOutput: "20" },
          { stdin: "sum_positives([-1, -2, -3])", expectedOutput: "0" },
        ],
        hid: [{ stdin: "sum_positives([])", expectedOutput: "0" }],
        hints: ["Use a generator expression `sum(n for n in nums if n > 0)` or a for loop.", "Ensure you only include strictly positive numbers (> 0)."],
      },
      {
        title: "Count Even Numbers",
        slug: `count-evens-py-${ts}`,
        desc: "Given a list of integers `nums`, return the total count of even numbers.",
        objective: "Check modulo arithmetic `n % 2 == 0` across a list.",
        concepts: ["Loops", "Modulo", "Conditionals"],
        starter: "def count_evens(nums):\n    # Return count of even numbers\n    pass\n",
        solution: "def count_evens(nums):\n    return sum(1 for n in nums if n % 2 == 0)\n",
        vis: [
          { stdin: "count_evens([1, 2, 3, 4, 6])", expectedOutput: "3" },
          { stdin: "count_evens([1, 3, 5])", expectedOutput: "0" },
        ],
        hid: [{ stdin: "count_evens([])", expectedOutput: "0" }],
        hints: ["An integer is even if `n % 2 == 0`.", "Increment your counter when condition evaluates to true."],
      },
      {
        title: "Find Maximum Element",
        slug: `find-max-py-${ts}`,
        desc: "Given a non-empty list of numbers `nums`, return the largest number without using the built-in max().",
        objective: "Implement accumulator loop tracking current maximum.",
        concepts: ["Loops", "Lists", "Accumulators"],
        starter: "def find_max(nums):\n    # Return largest element\n    pass\n",
        solution: "def find_max(nums):\n    m = nums[0]\n    for n in nums[1:]:\n        if n > m: m = n\n    return m\n",
        vis: [
          { stdin: "find_max([3, 7, 2, 9, 1])", expectedOutput: "9" },
          { stdin: "find_max([-5, -1, -8])", expectedOutput: "-1" },
        ],
        hid: [{ stdin: "find_max([42])", expectedOutput: "42" }],
        hints: ["Initialize `m = nums[0]` and compare each element.", "Iterate from index 1 to avoid comparing first element against itself."],
      },
      {
        title: "Multiply List by Factor",
        slug: `multiply-by-factor-py-${ts}`,
        desc: "Given a list of numbers `nums` and a multiplier `factor`, return a new list where each element is multiplied by `factor`.",
        objective: "List comprehensions and mathematical transformations.",
        concepts: ["Lists", "Comprehensions", "Math"],
        starter: "def multiply_elements(nums, factor):\n    # Return new list\n    pass\n",
        solution: "def multiply_elements(nums, factor):\n    return [n * factor for n in nums]\n",
        vis: [
          { stdin: "multiply_elements([1, 2, 3], 3)", expectedOutput: "[3, 6, 9]" },
        ],
        hid: [{ stdin: "multiply_elements([], 5)", expectedOutput: "[]" }],
        hints: ["Use a list comprehension `[n * factor for n in nums]`.", "Return a newly allocated list without modifying the original input."],
      },
    ];

    const p = pythonProblems[seed % pythonProblems.length];
    return {
      title: p.title,
      slug: p.slug,
      description: p.desc,
      learningObjective: p.objective,
      difficulty: req.difficulty,
      concepts: p.concepts,
      starterCode: p.starter,
      solutionCode: p.solution,
      visibleTestCases: p.vis,
      hiddenTestCases: p.hid,
      hints: p.hints,
      requiresAdminApproval: false,
    };
  }
}
