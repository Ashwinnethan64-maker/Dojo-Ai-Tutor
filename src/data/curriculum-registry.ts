import { BeltTier, WorkoutDifficulty } from "@/types";
import { PYTHON_TOPICS, CurriculumTopicData } from "@/data/python-curriculum";
import { SupportedLanguageId } from "@/contexts/language-context";

export const JAVASCRIPT_TOPICS: CurriculumTopicData[] = [
  {
    slug: "js-intro",
    title: "1. JavaScript & Runtime Fundamentals",
    belt: "white",
    orderIndex: 1,
    description: "V8 engine, Node.js execution, console output, and dynamic typing mechanics.",
    learningObjective: "Understand JavaScript execution flow and stdout logging with console.log.",
    explanation: "JavaScript is a dynamically typed, single-threaded language executing on the V8 engine.",
    commonMistakes: [
      "Confusing console.log with function return",
      "Using undefined variable references",
      "ASI semicolon insertion quirks",
    ],
    prerequisites: [],
    workouts: [
      {
        id: "js-intro-1",
        slug: "hello-javascript",
        title: "Hello DOJO (JS)",
        difficulty: "intro",
        learningObjective: "Write a function that returns the greeting 'Hello, DOJO!'",
        description: "Construct an ES6 function that outputs the traditional DOJO greeting.",
        instructions: "Implement `greeting()` so that it returns the exact string `Hello, DOJO!`.",
        starterCode: "function greeting() {\n  // Return 'Hello, DOJO!'\n  return '';\n}\n",
        solutionCode: "function greeting() {\n  return 'Hello, DOJO!';\n}\n",
        concepts: ["Syntax", "Strings", "Return values"],
        hints: [
          "Use the `return` keyword followed by a string in quotes.",
          "Check exact capitalization and punctuation: 'Hello, DOJO!'",
        ],
        visibleTestCases: [
          { stdin: "greeting()", expectedOutput: "Hello, DOJO!" },
        ],
        hiddenTestCases: [
          { stdin: "typeof greeting()", expectedOutput: "string" },
        ],
      },
    ],
  },
  {
    slug: "js-variables",
    title: "2. Variables, Scope & Hoisting",
    belt: "white",
    orderIndex: 2,
    description: "let vs const vs var, temporal dead zones, block scoping, and re-assignment.",
    learningObjective: "Master block scoping and immutable variable declarations with const and let.",
    explanation: "`const` creates block-scoped immutable bindings; `let` allows re-assignment.",
    commonMistakes: [
      "Reassigning a const identifier",
      "Accessing let variables before declaration (TDZ)",
    ],
    prerequisites: ["js-intro"],
    workouts: [
      {
        id: "js-var-1",
        slug: "swap-variables-js",
        title: "Swap Two Numbers",
        difficulty: "easy",
        learningObjective: "Swap two values using ES6 destructuring or a temporary variable.",
        description: "Given two numbers `a` and `b`, return an array `[b, a]`.",
        instructions: "Implement `swap(a, b)` returning an array containing `[b, a]`.",
        starterCode: "function swap(a, b) {\n  // Return [b, a]\n  return [];\n}\n",
        solutionCode: "function swap(a, b) {\n  return [b, a];\n}\n",
        concepts: ["Variables", "Arrays", "Destructuring"],
        hints: ["You can return `[b, a]` directly or use destructuring."],
        visibleTestCases: [
          { stdin: "swap(5, 10)", expectedOutput: "[10, 5]" },
        ],
        hiddenTestCases: [
          { stdin: "swap(0, -1)", expectedOutput: "[-1, 0]" },
        ],
      },
    ],
  },
  {
    slug: "js-arrays",
    title: "3. Arrays, Iteration & Higher-Order Functions",
    belt: "yellow",
    orderIndex: 3,
    description: "Map, filter, reduce, for...of loops, array mutability, and spreading.",
    learningObjective: "Master array transformations and iterative accumulators.",
    explanation: "Arrays are continuous ordered lists equipped with functional methods like map and filter.",
    commonMistakes: [
      "Mutating original array unexpectedly",
      "Off-by-one errors with array.length",
    ],
    prerequisites: ["js-variables"],
    workouts: [
      {
        id: "js-arr-1",
        slug: "find-max-js",
        title: "Find Largest in Array",
        difficulty: "easy",
        learningObjective: "Iterate through an array to find the maximum element.",
        description: "Given an array of numbers `nums`, return the largest number without using Math.max.",
        instructions: "Implement `findMax(nums)` returning the largest number.",
        starterCode: "function findMax(nums) {\n  // Write loop to find max element\n  let max = nums[0];\n  return max;\n}\n",
        solutionCode: "function findMax(nums) {\n  let max = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] > max) max = nums[i];\n  }\n  return max;\n}\n",
        concepts: ["Arrays", "Loops", "Accumulators"],
        hints: ["Initialize `max = nums[0]` and iterate from index 1."],
        visibleTestCases: [
          { stdin: "findMax([3, 7, 2, 9, 1])", expectedOutput: "9" },
        ],
        hiddenTestCases: [
          { stdin: "findMax([-5, -2, -10])", expectedOutput: "-2" },
        ],
      },
    ],
  },
  {
    slug: "js-functions",
    title: "4. Functions, Closures & Callbacks",
    belt: "yellow",
    orderIndex: 4,
    description: "Arrow functions, closures, lexical `this`, default parameters, and rest args.",
    learningObjective: "Understand lexical scoping, closures, and higher-order callbacks.",
    explanation: "A closure gives you access to an outer function's scope from an inner function.",
    commonMistakes: ["Misunderstanding this binding", "Closure memory retention"],
    prerequisites: ["js-arrays"],
    workouts: [
      {
        id: "js-func-1",
        slug: "multiplier-closure",
        title: "Create Multiplier Function",
        difficulty: "medium",
        learningObjective: "Return a function that multiplies its input by `factor`.",
        description: "Given a factor `x`, return a new function that takes `y` and returns `x * y`.",
        instructions: "Implement `createMultiplier(x)` returning a function `(y) => x * y`.",
        starterCode: "function createMultiplier(x) {\n  return function(y) {\n    return 0;\n  };\n}\n",
        solutionCode: "function createMultiplier(x) {\n  return function(y) {\n    return x * y;\n  };\n}\n",
        concepts: ["Closures", "Higher-Order Functions"],
        hints: ["The inner function retains access to `x`."],
        visibleTestCases: [
          { stdin: "const double = createMultiplier(2); double(5)", expectedOutput: "10" },
        ],
        hiddenTestCases: [
          { stdin: "const triple = createMultiplier(3); triple(4)", expectedOutput: "12" },
        ],
      },
    ],
  },
];

