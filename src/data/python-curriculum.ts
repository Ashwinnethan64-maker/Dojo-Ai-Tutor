import { BeltTier, WorkoutDifficulty } from "@/types";

export interface CurriculumTopicData {
  slug: string;
  title: string;
  belt: BeltTier;
  orderIndex: number;
  description: string;
  learningObjective: string;
  explanation: string;
  commonMistakes: string[];
  prerequisites: string[];
  workouts: WorkoutData[];
}

export interface WorkoutData {
  id: string;
  slug: string;
  title: string;
  difficulty: WorkoutDifficulty;
  learningObjective: string;
  description: string;
  instructions: string;
  starterCode: string;
  solutionCode: string;
  concepts: string[];
  hints: string[];
  visibleTestCases: { stdin: string; expectedOutput: string }[];
  hiddenTestCases: { stdin: string; expectedOutput: string }[];
}

export const PYTHON_TOPICS: CurriculumTopicData[] = [
  {
    slug: "introduction",
    title: "1. Introduction to Python",
    belt: "white",
    orderIndex: 1,
    description: "Program execution, stdout printing, comments, and Python syntax mechanics.",
    learningObjective: "Understand how Python interprets code and how to emit text to stdout.",
    explanation: "Python is an interpreted, high-level language. Execution starts from the first line down. `print()` writes text to standard output.",
    commonMistakes: [
      "Forgetting quotes around string literals",
      "Using uppercase Print() instead of print()",
      "Mismatched parentheses"
    ],
    prerequisites: [],
    workouts: [
      {
        id: "py-intro-1",
        slug: "hello-dojo",
        title: "Hello DOJO",
        difficulty: "intro",
        learningObjective: "Write a function that returns the greeting 'Hello, DOJO!'",
        description: "Your first DOJO step is to construct a function that outputs the traditional DOJO greeting.",
        instructions: "Implement `greeting()` so that it returns the exact string `Hello, DOJO!`.",
        starterCode: "def greeting():\n    # Return the string 'Hello, DOJO!'\n    pass\n",
        solutionCode: "def greeting():\n    return 'Hello, DOJO!'\n",
        concepts: ["Syntax", "Strings", "Return values"],
        hints: [
          "Use the `return` keyword followed by a string in quotes.",
          "Check the capitalization and punctuation: 'Hello, DOJO!' exactly."
        ],
        visibleTestCases: [{ stdin: "greeting()", expectedOutput: "Hello, DOJO!" }],
        hiddenTestCases: [{ stdin: "type(greeting())", expectedOutput: "<class 'str'>" }]
      },
      {
        id: "py-intro-2",
        slug: "custom-greeting",
        title: "Personalized Greeting",
        difficulty: "easy",
        learningObjective: "Concatenate and return strings dynamically based on an argument.",
        description: "Build an interactive greeting function that welcomes any student by name.",
        instructions: "Implement `greet_coder(name)` to return `Welcome to the Dojo, {name}!`.",
        starterCode: "def greet_coder(name):\n    # Return formatted string\n    pass\n",
        solutionCode: "def greet_coder(name):\n    return f'Welcome to the Dojo, {name}!'\n",
        concepts: ["F-Strings", "Function Arguments"],
        hints: [
          "Consider using Python 3 f-strings: f'Welcome to the Dojo, {name}!'",
          "Remember the exclamation mark at the end."
        ],
        visibleTestCases: [
          { stdin: "greet_coder('Ashwin')", expectedOutput: "Welcome to the Dojo, Ashwin!" }
        ],
        hiddenTestCases: [
          { stdin: "greet_coder('Sensei')", expectedOutput: "Welcome to the Dojo, Sensei!" }
        ]
      },
      {
        id: "py-intro-3",
        slug: "square-number",
        title: "Basic Computation",
        difficulty: "easy",
        learningObjective: "Perform arithmetic exponentiation and return the calculated result.",
        description: "Calculate and return the square of a given integer `n`.",
        instructions: "Implement `square(n)` returning `n ** 2`.",
        starterCode: "def square(n):\n    pass\n",
        solutionCode: "def square(n):\n    return n ** 2\n",
        concepts: ["Arithmetic", "Exponentiation"],
        hints: [
          "In Python, exponentiation is written with `**` or `n * n`.",
          "Return the numerical result."
        ],
        visibleTestCases: [
          { stdin: "square(4)", expectedOutput: "16" },
          { stdin: "square(5)", expectedOutput: "25" }
        ],
        hiddenTestCases: [
          { stdin: "square(-3)", expectedOutput: "9" },
          { stdin: "square(0)", expectedOutput: "0" }
        ]
      },
      {
        id: "py-intro-4",
        slug: "celsius-to-fahrenheit",
        title: "Temperature Conversion",
        difficulty: "easy",
        learningObjective: "Combine multiplication, division, and addition in an arithmetic expression.",
        description: "Convert a temperature in Celsius to Fahrenheit using the formula (C * 9/5) + 32.",
        instructions: "Implement `to_fahrenheit(celsius)` returning the float value.",
        starterCode: "def to_fahrenheit(celsius):\n    pass\n",
        solutionCode: "def to_fahrenheit(celsius):\n    return (celsius * 9 / 5) + 32\n",
        concepts: ["Arithmetic", "Order of Operations"],
        hints: ["Formula: (celsius * 9 / 5) + 32"],
        visibleTestCases: [
          { stdin: "to_fahrenheit(0)", expectedOutput: "32.0" },
          { stdin: "to_fahrenheit(100)", expectedOutput: "212.0" }
        ],
        hiddenTestCases: [{ stdin: "to_fahrenheit(-40)", expectedOutput: "-40.0" }]
      },
      {
        id: "py-intro-5",
        slug: "double-string",
        title: "String Repetition Operator",
        difficulty: "guided" as WorkoutDifficulty,
        learningObjective: "Understand string multiplication syntax in Python.",
        description: "Return a string repeated `count` times.",
        instructions: "Implement `repeat_text(text, count)` to return `text * count`.",
        starterCode: "def repeat_text(text, count):\n    pass\n",
        solutionCode: "def repeat_text(text, count):\n    return text * count\n",
        concepts: ["String Operators", "Multiplication"],
        hints: ["Python allows multiplying strings: 'ha' * 3 == 'hahaha'."],
        visibleTestCases: [{ stdin: "repeat_text('dojo', 2)", expectedOutput: "dojodojo" }],
        hiddenTestCases: [{ stdin: "repeat_text('x', 0)", expectedOutput: "" }]
      }
    ]
  },
  {
    slug: "variables",
    title: "2. Variables & Memory",
    belt: "white",
    orderIndex: 2,
    description: "Naming conventions, object references, mutation, and variable reassignment.",
    learningObjective: "Master variable assignment and state tracking across assignments.",
    explanation: "In Python, variables are names that refer to objects in memory. Assigning `a = b` points `a` to the same object as `b`.",
    commonMistakes: [
      "Using keywords like `def`, `class`, or `for` as variable names",
      "Assuming reassignment modifies other unlinked primitives"
    ],
    prerequisites: ["introduction"],
    workouts: [
      {
        id: "py-var-1",
        slug: "swap-variables",
        title: "Swap Two Variables",
        difficulty: "easy",
        learningObjective: "Swap variable values using Python's tuple unpacking.",
        description: "Given values `a` and `b`, return a tuple with values swapped as `(b, a)`.",
        instructions: "Implement `swap(a, b)` returning `(b, a)`.",
        starterCode: "def swap(a, b):\n    # Swap values\n    pass\n",
        solutionCode: "def swap(a, b):\n    return b, a\n",
        concepts: ["Tuples", "Variable Assignment"],
        hints: ["Python supports multiple assignment: `return b, a`."],
        visibleTestCases: [{ stdin: "swap(1, 2)", expectedOutput: "(2, 1)" }],
        hiddenTestCases: [{ stdin: "swap('foo', 'bar')", expectedOutput: "('bar', 'foo')" }]
      },
      {
        id: "py-var-2",
        slug: "increment-accumulator",
        title: "Accumulator Variable",
        difficulty: "easy",
        learningObjective: "Maintain and return an incremented total.",
        description: "Given a starting value and step size, return the value after 3 consecutive steps.",
        instructions: "Implement `accumulate(start, step)`.",
        starterCode: "def accumulate(start, step):\n    pass\n",
        solutionCode: "def accumulate(start, step):\n    return start + (step * 3)\n",
        concepts: ["Variables", "Increment"],
        hints: ["Add step 3 times or step * 3 to start."],
        visibleTestCases: [{ stdin: "accumulate(10, 2)", expectedOutput: "16" }],
        hiddenTestCases: [{ stdin: "accumulate(0, 5)", expectedOutput: "15" }]
      },
      {
        id: "py-var-3",
        slug: "calculate-perimeter",
        title: "Rectangle Perimeter",
        difficulty: "easy",
        learningObjective: "Store intermediate formula components into descriptive variables.",
        description: "Calculate perimeter from width and height.",
        instructions: "Implement `perimeter(width, height)` returning 2 * (width + height).",
        starterCode: "def perimeter(width, height):\n    pass\n",
        solutionCode: "def perimeter(width, height):\n    return 2 * (width + height)\n",
        concepts: ["Variables", "Formulas"],
        hints: ["Perimeter is 2 * (width + height)."],
        visibleTestCases: [{ stdin: "perimeter(5, 10)", expectedOutput: "30" }],
        hiddenTestCases: [{ stdin: "perimeter(7, 3)", expectedOutput: "20" }]
      },
      {
        id: "py-var-4",
        slug: "circle-area",
        title: "Area of Circle with Constant",
        difficulty: "medium",
        learningObjective: "Define float constants and calculate geometric formulas.",
        description: "Calculate circle area given radius `r`, using `PI = 3.14159`.",
        instructions: "Implement `circle_area(r)` returning `round(3.14159 * r * r, 2)`.",
        starterCode: "def circle_area(r):\n    pass\n",
        solutionCode: "def circle_area(r):\n    PI = 3.14159\n    return round(PI * (r ** 2), 2)\n",
        concepts: ["Constants", "Math"],
        hints: ["Area = PI * (r ** 2). Round to 2 decimal places."],
        visibleTestCases: [{ stdin: "circle_area(3)", expectedOutput: "28.27" }],
        hiddenTestCases: [{ stdin: "circle_area(5)", expectedOutput: "78.54" }]
      },
      {
        id: "py-var-5",
        slug: "split-bill",
        title: "Split the Bill",
        difficulty: "medium",
        learningObjective: "Calculate tip, total bill, and split per person.",
        description: "Calculate cost per person including tip percentage.",
        instructions: "Implement `split_bill(total, tip_percent, people)` returning round((total * (1 + tip_percent/100)) / people, 2).",
        starterCode: "def split_bill(total, tip_percent, people):\n    pass\n",
        solutionCode: "def split_bill(total, tip_percent, people):\n    total_with_tip = total * (1 + tip_percent / 100)\n    return round(total_with_tip / people, 2)\n",
        concepts: ["Variables", "Float Division"],
        hints: ["Multiply total by (1 + tip_percent / 100) then divide by people."],
        visibleTestCases: [{ stdin: "split_bill(100, 20, 4)", expectedOutput: "30.0" }],
        hiddenTestCases: [{ stdin: "split_bill(50, 15, 2)", expectedOutput: "28.75" }]
      }
    ]
  },
  {
    slug: "data-types",
    title: "3. Primitive Data Types & Casting",
    belt: "white",
    orderIndex: 3,
    description: "Integers, Floats, Strings, Booleans, and type conversion mechanics.",
    learningObjective: "Distinguish between scalar data types and convert between them safely.",
    explanation: "Python provides `int()`, `float()`, `str()`, and `bool()` constructor functions to cast types.",
    commonMistakes: [
      "Adding string to integer: '10' + 5 causes TypeError",
      "Empty string `bool('')` is False, but `'False'` is True"
    ],
    prerequisites: ["variables"],
    workouts: [
      {
        id: "py-dt-1",
        slug: "safe-string-to-int",
        title: "Cast String to Integer Sum",
        difficulty: "easy",
        learningObjective: "Convert string representations of numbers to integers and sum them.",
        description: "Given two number strings 'a' and 'b', return their sum as an integer.",
        instructions: "Implement `sum_str(a, b)` returning `int(a) + int(b)`.",
        starterCode: "def sum_str(a, b):\n    pass\n",
        solutionCode: "def sum_str(a, b):\n    return int(a) + int(b)\n",
        concepts: ["Type Casting", "int()"],
        hints: ["Convert both arguments using int() before adding."],
        visibleTestCases: [{ stdin: "sum_str('10', '25')", expectedOutput: "35" }],
        hiddenTestCases: [{ stdin: "sum_str('-5', '5')", expectedOutput: "0" }]
      },
      {
        id: "py-dt-2",
        slug: "is-even-boolean",
        title: "Is Even Checker",
        difficulty: "easy",
        learningObjective: "Use modulo operator to return a boolean True or False.",
        description: "Return `True` if integer `n` is even, else `False`.",
        instructions: "Implement `is_even(n)` returning `n % 2 == 0`.",
        starterCode: "def is_even(n):\n    pass\n",
        solutionCode: "def is_even(n):\n    return n % 2 == 0\n",
        concepts: ["Booleans", "Modulo"],
        hints: ["Use `n % 2 == 0`."],
        visibleTestCases: [
          { stdin: "is_even(4)", expectedOutput: "True" },
          { stdin: "is_even(7)", expectedOutput: "False" }
        ],
        hiddenTestCases: [{ stdin: "is_even(0)", expectedOutput: "True" }]
      },
      {
        id: "py-dt-3",
        slug: "float-to-cents",
        title: "Convert Dollars to Cents",
        difficulty: "easy",
        learningObjective: "Handle float to integer conversion safely.",
        description: "Convert dollar float to integer cents.",
        instructions: "Implement `to_cents(dollars)` returning `round(dollars * 100)`.",
        starterCode: "def to_cents(dollars):\n    pass\n",
        solutionCode: "def to_cents(dollars):\n    return int(round(dollars * 100))\n",
        concepts: ["Floats", "Rounding"],
        hints: ["Multiply by 100 and use round() or int()."],
        visibleTestCases: [{ stdin: "to_cents(4.99)", expectedOutput: "499" }],
        hiddenTestCases: [{ stdin: "to_cents(0.05)", expectedOutput: "5" }]
      },
      {
        id: "py-dt-4",
        slug: "type-description",
        title: "Identify Data Type",
        difficulty: "medium",
        learningObjective: "Inspect types using `type()` and return friendly names.",
        description: "Return 'integer', 'float', 'string', or 'boolean' based on `val`.",
        instructions: "Implement `get_type_name(val)`.",
        starterCode: "def get_type_name(val):\n    pass\n",
        solutionCode: "def get_type_name(val):\n    if isinstance(val, bool):\n        return 'boolean'\n    if isinstance(val, int):\n        return 'integer'\n    if isinstance(val, float):\n        return 'float'\n    if isinstance(val, str):\n        return 'string'\n    return 'other'\n",
        concepts: ["type()", "isinstance()"],
        hints: ["Check bool before int because bool inherits from int in Python."],
        visibleTestCases: [
          { stdin: "get_type_name(42)", expectedOutput: "integer" },
          { stdin: "get_type_name(True)", expectedOutput: "boolean" }
        ],
        hiddenTestCases: [
          { stdin: "get_type_name(3.14)", expectedOutput: "float" },
          { stdin: "get_type_name('hello')", expectedOutput: "string" }
        ]
      },
      {
        id: "py-dt-5",
        slug: "truthy-checker",
        title: "Count Truthy Values",
        difficulty: "hard",
        learningObjective: "Evaluate truthiness of mixed list elements.",
        description: "Given a list of mixed values, return count of elements that evaluate to `bool(x) == True`.",
        instructions: "Implement `count_truthy(items)`.",
        starterCode: "def count_truthy(items):\n    pass\n",
        solutionCode: "def count_truthy(items):\n    return sum(1 for x in items if bool(x))\n",
        concepts: ["Truthiness", "bool()"],
        hints: ["Use `bool(item)` or `if item:` to check truthiness."],
        visibleTestCases: [
          { stdin: "count_truthy([0, 1, '', 'hello', [], [1, 2], False, True])", expectedOutput: "4" }
        ],
        hiddenTestCases: [{ stdin: "count_truthy([None, 0, False, '', {}])", expectedOutput: "0" }]
      }
    ]
  },
  {
    slug: "input-output",
    title: "4. Input / Output & F-Strings",
    belt: "white",
    orderIndex: 4,
    description: "Format strings, precision formatting, alignment, and parsing standard inputs.",
    learningObjective: "Format text outputs with f-string specifiers and precision padding.",
    explanation: "F-strings allow embedded Python expressions with formatting specifiers like `{val:.2f}`.",
    commonMistakes: ["Forgetting leading `f` before quotes", "Mismatched curly braces in f-strings"],
    prerequisites: ["data-types"],
    workouts: [
      {
        id: "py-io-1",
        slug: "format-currency",
        title: "Format Currency",
        difficulty: "easy",
        learningObjective: "Format numbers as dollar strings with two decimal places.",
        description: "Format float `amount` into `$XX.XX`.",
        instructions: "Implement `format_usd(amount)`.",
        starterCode: "def format_usd(amount):\n    pass\n",
        solutionCode: "def format_usd(amount):\n    return f'${amount:.2f}'\n",
        concepts: ["F-Strings", "Number Formatting"],
        hints: ["Use `{amount:.2f}`."],
        visibleTestCases: [{ stdin: "format_usd(19.5)", expectedOutput: "$19.50" }],
        hiddenTestCases: [{ stdin: "format_usd(0)", expectedOutput: "$0.00" }]
      },
      {
        id: "py-io-2",
        slug: "pad-zeroes",
        title: "Pad Integer with Leading Zeroes",
        difficulty: "easy",
        learningObjective: "Use format specifier `0Nd` to pad integers.",
        description: "Pad integer `num` to be at least `width` characters long with leading zeroes.",
        instructions: "Implement `pad_number(num, width)`.",
        starterCode: "def pad_number(num, width):\n    pass\n",
        solutionCode: "def pad_number(num, width):\n    return str(num).zfill(width)\n",
        concepts: ["F-Strings", "Padding"],
        hints: ["Use `str(num).zfill(width)` or f-string `{num:0{width}d}`."],
        visibleTestCases: [{ stdin: "pad_number(42, 5)", expectedOutput: "00042" }],
        hiddenTestCases: [{ stdin: "pad_number(7, 3)", expectedOutput: "007" }]
      },
      {
        id: "py-io-3",
        slug: "construct-receipt-line",
        title: "Receipt Item Line",
        difficulty: "medium",
        learningObjective: "Align text and values into fixed column widths.",
        description: "Format product item and price as: `ITEM.......$PRICE` with total length 20.",
        instructions: "Implement `format_receipt_line(item, price)`.",
        starterCode: "def format_receipt_line(item, price):\n    pass\n",
        solutionCode: "def format_receipt_line(item, price):\n    price_str = f'${price:.2f}'\n    dots = '.' * (20 - len(item) - len(price_str))\n    return f'{item}{dots}{price_str}'\n",
        concepts: ["Alignment", "F-Strings"],
        hints: ["Calculate dot count: `20 - len(item) - len(price_str)`."],
        visibleTestCases: [{ stdin: "format_receipt_line('Coffee', 3.50)", expectedOutput: "Coffee.........$3.50" }],
        hiddenTestCases: [{ stdin: "format_receipt_line('Sandwich', 12.00)", expectedOutput: "Sandwich......$12.00" }]
      },
      {
        id: "py-io-4",
        slug: "parse-csv-line",
        title: "Parse CSV Record",
        difficulty: "medium",
        learningObjective: "Split comma-separated values and strip whitespace.",
        description: "Given string 'Apple, 4, 1.25', return tuple `('Apple', 4, 1.25)`.",
        instructions: "Implement `parse_csv_record(line)`.",
        starterCode: "def parse_csv_record(line):\n    pass\n",
        solutionCode: "def parse_csv_record(line):\n    parts = [p.strip() for p in line.split(',')]\n    return parts[0], int(parts[1]), float(parts[2])\n",
        concepts: ["split()", "Type Casting"],
        hints: ["Use `line.split(',')`, strip whitespace, and cast items."],
        visibleTestCases: [
          { stdin: "parse_csv_record('Apple, 4, 1.25')", expectedOutput: "('Apple', 4, 1.25)" }
        ],
        hiddenTestCases: [
          { stdin: "parse_csv_record('Banana, 10, 0.50')", expectedOutput: "('Banana', 10, 0.5)" }
        ]
      },
      {
        id: "py-io-5",
        slug: "generate-markdown-table-row",
        title: "Markdown Table Row",
        difficulty: "hard",
        learningObjective: "Format structured list items into Markdown table row syntax.",
        description: "Convert a list `['id', 'name', 'score']` into `| id | name | score |`.",
        instructions: "Implement `markdown_row(cells)`.",
        starterCode: "def markdown_row(cells):\n    pass\n",
        solutionCode: "def markdown_row(cells):\n    return '| ' + ' | '.join(str(c) for c in cells) + ' |'\n",
        concepts: ["join()", "String Formatting"],
        hints: ["Use `' | '.join(...)` surrounded by `| ` and ` |`."],
        visibleTestCases: [
          { stdin: "markdown_row(['1', 'Ashwin', '100'])", expectedOutput: "| 1 | Ashwin | 100 |" }
        ],
        hiddenTestCases: [{ stdin: "markdown_row(['A', 'B'])", expectedOutput: "| A | B |" }]
      }
    ]
  },
  {
    slug: "operators",
    title: "5. Operators & Expressions",
    belt: "yellow",
    orderIndex: 5,
    description: "Arithmetic, comparison, logical (and/or/not), identity (is), and membership (in).",
    learningObjective: "Combine logical expressions with operator precedence.",
    explanation: "Logical operators `and`, `or`, `not` short-circuit in Python. `==` checks value equality, while `is` checks memory identity.",
    commonMistakes: [
      "Confusing `=` (assignment) with `==` (equality)",
      "Using `is` to compare numbers or strings"
    ],
    prerequisites: ["input-output"],
    workouts: [
      {
        id: "py-op-1",
        slug: "in-range-bounds",
        title: "Value Within Bounds",
        difficulty: "easy",
        learningObjective: "Chained comparison operators in Python.",
        description: "Return True if `val` is between `min_val` and `max_val` inclusive.",
        instructions: "Implement `in_bounds(val, min_val, max_val)` using chained comparison.",
        starterCode: "def in_bounds(val, min_val, max_val):\n    pass\n",
        solutionCode: "def in_bounds(val, min_val, max_val):\n    return min_val <= val <= max_val\n",
        concepts: ["Comparisons", "Chained Operators"],
        hints: ["Python supports `min_val <= val <= max_val` directly."],
        visibleTestCases: [
          { stdin: "in_bounds(5, 1, 10)", expectedOutput: "True" },
          { stdin: "in_bounds(15, 1, 10)", expectedOutput: "False" }
        ],
        hiddenTestCases: [{ stdin: "in_bounds(1, 1, 10)", expectedOutput: "True" }]
      },
      {
        id: "py-op-2",
        slug: "leap-year-operator",
        title: "Leap Year Boolean Logic",
        difficulty: "medium",
        learningObjective: "Combine multiple modulo and logical operators.",
        description: "A year is leap if divisible by 4, but not 100, unless also divisible by 400.",
        instructions: "Implement `is_leap_year(year)`.",
        starterCode: "def is_leap_year(year):\n    pass\n",
        solutionCode: "def is_leap_year(year):\n    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)\n",
        concepts: ["Logical AND/OR", "Modulo"],
        hints: ["Use `(year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)`."],
        visibleTestCases: [
          { stdin: "is_leap_year(2024)", expectedOutput: "True" },
          { stdin: "is_leap_year(1900)", expectedOutput: "False" }
        ],
        hiddenTestCases: [{ stdin: "is_leap_year(2000)", expectedOutput: "True" }]
      },
      {
        id: "py-op-3",
        slug: "xor-boolean",
        title: "Exclusive OR (XOR)",
        difficulty: "easy",
        learningObjective: "Implement XOR logic (True if exactly one operand is True).",
        description: "Return True if either `a` or `b` is True, but not both.",
        instructions: "Implement `logical_xor(a, b)`.",
        starterCode: "def logical_xor(a, b):\n    pass\n",
        solutionCode: "def logical_xor(a, b):\n    return bool(a) != bool(b)\n",
        concepts: ["Booleans", "XOR"],
        hints: ["In boolean arithmetic, `bool(a) != bool(b)` is true exclusive OR."],
        visibleTestCases: [
          { stdin: "logical_xor(True, False)", expectedOutput: "True" },
          { stdin: "logical_xor(True, True)", expectedOutput: "False" }
        ],
        hiddenTestCases: [{ stdin: "logical_xor(False, False)", expectedOutput: "False" }]
      },
      {
        id: "py-op-4",
        slug: "membership-checker",
        title: "Keyword Membership In List",
        difficulty: "easy",
        learningObjective: "Use the `in` operator to test containment.",
        description: "Check if string `item` is present in list `items` ignoring case.",
        instructions: "Implement `contains_ignore_case(item, items)`.",
        starterCode: "def contains_ignore_case(item, items):\n    pass\n",
        solutionCode: "def contains_ignore_case(item, items):\n    lower_items = [x.lower() for x in items]\n    return item.lower() in lower_items\n",
        concepts: ["in Operator", "Case Normalization"],
        hints: ["Normalize both search item and list items with `.lower()`."],
        visibleTestCases: [
          { stdin: "contains_ignore_case('Apple', ['banana', 'apple', 'cherry'])", expectedOutput: "True" }
        ],
        hiddenTestCases: [
          { stdin: "contains_ignore_case('grape', ['banana', 'apple'])", expectedOutput: "False" }
        ]
      },
      {
        id: "py-op-5",
        slug: "bitwise-even-check",
        title: "Bitwise Even / Odd Check",
        difficulty: "medium",
        learningObjective: "Use bitwise AND `&` operator to check the least significant bit.",
        description: "Check if integer `n` is even using bitwise `& 1`.",
        instructions: "Implement `bitwise_is_even(n)` returning `(n & 1) == 0`.",
        starterCode: "def bitwise_is_even(n):\n    pass\n",
        solutionCode: "def bitwise_is_even(n):\n    return (n & 1) == 0\n",
        concepts: ["Bitwise Operators", "&"],
        hints: ["`(n & 1) == 0` checks if the last bit is 0."],
        visibleTestCases: [
          { stdin: "bitwise_is_even(12)", expectedOutput: "True" },
          { stdin: "bitwise_is_even(7)", expectedOutput: "False" }
        ],
        hiddenTestCases: [{ stdin: "bitwise_is_even(0)", expectedOutput: "True" }]
      }
    ]
  },
  {
    slug: "conditions",
    title: "6. Conditional Branching",
    belt: "yellow",
    orderIndex: 6,
    description: "if, elif, else blocks, nested conditions, and ternary expressions.",
    learningObjective: "Write clean decision branching trees without redundant checks.",
    explanation: "Conditionals evaluate truthiness and execute only the first matching branch.",
    commonMistakes: [
      "Overlapping conditions with incorrect order",
      "Using multiple `if` statements instead of `elif`"
    ],
    prerequisites: ["operators"],
    workouts: [
      {
        id: "py-cond-1",
        slug: "grade-calculator",
        title: "Letter Grade Classifier",
        difficulty: "easy",
        learningObjective: "Map numeric scores to letter grades using if-elif-else.",
        description: "Score >= 90: 'A', >= 80: 'B', >= 70: 'C', >= 60: 'D', else: 'F'.",
        instructions: "Implement `get_letter_grade(score)`.",
        starterCode: "def get_letter_grade(score):\n    pass\n",
        solutionCode: "def get_letter_grade(score):\n    if score >= 90: return 'A'\n    elif score >= 80: return 'B'\n    elif score >= 70: return 'C'\n    elif score >= 60: return 'D'\n    else: return 'F'\n",
        concepts: ["if-elif-else"],
        hints: ["Order conditions from highest to lowest."],
        visibleTestCases: [
          { stdin: "get_letter_grade(95)", expectedOutput: "A" },
          { stdin: "get_letter_grade(72)", expectedOutput: "C" }
        ],
        hiddenTestCases: [{ stdin: "get_letter_grade(50)", expectedOutput: "F" }]
      },
      {
        id: "py-cond-2",
        slug: "fizz-buzz-single",
        title: "FizzBuzz Evaluator",
        difficulty: "easy",
        learningObjective: "Handle compound divisibility conditions in correct precedence.",
        description: "If divisible by 3 and 5 return 'FizzBuzz', by 3 return 'Fizz', by 5 return 'Buzz', else str(n).",
        instructions: "Implement `fizz_buzz(n)`.",
        starterCode: "def fizz_buzz(n):\n    pass\n",
        solutionCode: "def fizz_buzz(n):\n    if n % 15 == 0: return 'FizzBuzz'\n    elif n % 3 == 0: return 'Fizz'\n    elif n % 5 == 0: return 'Buzz'\n    else: return str(n)\n",
        concepts: ["Modulo", "Condition Ordering"],
        hints: ["Check divisibility by 15 (both 3 and 5) first."],
        visibleTestCases: [
          { stdin: "fizz_buzz(15)", expectedOutput: "FizzBuzz" },
          { stdin: "fizz_buzz(9)", expectedOutput: "Fizz" }
        ],
        hiddenTestCases: [
          { stdin: "fizz_buzz(10)", expectedOutput: "Buzz" },
          { stdin: "fizz_buzz(7)", expectedOutput: "7" }
        ]
      },
      {
        id: "py-cond-3",
        slug: "ternary-max",
        title: "Ternary Max of Two",
        difficulty: "guided" as WorkoutDifficulty,
        learningObjective: "Use Python one-line ternary conditional syntax.",
        description: "Return maximum of two numbers using `x if cond else y`.",
        instructions: "Implement `max_ternary(a, b)`.",
        starterCode: "def max_ternary(a, b):\n    pass\n",
        solutionCode: "def max_ternary(a, b):\n    return a if a > b else b\n",
        concepts: ["Ternary Expressions"],
        hints: ["Syntax: `a if a > b else b`."],
        visibleTestCases: [{ stdin: "max_ternary(10, 20)", expectedOutput: "20" }],
        hiddenTestCases: [{ stdin: "max_ternary(5, -5)", expectedOutput: "5" }]
      },
      {
        id: "py-cond-4",
        slug: "triangle-validator",
        title: "Valid Triangle Inequality",
        difficulty: "medium",
        learningObjective: "Validate geometry condition: sum of any two sides must exceed the third.",
        description: "Return True if side lengths `a`, `b`, `c` can form a valid triangle.",
        instructions: "Implement `is_valid_triangle(a, b, c)`.",
        starterCode: "def is_valid_triangle(a, b, c):\n    pass\n",
        solutionCode: "def is_valid_triangle(a, b, c):\n    return a > 0 and b > 0 and c > 0 and (a + b > c) and (a + c > b) and (b + c > a)\n",
        concepts: ["Compound Conditions"],
        hints: ["Ensure all sides > 0 and check (a+b>c), (a+c>b), (b+c>a)."],
        visibleTestCases: [
          { stdin: "is_valid_triangle(3, 4, 5)", expectedOutput: "True" },
          { stdin: "is_valid_triangle(1, 2, 3)", expectedOutput: "False" }
        ],
        hiddenTestCases: [{ stdin: "is_valid_triangle(0, 4, 4)", expectedOutput: "False" }]
      },
      {
        id: "py-cond-5",
        slug: "ticket-pricing",
        title: "Cinema Ticket Tier Pricing",
        difficulty: "medium",
        learningObjective: "Multi-parameter branching with age and student status.",
        description: "Age < 12: $8, Age >= 65: $10, Student (is_student=True): $9, Standard: $15.",
        instructions: "Implement `get_ticket_price(age, is_student)`.",
        starterCode: "def get_ticket_price(age, is_student):\n    pass\n",
        solutionCode: "def get_ticket_price(age, is_student):\n    if age < 12: return 8\n    if age >= 65: return 10\n    if is_student: return 9\n    return 15\n",
        concepts: ["Branching", "Booleans"],
        hints: ["Check age discounts first, then student discount."],
        visibleTestCases: [
          { stdin: "get_ticket_price(10, False)", expectedOutput: "8" },
          { stdin: "get_ticket_price(22, True)", expectedOutput: "9" }
        ],
        hiddenTestCases: [{ stdin: "get_ticket_price(30, False)", expectedOutput: "15" }]
      }
    ]
  },
  {
    slug: "loops",
    title: "7. Loops & Iterations",
    belt: "yellow",
    orderIndex: 7,
    description: "for loops, while loops, range(), break, continue, and accumulator loops.",
    learningObjective: "Execute controlled iterations, guard loop bounds, and prevent off-by-one errors.",
    explanation: "`range(start, stop, step)` generates non-inclusive sequence integers.",
    commonMistakes: [
      "Off-by-one in range upper bound",
      "Infinite while loops without state mutation",
      "Modifying a list while iterating over it"
    ],
    prerequisites: ["conditions"],
    workouts: [
      {
        id: "py-loop-1",
        slug: "find-the-largest-number",
        title: "Find the Largest Number",
        difficulty: "easy",
        learningObjective: "Iterate through a list to track running maximum without max().",
        description: "Given a non-empty list of integers, return the largest value.",
        instructions: "Implement `find_max(numbers)` without using built-in `max()`.",
        starterCode: "def find_max(numbers):\n    # Write your loop here\n    pass\n",
        solutionCode: "def find_max(numbers):\n    largest = numbers[0]\n    for num in numbers[1:]:\n        if num > largest:\n            largest = num\n    return largest\n",
        concepts: ["Loops", "Accumulators", "Comparisons"],
        hints: [
          "Initialize `largest = numbers[0]`.",
          "Iterate over the remaining numbers.",
          "Update `largest` if the current number is bigger."
        ],
        visibleTestCases: [
          { stdin: "find_max([3, 9, 2, 7, 5])", expectedOutput: "9" },
          { stdin: "find_max([-10, -3, -50, -1])", expectedOutput: "-1" }
        ],
        hiddenTestCases: [{ stdin: "find_max([42])", expectedOutput: "42" }]
      },
      {
        id: "py-loop-2",
        slug: "even-index-filter",
        title: "Filter Elements at Even Indices",
        difficulty: "easy",
        learningObjective: "Use range stepping `range(0, len(items), 2)`.",
        description: "Return a new list containing elements found at even indices (0, 2, 4...).",
        instructions: "Implement `even_indexed_elements(items)`.",
        starterCode: "def even_indexed_elements(items):\n    pass\n",
        solutionCode: "def even_indexed_elements(items):\n    return [items[i] for i in range(0, len(items), 2)]\n",
        concepts: ["Loops", "Indexing", "range() step"],
        hints: ["Use `range(0, len(items), 2)` or slicing `items[::2]`."],
        visibleTestCases: [
          { stdin: "even_indexed_elements(['a', 'b', 'c', 'd', 'e'])", expectedOutput: "['a', 'c', 'e']" }
        ],
        hiddenTestCases: [{ stdin: "even_indexed_elements([10, 20])", expectedOutput: "[10]" }]
      },
      {
        id: "py-loop-3",
        slug: "sum-of-evens",
        title: "Sum of Even Numbers in Range",
        difficulty: "easy",
        learningObjective: "Accumulate sum of numbers matching condition.",
        description: "Calculate sum of all even integers from `start` to `end` inclusive.",
        instructions: "Implement `sum_evens(start, end)`.",
        starterCode: "def sum_evens(start, end):\n    pass\n",
        solutionCode: "def sum_evens(start, end):\n    total = 0\n    for n in range(start, end + 1):\n        if n % 2 == 0:\n            total += n\n    return total\n",
        concepts: ["range() inclusive", "Accumulators"],
        hints: ["Remember `range(start, end + 1)` to include the `end` number."],
        visibleTestCases: [{ stdin: "sum_evens(1, 10)", expectedOutput: "30" }],
        hiddenTestCases: [{ stdin: "sum_evens(4, 4)", expectedOutput: "4" }]
      },
      {
        id: "py-loop-4",
        slug: "reverse-string-loop",
        title: "Reverse String with Loop",
        difficulty: "medium",
        learningObjective: "Prepend characters to an accumulator string.",
        description: "Reverse a string manually using a for-loop without `[::-1]`.",
        instructions: "Implement `reverse_string_loop(s)`.",
        starterCode: "def reverse_string_loop(s):\n    pass\n",
        solutionCode: "def reverse_string_loop(s):\n    result = ''\n    for ch in s:\n        result = ch + result\n    return result\n",
        concepts: ["String Accumulation", "Reversal"],
        hints: ["Notice `ch + result` prepends each character."],
        visibleTestCases: [{ stdin: "reverse_string_loop('dojo')", expectedOutput: "ojod" }],
        hiddenTestCases: [{ stdin: "reverse_string_loop('a')", expectedOutput: "a" }]
      },
      {
        id: "py-loop-5",
        slug: "count-vowels",
        title: "Count Vowels in String",
        difficulty: "medium",
        learningObjective: "Count occurrences of elements in a set.",
        description: "Count total vowels (a, e, i, o, u) in string `text` case-insensitively.",
        instructions: "Implement `count_vowels(text)`.",
        starterCode: "def count_vowels(text):\n    pass\n",
        solutionCode: "def count_vowels(text):\n    vowels = set('aeiou')\n    return sum(1 for ch in text.lower() if ch in vowels)\n",
        concepts: ["Set Membership", "Loops"],
        hints: ["Convert to `.lower()` and check `ch in 'aeiou'`."],
        visibleTestCases: [{ stdin: "count_vowels('Hello World')", expectedOutput: "3" }],
        hiddenTestCases: [{ stdin: "count_vowels('rhythm')", expectedOutput: "0" }]
      }
    ]
  },
  {
    slug: "functions",
    title: "8. Functions & Scope",
    belt: "orange",
    orderIndex: 8,
    description: "def, return vs print, positional/keyword arguments, default values, and LEGB scope.",
    learningObjective: "Design modular functions with distinct local scopes and pure return values.",
    explanation: "Functions in Python encapsulate reusable logic. Arguments are passed by assignment/reference.",
    commonMistakes: [
      "Printing instead of returning a computed value",
      "Using mutable default arguments (e.g. `items=[]`)"
    ],
    prerequisites: ["loops"],
    workouts: [
      {
        id: "py-func-1",
        slug: "clamp-number",
        title: "Clamp Number Utility",
        difficulty: "easy",
        learningObjective: "Constrain a number between a lower and upper bound.",
        description: "Return `val` clamped to `[low, high]`.",
        instructions: "Implement `clamp(val, low, high)`.",
        starterCode: "def clamp(val, low, high):\n    pass\n",
        solutionCode: "def clamp(val, low, high):\n    if val < low: return low\n    if val > high: return high\n    return val\n",
        concepts: ["Functions", "Boundary Clamping"],
        hints: ["Return `low` if `val < low`, `high` if `val > high`, else `val`."],
        visibleTestCases: [
          { stdin: "clamp(15, 0, 10)", expectedOutput: "10" },
          { stdin: "clamp(-5, 0, 10)", expectedOutput: "0" }
        ],
        hiddenTestCases: [{ stdin: "clamp(7, 0, 10)", expectedOutput: "7" }]
      },
      {
        id: "py-func-2",
        slug: "safe-divide",
        title: "Safe Division with Default",
        difficulty: "easy",
        learningObjective: "Handle division by zero with a default fallback argument.",
        description: "Divide `a / b`. If `b == 0`, return `default_val` (defaults to 0.0).",
        instructions: "Implement `safe_divide(a, b, default_val=0.0)`.",
        starterCode: "def safe_divide(a, b, default_val=0.0):\n    pass\n",
        solutionCode: "def safe_divide(a, b, default_val=0.0):\n    if b == 0:\n        return default_val\n    return a / b\n",
        concepts: ["Default Arguments", "Zero Division"],
        hints: ["Check if `b == 0` first."],
        visibleTestCases: [
          { stdin: "safe_divide(10, 2)", expectedOutput: "5.0" },
          { stdin: "safe_divide(10, 0, -1.0)", expectedOutput: "-1.0" }
        ],
        hiddenTestCases: [{ stdin: "safe_divide(5, 0)", expectedOutput: "0.0" }]
      },
      {
        id: "py-func-3",
        slug: "multiplier-factory",
        title: "Function Factory (Closure)",
        difficulty: "hard",
        learningObjective: "Return a closure function capturing outer scope factor.",
        description: "Return a function that multiplies its input by `factor`.",
        instructions: "Implement `make_multiplier(factor)`.",
        starterCode: "def make_multiplier(factor):\n    pass\n",
        solutionCode: "def make_multiplier(factor):\n    def multiplier(n):\n        return n * factor\n    return multiplier\n",
        concepts: ["Closures", "Higher-Order Functions"],
        hints: ["Define an inner function `def mult(n): return n * factor` and return it."],
        visibleTestCases: [{ stdin: "make_multiplier(3)(5)", expectedOutput: "15" }],
        hiddenTestCases: [{ stdin: "make_multiplier(0)(100)", expectedOutput: "0" }]
      },
      {
        id: "py-func-4",
        slug: "variable-args-sum",
        title: "Variadic Arguments (*args)",
        difficulty: "medium",
        learningObjective: "Accept arbitrary positional arguments with `*args`.",
        description: "Return the product of all passed positional numbers. Return 1 if empty.",
        instructions: "Implement `product(*args)`.",
        starterCode: "def product(*args):\n    pass\n",
        solutionCode: "def product(*args):\n    total = 1\n    for n in args:\n        total *= n\n    return total\n",
        concepts: ["*args", "Variadic Functions"],
        hints: ["Iterate through `args` multiplying an accumulator initialized to 1."],
        visibleTestCases: [
          { stdin: "product(2, 3, 4)", expectedOutput: "24" },
          { stdin: "product()", expectedOutput: "1" }
        ],
        hiddenTestCases: [{ stdin: "product(-2, 5)", expectedOutput: "-10" }]
      },
      {
        id: "py-func-5",
        slug: "apply-pipeline",
        title: "Function Pipeline Applicator",
        difficulty: "hard",
        learningObjective: "Pass functions as first-class citizens through a pipeline.",
        description: "Apply a list of single-argument functions sequentially to `initial_value`.",
        instructions: "Implement `pipeline(initial_value, functions)`.",
        starterCode: "def pipeline(initial_value, functions):\n    pass\n",
        solutionCode: "def pipeline(initial_value, functions):\n    val = initial_value\n    for f in functions:\n        val = f(val)\n    return val\n",
        concepts: ["First-Class Functions", "Pipelines"],
        hints: ["Loop through `functions` and update `val = f(val)`."],
        visibleTestCases: [
          { stdin: "pipeline(5, [lambda x: x + 1, lambda x: x * 2])", expectedOutput: "12" }
        ],
        hiddenTestCases: [{ stdin: "pipeline(10, [])", expectedOutput: "10" }]
      }
    ]
  },
  {
    slug: "strings",
    title: "9. String Manipulation & Slicing",
    belt: "orange",
    orderIndex: 9,
    description: "Slicing, string methods, stripping, splitting, joins, and character inspection.",
    learningObjective: "Manipulate strings immutably using standard library methods.",
    explanation: "Strings are immutable sequences. All modifications produce new string instances.",
    commonMistakes: ["Trying in-place character assignment: `s[0] = 'a'` is illegal"],
    prerequisites: ["functions"],
    workouts: [
      {
        id: "py-str-1",
        slug: "is-palindrome",
        title: "Palindrome Verification",
        difficulty: "easy",
        learningObjective: "Verify if cleaned string reads identically backwards.",
        description: "Return True if `text` is palindrome ignoring case and non-alphanumerics.",
        instructions: "Implement `is_palindrome(text)`.",
        starterCode: "def is_palindrome(text):\n    pass\n",
        solutionCode: "def is_palindrome(text):\n    cleaned = ''.join(ch.lower() for ch in text if ch.isalnum())\n    return cleaned == cleaned[::-1]\n",
        concepts: ["Slicing", "isalnum()"],
        hints: ["Clean the string with `ch.isalnum()` and check `cleaned == cleaned[::-1]`."],
        visibleTestCases: [
          { stdin: "is_palindrome('A man, a plan, a canal: Panama')", expectedOutput: "True" },
          { stdin: "is_palindrome('race a car')", expectedOutput: "False" }
        ],
        hiddenTestCases: [{ stdin: "is_palindrome('')", expectedOutput: "True" }]
      },
      {
        id: "py-str-2",
        slug: "truncate-string",
        title: "Truncate String with Ellipsis",
        difficulty: "easy",
        learningObjective: "Slice strings to max length with '...' suffix if truncated.",
        description: "If `len(s) > max_len`, truncate to `max_len - 3` and append '...'.",
        instructions: "Implement `truncate(s, max_len)`.",
        starterCode: "def truncate(s, max_len):\n    pass\n",
        solutionCode: "def truncate(s, max_len):\n    if len(s) <= max_len: return s\n    return s[:max_len - 3] + '...'\n",
        concepts: ["Slicing", "len()"],
        hints: ["Use `s[:max_len - 3] + '...'`."],
        visibleTestCases: [
          { stdin: "truncate('Hello Dojo Master', 10)", expectedOutput: "Hello D..." }
        ],
        hiddenTestCases: [{ stdin: "truncate('Short', 10)", expectedOutput: "Short" }]
      },
      {
        id: "py-str-3",
        slug: "title-case-custom",
        title: "Capitalize Words",
        difficulty: "medium",
        learningObjective: "Split string, capitalize first letters, and rejoin.",
        description: "Capitalize the first letter of every word separated by spaces.",
        instructions: "Implement `capitalize_words(sentence)` without using `.title()`.",
        starterCode: "def capitalize_words(sentence):\n    pass\n",
        solutionCode: "def capitalize_words(sentence):\n    return ' '.join(word.capitalize() for word in sentence.split(' '))\n",
        concepts: ["split()", "capitalize()", "join()"],
        hints: ["Split on space, apply `.capitalize()` to each word, then `' '.join()`."],
        visibleTestCases: [{ stdin: "capitalize_words('python coding dojo')", expectedOutput: "Python Coding Dojo" }],
        hiddenTestCases: [{ stdin: "capitalize_words('single')", expectedOutput: "Single" }]
      },
      {
        id: "py-str-4",
        slug: "compress-string",
        title: "Run-Length String Compression",
        difficulty: "hard",
        learningObjective: "Compress repeated character sequences into counts.",
        description: "Convert 'aabcccccaaa' into 'a2b1c5a3'. If compressed is not shorter, return original.",
        instructions: "Implement `compress_string(s)`.",
        starterCode: "def compress_string(s):\n    pass\n",
        solutionCode: "def compress_string(s):\n    if not s: return ''\n    res = []\n    curr, count = s[0], 1\n    for ch in s[1:]:\n        if ch == curr:\n            count += 1\n        else:\n            res.append(f'{curr}{count}')\n            curr, count = ch, 1\n    res.append(f'{curr}{count}')\n    comp = ''.join(res)\n    return comp if len(comp) < len(s) else s\n",
        concepts: ["Compression", "String Building"],
        hints: ["Track current character and consecutive count."],
        visibleTestCases: [{ stdin: "compress_string('aabcccccaaa')", expectedOutput: "a2b1c5a3" }],
        hiddenTestCases: [{ stdin: "compress_string('abc')", expectedOutput: "abc" }]
      },
      {
        id: "py-str-5",
        slug: "anagram-check",
        title: "Valid Anagrams",
        difficulty: "medium",
        learningObjective: "Compare letter distributions of two words.",
        description: "Return True if `s1` and `s2` are anagrams (ignoring case and whitespace).",
        instructions: "Implement `is_anagram(s1, s2)`.",
        starterCode: "def is_anagram(s1, s2):\n    pass\n",
        solutionCode: "def is_anagram(s1, s2):\n    c1 = sorted(s1.lower().replace(' ', ''))\n    c2 = sorted(s2.lower().replace(' ', ''))\n    return c1 == c2\n",
        concepts: ["sorted()", "replace()"],
        hints: ["Sort the characters of both cleaned strings and compare."],
        visibleTestCases: [
          { stdin: "is_anagram('Listen', 'Silent')", expectedOutput: "True" },
          { stdin: "is_anagram('Dojo', 'Java')", expectedOutput: "False" }
        ],
        hiddenTestCases: [{ stdin: "is_anagram('dormitory', 'dirty room')", expectedOutput: "True" }]
      }
    ]
  },
  {
    slug: "lists",
    title: "10. Lists & Sequences",
    belt: "green",
    orderIndex: 10,
    description: "List comprehensions, slicing, indexing, sorting, appending, and in-place methods.",
    learningObjective: "Master dynamic list manipulations, transformations, and comprehensions.",
    explanation: "Lists are mutable ordered sequences in Python.",
    commonMistakes: [
      "Modifying lists while iterating with index",
      "Calling `arr.sort()` and expecting a returned list instead of `None`"
    ],
    prerequisites: ["strings"],
    workouts: [
      {
        id: "py-list-1",
        slug: "remove-duplicates-ordered",
        title: "Remove Duplicates Preserve Order",
        difficulty: "medium",
        learningObjective: "Deduplicate items while maintaining initial sequence ordering.",
        description: "Return a new list containing elements of `items` with duplicates removed in original order.",
        instructions: "Implement `dedup_ordered(items)`.",
        starterCode: "def dedup_ordered(items):\n    pass\n",
        solutionCode: "def dedup_ordered(items):\n    seen = set()\n    res = []\n    for x in items:\n        if x not in seen:\n            seen.add(x)\n            res.append(x)\n    return res\n",
        concepts: ["Sets", "List Preservation"],
        hints: ["Use a set to track seen items and append novel items to a result list."],
        visibleTestCases: [
          { stdin: "dedup_ordered([1, 2, 2, 3, 4, 1, 5])", expectedOutput: "[1, 2, 3, 4, 5]" }
        ],
        hiddenTestCases: [{ stdin: "dedup_ordered(['a', 'b', 'a'])", expectedOutput: "['a', 'b']" }]
      },
      {
        id: "py-list-2",
        slug: "chunk-list",
        title: "Chunk List into Fixed Sizes",
        difficulty: "medium",
        learningObjective: "Slice lists into sub-arrays of maximum size `k`.",
        description: "Break `lst` into chunks of size `k`.",
        instructions: "Implement `chunk(lst, k)`.",
        starterCode: "def chunk(lst, k):\n    pass\n",
        solutionCode: "def chunk(lst, k):\n    return [lst[i:i + k] for i in range(0, len(lst), k)]\n",
        concepts: ["List Comprehension", "Slicing"],
        hints: ["Use `[lst[i:i+k] for i in range(0, len(lst), k)]`."],
        visibleTestCases: [
          { stdin: "chunk([1, 2, 3, 4, 5], 2)", expectedOutput: "[[1, 2], [3, 4], [5]]" }
        ],
        hiddenTestCases: [{ stdin: "chunk([], 3)", expectedOutput: "[]" }]
      },
      {
        id: "py-list-3",
        slug: "flatten-nested-list",
        title: "Flatten 2D List",
        difficulty: "medium",
        learningObjective: "Transform a 2D matrix into a 1D flat list.",
        description: "Given a list of lists `matrix`, return a flattened list.",
        instructions: "Implement `flatten(matrix)`.",
        starterCode: "def flatten(matrix):\n    pass\n",
        solutionCode: "def flatten(matrix):\n    return [item for row in matrix for item in row]\n",
        concepts: ["Nested Comprehensions"],
        hints: ["Use `[item for row in matrix for item in row]`."],
        visibleTestCases: [
          { stdin: "flatten([[1, 2], [3, 4], [5]])", expectedOutput: "[1, 2, 3, 4, 5]" }
        ],
        hiddenTestCases: [{ stdin: "flatten([[], [1]])", expectedOutput: "[1]" }]
      },
      {
        id: "py-list-4",
        slug: "rotate-list",
        title: "Rotate List by K Steps",
        difficulty: "hard",
        learningObjective: "Rotate list elements right by `k` positions.",
        description: "Rotate list right by `k` steps using slicing.",
        instructions: "Implement `rotate(lst, k)`.",
        starterCode: "def rotate(lst, k):\n    pass\n",
        solutionCode: "def rotate(lst, k):\n    if not lst: return []\n    k = k % len(lst)\n    return lst[-k:] + lst[:-k] if k > 0 else lst[:]\n",
        concepts: ["Modulo", "Slicing"],
        hints: ["Normalize `k = k % len(lst)` and combine `lst[-k:] + lst[:-k]`."],
        visibleTestCases: [
          { stdin: "rotate([1, 2, 3, 4, 5], 2)", expectedOutput: "[4, 5, 1, 2, 3]" }
        ],
        hiddenTestCases: [{ stdin: "rotate([1, 2], 3)", expectedOutput: "[2, 1]" }]
      },
      {
        id: "py-list-5",
        slug: "second-largest-element",
        title: "Second Largest Distinct Value",
        difficulty: "hard",
        learningObjective: "Find the 2nd distinct maximum without full sorting overhead.",
        description: "Return the 2nd largest distinct number from list `nums`. Return None if fewer than 2 distinct numbers.",
        instructions: "Implement `second_largest(nums)`.",
        starterCode: "def second_largest(nums):\n    pass\n",
        solutionCode: "def second_largest(nums):\n    unique = sorted(set(nums))\n    return unique[-2] if len(unique) >= 2 else None\n",
        concepts: ["Distinct Sets", "Sorting"],
        hints: ["Deduplicate with `set()`, sort, and select index `[-2]`."],
        visibleTestCases: [
          { stdin: "second_largest([10, 20, 4, 45, 99])", expectedOutput: "45" },
          { stdin: "second_largest([5, 5, 5])", expectedOutput: "None" }
        ],
        hiddenTestCases: [{ stdin: "second_largest([1, 2])", expectedOutput: "1" }]
      }
    ]
  },
  {
    slug: "tuples",
    title: "11. Tuples & Immutability",
    belt: "green",
    orderIndex: 11,
    description: "Immutability, tuple packing/unpacking, and use as dictionary keys.",
    learningObjective: "Utilize tuples for fixed records and immutable data structures.",
    explanation: "Tuples are immutable sequences, useful for fixed heterogeneous records.",
    commonMistakes: ["Attempting `.append()` or element mutation on tuples"],
    prerequisites: ["lists"],
    workouts: [
      {
        id: "py-tup-1",
        slug: "unpack-record",
        title: "Unpack Coordinate Record",
        difficulty: "easy",
        learningObjective: "Unpack 3D point tuples and calculate Euclidean distance from origin.",
        description: "Given `point = (x, y, z)`, return `round((x**2 + y**2 + z**2)**0.5, 2)`.",
        instructions: "Implement `distance_from_origin(point)`.",
        starterCode: "def distance_from_origin(point):\n    pass\n",
        solutionCode: "def distance_from_origin(point):\n    x, y, z = point\n    return round((x**2 + y**2 + z**2) ** 0.5, 2)\n",
        concepts: ["Tuple Unpacking", "Math"],
        hints: ["Unpack with `x, y, z = point`."],
        visibleTestCases: [{ stdin: "distance_from_origin((1, 2, 2))", expectedOutput: "3.0" }],
        hiddenTestCases: [{ stdin: "distance_from_origin((0, 0, 0))", expectedOutput: "0.0" }]
      }
    ]
  },
  {
    slug: "sets",
    title: "12. Sets & Hash Sets",
    belt: "green",
    orderIndex: 12,
    description: "Unique collections, union, intersection, difference, and O(1) lookups.",
    learningObjective: "Perform high-performance membership and set-theoretic operations.",
    explanation: "Sets store unique, hashable elements with average O(1) lookup time.",
    commonMistakes: ["Attempting to index a set `s[0]` (sets are unordered)"],
    prerequisites: ["tuples"],
    workouts: [
      {
        id: "py-set-1",
        slug: "common-elements-intersection",
        title: "Intersection of Two Lists",
        difficulty: "easy",
        learningObjective: "Find intersection of two collections with `set.intersection()`.",
        description: "Return sorted list of common elements between `l1` and `l2`.",
        instructions: "Implement `common_elements(l1, l2)`.",
        starterCode: "def common_elements(l1, l2):\n    pass\n",
        solutionCode: "def common_elements(l1, l2):\n    return sorted(list(set(l1) & set(l2)))\n",
        concepts: ["Set Operations", "& Operator"],
        hints: ["Use `set(l1) & set(l2)` and sort."],
        visibleTestCases: [{ stdin: "common_elements([1, 2, 3], [2, 3, 4])", expectedOutput: "[2, 3]" }],
        hiddenTestCases: [{ stdin: "common_elements([1, 2], [3, 4])", expectedOutput: "[]" }]
      }
    ]
  },
  {
    slug: "dictionaries",
    title: "13. Dictionaries & Key-Value Stores",
    belt: "blue",
    orderIndex: 13,
    description: "Hash maps, key-value mappings, dict comprehensions, `.get()`, and iteration.",
    learningObjective: "Construct, query, and aggregate associative data mappings.",
    explanation: "Dictionaries store key-value pairs with O(1) average access.",
    commonMistakes: ["Direct key lookup `d[key]` triggering KeyError instead of `d.get(key)`"],
    prerequisites: ["sets"],
    workouts: [
      {
        id: "py-dict-1",
        slug: "word-frequency-counter",
        title: "Word Frequency Counter",
        difficulty: "medium",
        learningObjective: "Build a frequency dictionary from tokenized words.",
        description: "Return a dictionary of word counts for words in `sentence` ignoring case.",
        instructions: "Implement `word_frequency(sentence)`.",
        starterCode: "def word_frequency(sentence):\n    pass\n",
        solutionCode: "def word_frequency(sentence):\n    counts = {}\n    for word in sentence.lower().split():\n        counts[word] = counts.get(word, 0) + 1\n    return counts\n",
        concepts: ["dict.get()", "Frequency Counters"],
        hints: ["Use `counts[word] = counts.get(word, 0) + 1`."],
        visibleTestCases: [
          { stdin: "word_frequency('dojo ai is dojo')", expectedOutput: "{'dojo': 2, 'ai': 1, 'is': 1}" }
        ],
        hiddenTestCases: [{ stdin: "word_frequency('')", expectedOutput: "{}" }]
      }
    ]
  },
  {
    slug: "exceptions",
    title: "14. Exception Handling",
    belt: "blue",
    orderIndex: 14,
    description: "try, except, else, finally, raising custom exceptions, and error recovery.",
    learningObjective: "Build resilient programs with graceful error recovery.",
    explanation: "Exceptions allow capturing runtime errors cleanly without process termination.",
    commonMistakes: ["Using bare `except:` instead of catching specific exception types"],
    prerequisites: ["dictionaries"],
    workouts: [
      {
        id: "py-exc-1",
        slug: "safe-int-parse",
        title: "Safe Integer Parsing",
        difficulty: "easy",
        learningObjective: "Catch ValueError when parsing string inputs.",
        description: "Parse string `s` to integer. Return `default` if ValueError occurs.",
        instructions: "Implement `safe_int(s, default=0)`.",
        starterCode: "def safe_int(s, default=0):\n    pass\n",
        solutionCode: "def safe_int(s, default=0):\n    try:\n        return int(s)\n    except (ValueError, TypeError):\n        return default\n",
        concepts: ["try-except", "ValueError"],
        hints: ["Wrap `int(s)` inside try-except block."],
        visibleTestCases: [
          { stdin: "safe_int('42')", expectedOutput: "42" },
          { stdin: "safe_int('bad', -1)", expectedOutput: "-1" }
        ],
        hiddenTestCases: [{ stdin: "safe_int(None, 0)", expectedOutput: "0" }]
      }
    ]
  },
  {
    slug: "files",
    title: "15. File I/O & Streams",
    belt: "blue",
    orderIndex: 15,
    description: "open(), context managers (`with`), reading, writing, and encoding.",
    learningObjective: "Safely read and write file streams using context managers.",
    explanation: "`with open(...)` guarantees resource cleanup even if exceptions occur.",
    commonMistakes: ["Forgetting to close open file handles when not using `with`"],
    prerequisites: ["exceptions"],
    workouts: [
      {
        id: "py-file-1",
        slug: "count-lines-stream",
        title: "Line Stream Counter",
        difficulty: "easy",
        learningObjective: "Process text stream string lines.",
        description: "Count total non-empty lines in a multiline string `stream`.",
        instructions: "Implement `count_lines(stream)`.",
        starterCode: "def count_lines(stream):\n    pass\n",
        solutionCode: "def count_lines(stream):\n    return sum(1 for line in stream.splitlines() if line.strip())\n",
        concepts: ["splitlines()", "Streams"],
        hints: ["Use `stream.splitlines()`."],
        visibleTestCases: [{ stdin: "count_lines('a\\nb\\n\\nc')", expectedOutput: "3" }],
        hiddenTestCases: [{ stdin: "count_lines('')", expectedOutput: "0" }]
      }
    ]
  },
  {
    slug: "modules",
    title: "16. Modules & Standard Library",
    belt: "purple",
    orderIndex: 16,
    description: "import statements, math, collections, itertools, json, and datetime.",
    learningObjective: "Leverage standard library modules for robust algorithmic solutions.",
    explanation: "Python includes 'batteries included' standard libraries.",
    commonMistakes: ["Polluting global namespace with `from module import *`"],
    prerequisites: ["files"],
    workouts: [
      {
        id: "py-mod-1",
        slug: "json-payload-parser",
        title: "JSON Key Extractor",
        difficulty: "easy",
        learningObjective: "Parse JSON strings into Python dictionaries.",
        description: "Parse JSON string `json_str` and extract value for `key`. Return None if key is missing.",
        instructions: "Implement `extract_json_key(json_str, key)`.",
        starterCode: "import json\n\ndef extract_json_key(json_str, key):\n    pass\n",
        solutionCode: "import json\n\ndef extract_json_key(json_str, key):\n    try:\n        data = json.loads(json_str)\n        return data.get(key)\n    except Exception:\n        return None\n",
        concepts: ["json.loads", "Standard Library"],
        hints: ["Use `json.loads(json_str)`."],
        visibleTestCases: [
          { stdin: "extract_json_key('{\"belt\": \"yellow\"}', 'belt')", expectedOutput: "yellow" }
        ],
        hiddenTestCases: [{ stdin: "extract_json_key('invalid', 'belt')", expectedOutput: "None" }]
      }
    ]
  },
  {
    slug: "oop",
    title: "17. Object-Oriented Programming (OOP)",
    belt: "purple",
    orderIndex: 17,
    description: "Classes, instances, __init__, methods, encapsulation, and inheritance.",
    learningObjective: "Model domains using classes, attributes, methods, and clean OOP state.",
    explanation: "Classes define templates for creating objects that combine state and behavior.",
    commonMistakes: ["Forgetting `self` as the first parameter of instance methods"],
    prerequisites: ["modules"],
    workouts: [
      {
        id: "py-oop-1",
        slug: "bank-account-class",
        title: "Bank Account Class",
        difficulty: "medium",
        learningObjective: "Create a class with balance state, deposit, and withdraw methods.",
        description: "Implement class `BankAccount` with `deposit(amt)` and `withdraw(amt)`.",
        instructions: "Implement `BankAccount` class. Raise ValueError on insufficient funds.",
        starterCode: "class BankAccount:\n    def __init__(self, initial_balance=0):\n        self.balance = initial_balance\n        \n    def deposit(self, amount):\n        pass\n        \n    def withdraw(self, amount):\n        pass\n",
        solutionCode: "class BankAccount:\n    def __init__(self, initial_balance=0):\n        self.balance = initial_balance\n        \n    def deposit(self, amount):\n        self.balance += amount\n        return self.balance\n        \n    def withdraw(self, amount):\n        if amount > self.balance:\n            raise ValueError('Insufficient funds')\n        self.balance -= amount\n        return self.balance\n",
        concepts: ["Classes", "Encapsulation", "State"],
        hints: ["Update `self.balance` inside instance methods."],
        visibleTestCases: [
          { stdin: "acc = BankAccount(100); acc.deposit(50); acc.withdraw(30); acc.balance", expectedOutput: "120" }
        ],
        hiddenTestCases: [
          { stdin: "acc = BankAccount(50); acc.deposit(0); acc.balance", expectedOutput: "50" }
        ]
      }
    ]
  },
  {
    slug: "problem-solving",
    title: "18. Algorithmic Problem Solving",
    belt: "brown",
    orderIndex: 18,
    description: "Two-pointer techniques, sliding windows, hash frequency lookups, and edge handling.",
    learningObjective: "Solve algorithmic interview and competition problems with optimal time complexity.",
    explanation: "Combine all prior Python fundamentals to solve real algorithmic problems.",
    commonMistakes: ["Quadratic O(N^2) brute force when O(N) hash map is available"],
    prerequisites: ["oop"],
    workouts: [
      {
        id: "py-algo-1",
        slug: "two-sum-target",
        title: "Two Sum Target Indices",
        difficulty: "hard",
        learningObjective: "Find pair of indices that sum to target in O(N) time with a hash map.",
        description: "Given `nums` and `target`, return indices `[i, j]` of two numbers summing to target.",
        instructions: "Implement `two_sum(nums, target)`.",
        starterCode: "def two_sum(nums, target):\n    pass\n",
        solutionCode: "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i\n    return []\n",
        concepts: ["Hash Map", "O(N) Complexity", "Two Sum"],
        hints: ["Maintain `seen[num] = index` and check `target - num` on each iteration."],
        visibleTestCases: [
          { stdin: "two_sum([2, 7, 11, 15], 9)", expectedOutput: "[0, 1]" },
          { stdin: "two_sum([3, 2, 4], 6)", expectedOutput: "[1, 2]" }
        ],
        hiddenTestCases: [{ stdin: "two_sum([3, 3], 6)", expectedOutput: "[0, 1]" }]
      }
    ]
  }
];
