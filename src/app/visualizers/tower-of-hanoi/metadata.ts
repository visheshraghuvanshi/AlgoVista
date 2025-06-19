
// src/app/visualizers/tower-of-hanoi/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'tower-of-hanoi',
  title: 'Tower of Hanoi',
  category: 'Backtracking', // Or Recursion
  difficulty: 'Easy',
  description: 'A classic recursive puzzle involving moving disks between three pegs with specific rules. Now with interactive visualization!',
  longDescription: `The Tower of Hanoi is a mathematical puzzle that consists of three pegs (rods) and a number of disks of distinct sizes, which can slide onto any peg. The puzzle starts with the disks stacked in order of increasing size on one peg (the source peg), the smallest at the top, thus making a conical shape.

### The Objective:
The objective of the puzzle is to move the entire stack of disks from the source peg to a target peg, obeying the following simple rules:
1.  **One Disk at a Time**: Only one disk can be moved at a time.
2.  **Valid Placement**: Each move consists of taking the upper disk from one of the stacks and placing it on top of another stack or on an empty peg.
3.  **Size Constraint**: No disk may be placed on top of a smaller disk.

### Recursive Solution:
The puzzle can be solved efficiently using a recursive algorithm. To move \`n\` disks from a source peg to a target peg, using an auxiliary (helper) peg:

1.  **Base Case**: If \`n = 1\` (only one disk to move):
    *   Move the disk directly from the source peg to the target peg.
2.  **Recursive Step** (if \`n > 1\`):
    a.  Move \`n-1\` disks from the **source** peg to the **auxiliary** peg, using the **target** peg as temporary storage. (This is a recursive call).
    b.  Move the \`nth\` disk (the largest disk currently on the source peg, which is now at the bottom of the source stack) from the **source** peg to the **target** peg.
    c.  Move the \`n-1\` disks from the **auxiliary** peg to the **target** peg, using the **source** peg as temporary storage. (This is another recursive call).

The key is that for step 2a and 2c, the roles of "target" and "auxiliary" pegs swap depending on which subproblem is being solved.

### Example: Moving 3 Disks from A to C (B is auxiliary)
1.  Move 2 disks from A to B (using C as auxiliary):
    1a. Move 1 disk from A to C (using B as auxiliary) -> Move disk 1 A->C
    1b. Move disk 2 from A to B
    1c. Move 1 disk from C to B (using A as auxiliary) -> Move disk 1 C->B
2.  Move disk 3 from A to C
3.  Move 2 disks from B to C (using A as auxiliary):
    3a. Move 1 disk from B to A (using C as auxiliary) -> Move disk 1 B->A
    3b. Move disk 2 from B to C
    3c. Move 1 disk from A to C (using B as auxiliary) -> Move disk 1 A->C

Sequence of moves for 3 disks: A->C, A->B, C->B, A->C, B->A, B->C, A->C.

### Characteristics:
-   **Recursive Nature**: The problem has a natural recursive structure.
-   **Number of Moves**: For \`n\` disks, the minimum number of moves required is \`2^n - 1\`. This means the number of moves grows exponentially with the number of disks.

### Applications:
-   Classic example for teaching recursion and problem decomposition.
-   Used in psychological research on problem-solving.
-   Variations appear in backup rotation schemes (e.g., Grandfather-father-son backup).

The AlgoVista visualizer shows each disk movement step-by-step as dictated by the recursive solution.`,
  timeComplexities: { 
    best: "O(2^n)", 
    average: "O(2^n)", 
    worst: "O(2^n)" 
  },
  spaceComplexity: "O(n) for recursion stack depth.",
};
    
