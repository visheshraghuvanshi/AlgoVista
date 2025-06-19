
// src/app/visualizers/linear-search/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'linear-search',
  title: 'Linear Search',
  category: 'Fundamentals',
  difficulty: 'Easy',
  description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.',
  longDescription: `Linear Search, also known as sequential search, is the most straightforward method for finding a target value within a list or array. It operates by checking each element of the list one by one, in sequence, until either the target value is found or the end of the list is reached.

### How it Works:
1.  **Start at the Beginning**: The search begins at the first element of the data structure (e.g., index 0 for an array).
2.  **Compare**: The current element is compared with the target value.
3.  **Match Found?**:
    *   If the current element matches the target value, the search is successful. The algorithm typically returns the index of the matched element.
    *   If there's no match, the algorithm moves to the next element in the sequence.
4.  **Repeat**: Steps 2 and 3 are repeated for each subsequent element.
5.  **End of List**: If the algorithm reaches the end of the list without finding the target value, the search is unsuccessful. The algorithm then typically returns an indicator that the value was not found (e.g., -1, null, or false).

### Example:
Searching for \`target = 7\` in \`arr = [5, 1, 9, 3, 7, 4]\`
- Compare \`arr[0]\` (5) with 7. No match.
- Compare \`arr[1]\` (1) with 7. No match.
- Compare \`arr[2]\` (9) with 7. No match.
- Compare \`arr[3]\` (3) with 7. No match.
- Compare \`arr[4]\` (7) with 7. Match found! Return index 4.

### Characteristics:
-   **Simplicity**: It is very easy to understand and implement.
-   **Data Structure Agnosticism**: It can be applied to any list-like data structure, regardless of whether it's sorted or unsorted. For linked lists, it's often the only feasible search method without modification.
-   **No Preprocessing Required**: Unlike algorithms like binary search, linear search does not require the data to be sorted beforehand.

### Advantages:
-   Simple to implement.
-   Works on unsorted data.
-   Efficient for very small lists.
-   Can be used when the only operation allowed on the data is sequential access (e.g., tape drives).

### Disadvantages:
-   Inefficient for large lists. For N elements, it might take N comparisons in the worst case.
-   Significantly slower than other search algorithms (like binary search or hash table lookups) for large, sorted datasets or when frequent lookups are needed.

### When to Use:
-   When the list is small.
-   When the list is unsorted and sorting it first would be more costly than a linear search.
-   When simplicity of implementation is a higher priority than raw speed.`,
  timeComplexities: {
    best: "O(1)", // Target is the first element
    average: "O(n)", // Target is in the middle on average
    worst: "O(n)", // Target is the last element or not present
  },
  spaceComplexity: "O(1)", // Only a few variables needed for iteration
};
    