export const TYPESCRIPT_TOPICS: CurriculumTopicData[] = [
  {
    slug: "ts-intro",
    title: "1. TypeScript Types & Type Inference",
    belt: "white",
    orderIndex: 1,
    description: "Static typing, primitive types, unions, type narrowing, and compiler options.",
    learningObjective: "Write type-safe functions with explicit return and parameter types.",
    explanation: "TypeScript compiles down to JavaScript, enforcing compile-time type safety.",
    commonMistakes: ["Overusing `any`", "Ignoring union type checks"],
    prerequisites: [],
    workouts: [
      {
        id: "ts-intro-1",
        slug: "ts-sum",
        title: "Typed Addition Function",
        difficulty: "intro",
        learningObjective: "Declare typed parameters and return type.",
        description: "Implement a function `add(a: number, b: number): number`.",
        instructions: "Return `a + b` with proper types.",
        starterCode: "function add(a: number, b: number): number {\n  return 0;\n}\n",
        solutionCode: "function add(a: number, b: number): number {\n  return a + b;\n}\n",
        concepts: ["Types", "Functions"],
        hints: ["Add `a` and `b` together and return the sum."],
        visibleTestCases: [{ stdin: "add(3, 4)", expectedOutput: "7" }],
        hiddenTestCases: [{ stdin: "add(-2, 5)", expectedOutput: "3" }],
      },
    ],
  },
  {
    slug: "ts-generics",
    title: "2. Generics & Interface Contracts",
    belt: "yellow",
    orderIndex: 2,
    description: "Generic functions, interface modeling, keyof constraints, and utility types.",
    learningObjective: "Build reusable generic utilities and enforce structural interfaces.",
    explanation: "Generics allow components to work over a variety of types rather than a single one.",
    commonMistakes: ["Unconstrained generics causing property access errors"],
    prerequisites: ["ts-intro"],
    workouts: [
      {
        id: "ts-gen-1",
        slug: "ts-identity",
        title: "Generic Identity Wrap",
        difficulty: "easy",
        learningObjective: "Write a generic identity wrapper function.",
        description: "Create `wrapInBox<T>(item: T): { value: T }`.",
        instructions: "Return an object with `{ value: item }`.",
        starterCode: "function wrapInBox<T>(item: T): { value: T } {\n  return { value: item };\n}\n",
        solutionCode: "function wrapInBox<T>(item: T): { value: T } {\n  return { value: item };\n}\n",
        concepts: ["Generics", "Interfaces"],
        hints: ["Return an object with key `value` matching the generic `item`."],
        visibleTestCases: [{ stdin: "wrapInBox('dojo').value", expectedOutput: "dojo" }],
        hiddenTestCases: [{ stdin: "wrapInBox(42).value", expectedOutput: "42" }],
      },
    ],
  },
];

