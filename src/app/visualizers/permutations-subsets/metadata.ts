import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'permutations-subsets',
  title: 'Permutations & Subsets',
  category: 'Backtracking',
  difficulty: 'Medium',
  description: 'Generates all possible permutations or subsets (powerset) of a given set of elements, typically using backtracking.',
  longDescription: `Permutations and Subsets are fundamental combinatorial problems often solved using backtracking or recursive techniques. They involve finding all possible arrangements or combinations of elements from a given set.

### Permutations
A **permutation** of a set of distinct items is an arrangement of those items into a particular sequence or order. If the set has N distinct items, there are N! (N factorial) possible permutations. For example, for the set \`{1, 2, 3}\`, the permutations are \`[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]\`.

**Algorithm (Backtracking for Permutations):**
1.  **Base Case**: If all elements from the input set have been used to form the current permutation, then this permutation is a complete solution. Add it to the list of results.
2.  **Recursive Step**: Iterate through each element in the set of *remaining* (unused) elements:
    a.  **Choose**: Select an unused element and add it to the current permutation being built.
    b.  **Explore**: Recursively call the function with the updated current permutation and the set of remaining elements (excluding the one just chosen).
    c.  **Unchoose (Backtrack)**: After the recursive call returns (meaning all permutations starting with the current prefix have been explored), remove the element chosen in step 2a from the current permutation. This allows the loop to select a different element for that position in the next iteration.

### Subsets (Powerset)
The **powerset** of a set S is the set of all possible subsets of S, including the empty set and the set S itself. If a set has N items, it has 2^N possible subsets. For example, for the set \`{1, 2, 3}\`, the subsets are \`[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]\`.

**Algorithm (Backtracking for Subsets):**
1.  **Define State**: The recursive function often takes the current index in the input array (to decide whether to include \`inputArray[index]\`) and the current subset being built.
2.  **Base Case**: When the index goes beyond the bounds of the input array, it means all elements have been considered. The \`currentSubset\` at this point is one valid subset. Add it to the list of results.
3.  **Recursive Step** (For each element \`inputArray[index]\`):
    a.  **Exclude**: Make a recursive call for the next element (\`index + 1\`) *without* including the current element (\`inputArray[index]\`) in \`currentSubset\`.
    b.  **Include**:
        i.  Add \`inputArray[index]\` to \`currentSubset\`.
        ii. Make a recursive call for the next element (\`index + 1\`) *with* the current element included.
        iii. **Unchoose (Backtrack)**: Remove \`inputArray[index]\` from \`currentSubset\` to revert the state for other branches of the recursion (specifically for the "exclude" path of its caller).

**Alternative Iterative Approach for Subsets:**
1.  Start with an empty set in the result list: \`results = [[]]\`.
2.  For each element \`elem\` in the input set:
    a.  Create new subsets by adding \`elem\` to each of the existing subsets currently in \`results\`.
    b.  Add all these newly created subsets to \`results\`.

### Characteristics:
-   **Backtracking**: Both problems are classic examples of backtracking where choices are made, explored, and then undone to explore other possibilities.
-   **Combinatorial Explosion**: The number of permutations (N!) and subsets (2^N) grows very rapidly with N. These algorithms are feasible only for relatively small N.

### Time and Space Complexity:
-   **Permutations**:
    *   Time: O(N \* N!) because there are N! permutations, and it takes O(N) time to construct/copy each permutation.
    *   Space: O(N) for the recursion call stack depth (excluding the space for storing all N! permutations, which is O(N \* N!)).
-   **Subsets**:
    *   Time: O(N \* 2^N) because there are 2^N subsets, and it can take O(N) time to construct/copy each subset.
    *   Space: O(N) for the recursion call stack depth (excluding the space for storing all 2^N subsets, which can be O(N \* 2^N)).

### Use Cases:
-   Generating all possible arrangements or selections (e.g., password cracking attempts, exploring game states).
-   Solving puzzles that involve trying out combinations or arrangements (e.g., anagrams, Sudoku at a higher level).
-   Used in various optimization and search problems where the entire solution space needs to be explored or sampled.
-   Fundamental concepts in combinatorics and discrete mathematics.

The AlgoVista visualizer demonstrates the backtracking process for generating either permutations or subsets based on user selection.`,
  timeComplexities: {
    best: "Permutations: O(N*N!), Subsets: O(N*2^N) (to generate all)",
    average: "Permutations: O(N*N!), Subsets: O(N*2^N)",
    worst: "Permutations: O(N*N!), Subsets: O(N*2^N)"
  },
  spaceComplexity: "Permutations: O(N) for recursion stack (excluding output storage of O(N*N!)). Subsets: O(N) for recursion stack (excluding output storage of O(N*2^N)).",
};
