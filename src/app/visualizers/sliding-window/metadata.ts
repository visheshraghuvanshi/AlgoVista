
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'sliding-window',
  title: 'Sliding Window Technique',
  category: 'Arrays & Search',
  difficulty: 'Medium',
  description: 'A computational technique that uses a "window" of a fixed or variable size that slides over a data structure, typically an array or string, to solve problems efficiently.',
  longDescription: `The Sliding Window technique is an algorithmic paradigm primarily used for problems involving arrays or strings where we need to find or calculate something among all contiguous subarrays or substrings of a certain size or property. It's a way to transform some O(N²) or O(N³) brute-force solutions into O(N) solutions.

### Core Idea:
A "window" is a contiguous range of elements, defined by a \`start\` and an \`end\` pointer.
-   The \`end\` pointer expands the window by including new elements.
-   The \`start\` pointer shrinks the window by excluding elements from the beginning, typically when a certain condition is met (e.g., window size exceeds a limit, or a property of the window is violated/achieved).
-   At each step, or when the window satisfies specific criteria, we process the elements within the window (e.g., calculate sum, check for distinct characters, update a maximum/minimum).

### Types of Sliding Window Problems:

**1. Fixed-Size Sliding Window:**
   - The size of the window (\`k\`) is predetermined.
   - The window slides one element at a time. To maintain the fixed size, when the \`end\` pointer moves to include a new element, the \`start\` pointer also moves to exclude the element that is now out of the window.
   - **Example Problem**: Find the maximum sum of any contiguous subarray of size \`k\`.
     1.  Calculate the sum of the first \`k\` elements. This is the first window's sum.
     2.  Slide the window: For each subsequent element, subtract the element that's leaving the window from the left and add the new element entering from the right.
     3.  Keep track of the maximum sum found.
   - Visualized as "Max Sum Subarray (Fixed Size K)".

**2. Variable-Size Sliding Window (Dynamic Window):**
   - The size of the window changes dynamically based on problem constraints or conditions.
   - Typically, the \`end\` pointer expands the window.
   - When a condition is met (or violated), the \`start\` pointer is moved to shrink the window until the condition is no longer met (or is satisfied again).
   - **Example Problem**: Find the smallest contiguous subarray whose sum is greater than or equal to a given target \`S\`.
     1.  Initialize \`windowSum = 0\`, \`minLength = Infinity\`, \`windowStart = 0\`.
     2.  Iterate with \`windowEnd\` from 0 to N-1:
         a.  Add \`arr[windowEnd]\` to \`windowSum\`.
         b.  While \`windowSum >= S\`:
             i.  Update \`minLength = min(minLength, windowEnd - windowStart + 1)\`.
             ii. Subtract \`arr[windowStart]\` from \`windowSum\`.
             iii.Increment \`windowStart\`.
   - Visualized as "Min Length Subarray (Sum >= Target)".

### Why it's Efficient:
Each element of the array is added to and removed from the window at most once. This leads to linear time complexity, O(N), for many problems.

### Common Characteristics of Problems Solvable with Sliding Window:
-   Involve arrays, strings, or linked lists.
-   Deal with contiguous subarrays/substrings.
-   Often ask for a maximum, minimum, count, or existence of something within these contiguous segments.
-   The conditions for expanding or shrinking the window are usually based on the properties of the elements currently within the window (e.g., their sum, count of distinct characters, maximum value).

### Advantages:
-   **Time Efficiency**: Often provides O(N) solutions.
-   **Space Efficiency**: Typically uses O(1) or O(k) (where k is related to the window content, like alphabet size for character counts) auxiliary space.

### Disadvantages/Considerations:
-   Not applicable to all array/string problems. The problem must have the "contiguous" subarray/substring property.
-   Careful handling of pointers and window conditions is needed to avoid off-by-one errors or incorrect logic.
-   For problems involving negative numbers in sum-related tasks, the simple shrinking condition for variable-size windows (e.g., \`while windowSum > target\`) might need adjustment if a negative number could later make the sum valid again. The "Min Length Subarray (Sum >= Target)" typically assumes positive numbers for the simple shrinking logic, or a more complex handling for negatives. The "Prefix Sum + HashMap" approach is more robust for sum problems with negatives (see "Subarray Sum Problems" visualizer).

The AlgoVista visualizers for this technique demonstrate both fixed and variable size window scenarios.`,
  timeComplexities: {
    best: "Varies (e.g., O(N) for fixed-size window, O(N) for many variable-size window problems)",
    average: "Varies (typically O(N))",
    worst: "Varies (typically O(N), but can be O(N*k) or O(N^2) if inner operations are costly)"
  },
  spaceComplexity: "Typically O(1) or O(k) where k is alphabet size or window size if storing window elements.",
};
