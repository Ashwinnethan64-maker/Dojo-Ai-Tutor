import {
  StructuredWorkout,
  LearnerPracticeHistory,
  ShuffleConfig,
  SupportedStructuredLanguage,
  ProgressionTier,
} from "./types";
import { IsolatedExecutionService } from "@/lib/execution/service";

// In-memory canonical structured workouts database
let structuredWorkoutsStore: StructuredWorkout[] = [];

function generateFingerprint(w: Partial<StructuredWorkout>): string {
  const normTitle = (w.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const normLang = (w.languageId || "python").toLowerCase();
  const normTests = (w.visibleTestCases || []).map((t) => `${t.stdin}->${t.expectedOutput}`).join("|");
  return `${normLang}::${normTitle}::${normTests}`;
}

export class StructuredWorkoutService {
  private static isInitialized = false;

  public static initializeStore() {
    if (this.isInitialized && structuredWorkoutsStore.length > 0) return;

    // Seed comprehensive multi-language structured problem bank across Beginner, Intermediate, Advanced
    const now = new Date().toISOString();

    const seedData: Omit<StructuredWorkout, "id" | "fingerprint" | "createdAt" | "updatedAt">[] = [
      // ----------------------------------------------------
      // 1. C++ (GCC 13) Problems
      // ----------------------------------------------------
      {
        slug: "cpp-sum-of-evens",
        title: "Sum of Even Elements",
        source: "structured",
        languageId: "cpp",
        difficulty: "easy",
        progressionLevel: "beginner",
        concept: "Loops",
        concepts: ["C++", "Vectors", "Loops", "Modulo"],
        problemStatement: "Given a vector of integers `nums`, compute and return the sum of all even numbers.",
        inputFormat: "std::vector<int> nums",
        outputFormat: "int representing the sum of even values",
        constraints: ["1 <= nums.size() <= 10^4", "-10^5 <= nums[i] <= 10^5"],
        examples: [
          { input: "{1, 2, 3, 4, 6}", output: "12", explanation: "2 + 4 + 6 = 12" },
          { input: "{1, 3, 5}", output: "0", explanation: "No even numbers" },
        ],
        starterCode: "#include <vector>\n\nint sumEvenElements(const std::vector<int>& nums) {\n    int sum = 0;\n    // Write your code here\n    return sum;\n}\n",
        solutionCode: "#include <vector>\n\nint sumEvenElements(const std::vector<int>& nums) {\n    int sum = 0;\n    for (int n : nums) {\n        if (n % 2 == 0) sum += n;\n    }\n    return sum;\n}\n",
        hints: ["Iterate using range-based for loop `for (int n : nums)`", "Check `n % 2 == 0` before adding to sum"],
        visibleTestCases: [
          { id: "tc-cpp-1-1", stdin: "sumEvenElements({1, 2, 3, 4, 6})", expectedOutput: "12" },
          { id: "tc-cpp-1-2", stdin: "sumEvenElements({1, 3, 5})", expectedOutput: "0" },
        ],
        hiddenTestCases: [
          { id: "tc-cpp-1-3", stdin: "sumEvenElements({-2, 4, -6})", expectedOutput: "-4", isHidden: true },
        ],
        isActive: true,
      },
      {
        slug: "cpp-vector-palindrome",
        title: "Vector Palindrome Check",
        source: "structured",
        languageId: "cpp",
        difficulty: "medium",
        progressionLevel: "intermediate",
        concept: "Two Pointers",
        concepts: ["C++", "Vectors", "Two Pointers"],
        problemStatement: "Given a vector of integers `nums`, return `1` (true) if the vector reads the same forwards and backwards, and `0` (false) otherwise.",
        inputFormat: "std::vector<int> nums",
        outputFormat: "int (1 or 0)",
        constraints: ["0 <= nums.size() <= 10^5"],
        examples: [
          { input: "{1, 2, 3, 2, 1}", output: "1" },
          { input: "{1, 2, 3, 4}", output: "0" },
        ],
        starterCode: "#include <vector>\n\nint isPalindromeVector(const std::vector<int>& nums) {\n    // Return 1 if palindrome, 0 otherwise\n    return 0;\n}\n",
        solutionCode: "#include <vector>\n\nint isPalindromeVector(const std::vector<int>& nums) {\n    if (nums.empty()) return 1;\n    int l = 0, r = (int)nums.size() - 1;\n    while (l < r) {\n        if (nums[l] != nums[r]) return 0;\n        l++; r--;\n    }\n    return 1;\n}\n",
        hints: ["Use two pointers `l` at 0 and `r` at `nums.size() - 1`", "Advance inwards while `l < r`"],
        visibleTestCases: [
          { id: "tc-cpp-2-1", stdin: "isPalindromeVector({1, 2, 3, 2, 1})", expectedOutput: "1" },
          { id: "tc-cpp-2-2", stdin: "isPalindromeVector({1, 2, 3, 4})", expectedOutput: "0" },
        ],
        hiddenTestCases: [
          { id: "tc-cpp-2-3", stdin: "isPalindromeVector({})", expectedOutput: "1", isHidden: true },
        ],
        isActive: true,
      },

      // ----------------------------------------------------
      // 2. Java (OpenJDK 21) Problems
      // ----------------------------------------------------
      {
        slug: "java-count-occurrences",
        title: "Count Target Occurrences",
        source: "structured",
        languageId: "java",
        difficulty: "easy",
        progressionLevel: "beginner",
        concept: "Arrays",
        concepts: ["Java", "Arrays", "Counting"],
        problemStatement: "Given an array of integers `nums` and a `target` value, return how many times `target` appears in `nums`.",
        inputFormat: "int[] nums, int target",
        outputFormat: "int count",
        constraints: ["0 <= nums.length <= 10^4", "-10^4 <= target <= 10^4"],
        examples: [
          { input: "new int[]{1, 2, 3, 2, 2, 4}, 2", output: "3" },
          { input: "new int[]{5, 6, 7}, 9", output: "0" },
        ],
        starterCode: "public class Solution {\n    public static int countOccurrences(int[] nums, int target) {\n        int count = 0;\n        // Count target in nums\n        return count;\n    }\n}\n",
        solutionCode: "public class Solution {\n    public static int countOccurrences(int[] nums, int target) {\n        int count = 0;\n        for (int n : nums) {\n            if (n == target) count++;\n        }\n        return count;\n    }\n}\n",
        hints: ["Loop through array with an enhanced for-loop `for (int n : nums)`", "Increment count when `n == target`"],
        visibleTestCases: [
          { id: "tc-java-1-1", stdin: "countOccurrences(new int[]{1, 2, 3, 2, 2, 4}, 2)", expectedOutput: "3" },
          { id: "tc-java-1-2", stdin: "countOccurrences(new int[]{5, 6, 7}, 9)", expectedOutput: "0" },
        ],
        hiddenTestCases: [
          { id: "tc-java-1-3", stdin: "countOccurrences(new int[]{}, 1)", expectedOutput: "0", isHidden: true },
        ],
        isActive: true,
      },
      {
        slug: "java-find-second-largest",
        title: "Find Second Largest Integer",
        source: "structured",
        languageId: "java",
        difficulty: "medium",
        progressionLevel: "intermediate",
        concept: "Algorithms",
        concepts: ["Java", "Arrays", "Tracking Variables"],
        problemStatement: "Given an array `nums` of at least 2 distinct integers, find and return the second largest integer in the array.",
        inputFormat: "int[] nums",
        outputFormat: "int representing second largest number",
        constraints: ["2 <= nums.length <= 10^5", "All elements have at least two distinct values"],
        examples: [
          { input: "new int[]{10, 5, 20, 15}", output: "15" },
          { input: "new int[]{1, 2}", output: "1" },
        ],
        starterCode: "public class Solution {\n    public static int findSecondLargest(int[] nums) {\n        // Return second largest\n        return 0;\n    }\n}\n",
        solutionCode: "public class Solution {\n    public static int findSecondLargest(int[] nums) {\n        int first = Integer.MIN_VALUE;\n        int second = Integer.MIN_VALUE;\n        for (int n : nums) {\n            if (n > first) {\n                second = first;\n                first = n;\n            } else if (n > second && n != first) {\n                second = n;\n            }\n        }\n        return second;\n    }\n}\n",
        hints: ["Track two variables: `first` and `second` initialized to `Integer.MIN_VALUE`", "Update `second = first` when a new maximum is found"],
        visibleTestCases: [
          { id: "tc-java-2-1", stdin: "findSecondLargest(new int[]{10, 5, 20, 15})", expectedOutput: "15" },
          { id: "tc-java-2-2", stdin: "findSecondLargest(new int[]{1, 2})", expectedOutput: "1" },
        ],
        hiddenTestCases: [
          { id: "tc-java-2-3", stdin: "findSecondLargest(new int[]{-10, -5, -20})", expectedOutput: "-10", isHidden: true },
        ],
        isActive: true,
      },

      // ----------------------------------------------------
      // 3. JavaScript (Node 20 / ES2024) Problems
      // ----------------------------------------------------
      {
        slug: "js-filter-evens",
        title: "Filter Even Numbers",
        source: "structured",
        languageId: "javascript",
        difficulty: "easy",
        progressionLevel: "beginner",
        concept: "Arrays",
        concepts: ["JavaScript", "Arrays", "Filter"],
        problemStatement: "Given an array of integers `nums`, return a new array containing strictly even numbers in their original relative order.",
        inputFormat: "number[] nums",
        outputFormat: "number[] containing only even numbers",
        constraints: ["0 <= nums.length <= 10^4"],
        examples: [
          { input: "[1, 2, 3, 4, 5, 6]", output: "[2, 4, 6]" },
          { input: "[1, 3, 5]", output: "[]" },
        ],
        starterCode: "function filterEvens(nums) {\n  // Return array of even numbers\n  return [];\n}\n",
        solutionCode: "function filterEvens(nums) {\n  return nums.filter(n => n % 2 === 0);\n}\n",
        hints: ["Use `nums.filter(n => n % 2 === 0)`", "Remember 0 is considered even"],
        visibleTestCases: [
          { id: "tc-js-1-1", stdin: "filterEvens([1, 2, 3, 4, 5, 6])", expectedOutput: "[2, 4, 6]" },
          { id: "tc-js-1-2", stdin: "filterEvens([1, 3, 5])", expectedOutput: "[]" },
        ],
        hiddenTestCases: [
          { id: "tc-js-1-3", stdin: "filterEvens([])", expectedOutput: "[]", isHidden: true },
        ],
        isActive: true,
      },
      {
        slug: "js-group-anagrams-count",
        title: "Count Unique Words by Length",
        source: "structured",
        languageId: "javascript",
        difficulty: "medium",
        progressionLevel: "intermediate",
        concept: "Objects & Maps",
        concepts: ["JavaScript", "Objects", "Hashing"],
        problemStatement: "Given an array of strings `words`, return an object grouping word counts by their length.",
        inputFormat: "string[] words",
        outputFormat: "Record<string, number>",
        constraints: ["0 <= words.length <= 10^4"],
        examples: [
          { input: "['dojo', 'code', 'ai', 'gym']", output: "{\"2\": 1, \"3\": 1, \"4\": 2}" },
        ],
        starterCode: "function countByLength(words) {\n  // Return object grouping counts\n  return {};\n}\n",
        solutionCode: "function countByLength(words) {\n  const res = {};\n  for (const w of words) {\n    const len = String(w.length);\n    res[len] = (res[len] || 0) + 1;\n  }\n  return res;\n}\n",
        hints: ["Iterate through words and increment `res[String(w.length)]`"],
        visibleTestCases: [
          { id: "tc-js-2-1", stdin: "countByLength(['dojo', 'code', 'ai', 'gym'])", expectedOutput: "{\"2\": 1, \"3\": 1, \"4\": 2}" },
        ],
        hiddenTestCases: [
          { id: "tc-js-2-2", stdin: "countByLength([])", expectedOutput: "{}", isHidden: true },
        ],
        isActive: true,
      },

      // ----------------------------------------------------
      // 4. Python (Python 3.12) Problems
      // ----------------------------------------------------
      {
        slug: "py-first-unique-char",
        title: "First Non-Repeating Character",
        source: "structured",
        languageId: "python",
        difficulty: "easy",
        progressionLevel: "beginner",
        concept: "Strings",
        concepts: ["Python", "Strings", "Hash Map"],
        problemStatement: "Given a string `s`, find the first non-repeating character and return it. If every character repeats, return an empty string `\"\"`.",
        inputFormat: "str s",
        outputFormat: "str first non-repeating character",
        constraints: ["0 <= len(s) <= 10^5", "s consists of lowercase English letters"],
        examples: [
          { input: "'dojodojoz'", output: "z" },
          { input: "'aabb'", output: "" },
        ],
        starterCode: "def first_unique_char(s):\n    # Return first non-repeating character\n    pass\n",
        solutionCode: "def first_unique_char(s):\n    from collections import Counter\n    counts = Counter(s)\n    for ch in s:\n        if counts[ch] == 1:\n            return ch\n    return ''\n",
        hints: ["Use `collections.Counter` to count character frequencies", "Iterate over `s` to find the first character with count == 1"],
        visibleTestCases: [
          { id: "tc-py-1-1", stdin: "first_unique_char('dojodojoz')", expectedOutput: "z" },
          { id: "tc-py-1-2", stdin: "first_unique_char('aabb')", expectedOutput: "" },
        ],
        hiddenTestCases: [
          { id: "tc-py-1-3", stdin: "first_unique_char('leetcode')", expectedOutput: "l", isHidden: true },
        ],
        isActive: true,
      },
      {
        slug: "py-two-sum-indices",
        title: "Pair Sum Indices",
        source: "structured",
        languageId: "python",
        difficulty: "medium",
        progressionLevel: "intermediate",
        concept: "Hash Map",
        concepts: ["Python", "Lists", "Hash Maps"],
        problemStatement: "Given a list of integers `nums` and an integer `target`, return a list containing the indices of the two numbers that add up to `target` in ascending index order.",
        inputFormat: "list[int] nums, int target",
        outputFormat: "list[int] indices [i, j]",
        constraints: ["2 <= len(nums) <= 10^5", "Exactly one valid pair exists"],
        examples: [
          { input: "[2, 7, 11, 15], 9", output: "[0, 1]" },
          { input: "[3, 2, 4], 6", output: "[1, 2]" },
        ],
        starterCode: "def two_sum_indices(nums, target):\n    # Return [index1, index2]\n    pass\n",
        solutionCode: "def two_sum_indices(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []\n",
        hints: ["Use a dictionary `seen` mapping value to index", "Check if `target - num` already exists in `seen`"],
        visibleTestCases: [
          { id: "tc-py-2-1", stdin: "two_sum_indices([2, 7, 11, 15], 9)", expectedOutput: "[0, 1]" },
          { id: "tc-py-2-2", stdin: "two_sum_indices([3, 2, 4], 6)", expectedOutput: "[1, 2]" },
        ],
        hiddenTestCases: [
          { id: "tc-py-2-3", stdin: "two_sum_indices([3, 3], 6)", expectedOutput: "[0, 1]", isHidden: true },
        ],
        isActive: true,
      },
      {
        slug: "py-longest-consecutive-sequence",
        title: "Longest Consecutive Sequence",
        source: "structured",
        languageId: "python",
        difficulty: "hard",
        progressionLevel: "advanced",
        concept: "Algorithms",
        concepts: ["Python", "Sets", "O(N) Traversal"],
        problemStatement: "Given an unsorted list of integers `nums`, return the length of the longest consecutive elements sequence in O(N) time complexity.",
        inputFormat: "list[int] nums",
        outputFormat: "int longest consecutive streak",
        constraints: ["0 <= len(nums) <= 10^5"],
        examples: [
          { input: "[100, 4, 200, 1, 3, 2]", output: "4", explanation: "Sequence [1, 2, 3, 4] has length 4" },
          { input: "[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]", output: "9" },
        ],
        starterCode: "def longest_consecutive(nums):\n    # Return longest consecutive sequence length in O(N)\n    pass\n",
        solutionCode: "def longest_consecutive(nums):\n    if not nums: return 0\n    num_set = set(nums)\n    longest = 0\n    for n in num_set:\n        if n - 1 not in num_set:\n            curr = n\n            streak = 1\n            while curr + 1 in num_set:\n                curr += 1\n                streak += 1\n            if streak > longest:\n                longest = streak\n    return longest\n",
        hints: ["Convert `nums` to a `set` for O(1) lookups", "Only start counting when `n - 1` is not in the set"],
        visibleTestCases: [
          { id: "tc-py-3-1", stdin: "longest_consecutive([100, 4, 200, 1, 3, 2])", expectedOutput: "4" },
          { id: "tc-py-3-2", stdin: "longest_consecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])", expectedOutput: "9" },
        ],
        hiddenTestCases: [
          { id: "tc-py-3-3", stdin: "longest_consecutive([])", expectedOutput: "0", isHidden: true },
        ],
        isActive: true,
      },
    ];

    seedData.forEach((item, index) => {
      const id = `str-${item.languageId}-${index + 1}`;
      const workout: StructuredWorkout = {
        ...item,
        id,
        fingerprint: generateFingerprint(item),
        createdAt: now,
        updatedAt: now,
      };
      structuredWorkoutsStore.push(workout);
    });

    this.isInitialized = true;
  }

  public static getAllWorkouts(): StructuredWorkout[] {
    this.initializeStore();
    return [...structuredWorkoutsStore];
  }

  public static getWorkoutBySlugOrId(slugOrId: string): StructuredWorkout | undefined {
    this.initializeStore();
    return structuredWorkoutsStore.find((w) => w.id === slugOrId || w.slug === slugOrId);
  }

  public static createWorkout(workoutData: Omit<StructuredWorkout, "id" | "fingerprint" | "createdAt" | "updatedAt">): StructuredWorkout {
    this.initializeStore();
    const fp = generateFingerprint(workoutData);

    // Duplicate detection check
    const existing = structuredWorkoutsStore.find((w) => w.fingerprint === fp);
    if (existing) {
      throw new Error(`Duplicate structured workout detected: matches "${existing.title}" (${existing.id})`);
    }

    const id = `str-${workoutData.languageId}-${Date.now()}`;
    const now = new Date().toISOString();
    const newWorkout: StructuredWorkout = {
      ...workoutData,
      id,
      fingerprint: fp,
      createdAt: now,
      updatedAt: now,
    };

    structuredWorkoutsStore.unshift(newWorkout);
    return newWorkout;
  }

  public static toggleActive(id: string): StructuredWorkout {
    this.initializeStore();
    const w = structuredWorkoutsStore.find((item) => item.id === id);
    if (!w) throw new Error("Workout not found");
    w.isActive = !w.isActive;
    w.updatedAt = new Date().toISOString();
    return w;
  }

  public static deleteWorkout(id: string): boolean {
    this.initializeStore();
    const initialLen = structuredWorkoutsStore.length;
    structuredWorkoutsStore = structuredWorkoutsStore.filter((w) => w.id !== id);
    return structuredWorkoutsStore.length < initialLen;
  }
}