export const CPP_TOPICS: CurriculumTopicData[] = [
  {
    slug: "cpp-intro",
    title: "1. C++ Fundamentals & Memory Models",
    belt: "white",
    orderIndex: 1,
    description: "Pointers, references, memory stack vs heap, vectors, and standard I/O streams.",
    learningObjective: "Understand low-level compilation, pointer semantics, and std::vector.",
    explanation: "C++ is a high-performance compiled language giving direct control over system memory.",
    commonMistakes: ["Dangling pointer references", "Array out of bounds"],
    prerequisites: [],
    workouts: [
      {
        id: "cpp-intro-1",
        slug: "cpp-max",
        title: "Vector Maximum Element",
        difficulty: "easy",
        learningObjective: "Iterate through std::vector<int> to return maximum element.",
        description: "Find the maximum integer in a `std::vector<int>`.",
        instructions: "Implement `findMax(const std::vector<int>& nums)`.",
        starterCode: "#include <vector>\n#include <algorithm>\n\nint findMax(const std::vector<int>& nums) {\n    int maxVal = nums[0];\n    for (int n : nums) {\n        if (n > maxVal) maxVal = n;\n    }\n    return maxVal;\n}\n",
        solutionCode: "#include <vector>\n\nint findMax(const std::vector<int>& nums) {\n    int maxVal = nums[0];\n    for (int n : nums) {\n        if (n > maxVal) maxVal = n;\n    }\n    return maxVal;\n}\n",
        concepts: ["Vectors", "Loops", "Pointers"],
        hints: ["Use a range-based for loop over `nums`."],
        visibleTestCases: [{ stdin: "findMax({1, 5, 3, 9, 2})", expectedOutput: "9" }],
        hiddenTestCases: [{ stdin: "findMax({-10, -3, -5})", expectedOutput: "-3" }],
      },
    ],
  },
];

export const JAVA_TOPICS: CurriculumTopicData[] = [
  {
    slug: "java-intro",
    title: "1. Java Class Structure & JVM Architecture",
    belt: "white",
    orderIndex: 1,
    description: "JVM byte code, OOP structure, static vs instance methods, and ArrayLists.",
    learningObjective: "Master object-oriented basics, class definitions, and ArrayList iteration.",
    explanation: "Java programs compile to bytecode and execute securely inside the Java Virtual Machine.",
    commonMistakes: ["NullPointerException on uninitialized objects", "Primitive vs Object wrapper mixups"],
    prerequisites: [],
    workouts: [
      {
        id: "java-intro-1",
        slug: "java-max",
        title: "Array Maximum Finder",
        difficulty: "easy",
        learningObjective: "Iterate through an int array to find the highest value.",
        description: "Given `int[] numbers`, return the largest integer.",
        instructions: "Implement `findMax(int[] numbers)` in Java.",
        starterCode: "public class Solution {\n    public static int findMax(int[] numbers) {\n        int max = numbers[0];\n        for (int num : numbers) {\n            if (num > max) max = num;\n        }\n        return max;\n    }\n}\n",
        solutionCode: "public class Solution {\n    public static int findMax(int[] numbers) {\n        int max = numbers[0];\n        for (int num : numbers) {\n            if (num > max) max = num;\n        }\n        return max;\n    }\n}\n",
        concepts: ["Arrays", "Methods", "Loops"],
        hints: ["Iterate through `numbers` using an enhanced for-loop."],
        visibleTestCases: [{ stdin: "findMax(new int[]{4, 9, 2, 7})", expectedOutput: "9" }],
        hiddenTestCases: [{ stdin: "findMax(new int[]{-3, -1, -5})", expectedOutput: "-1" }],
      },
    ],
  },
];

export const CURRICULUM_BY_LANGUAGE: Record<SupportedLanguageId, CurriculumTopicData[]> = {
  python: PYTHON_TOPICS,
  javascript: JAVASCRIPT_TOPICS,
  typescript: TYPESCRIPT_TOPICS,
  cpp: CPP_TOPICS,
  java: JAVA_TOPICS,
};

export function getCurriculumForLanguage(lang: SupportedLanguageId): CurriculumTopicData[] {
  return CURRICULUM_BY_LANGUAGE[lang] || PYTHON_TOPICS;
}
