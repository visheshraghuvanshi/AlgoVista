
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'tower-of-hanoi',
  title: 'Tower of Hanoi',
  category: 'Backtracking',
  difficulty: 'Easy',
  description: 'A classic recursive puzzle involving moving disks between three pegs with specific rules. Now with interactive visualization!',
  longDescription: 'The Tower of Hanoi is a mathematical puzzle that consists of three pegs and a number of disks of distinct sizes, which can slide onto any peg. The puzzle starts with the disks stacked in order of size on one peg, the smallest at the top, thus making a conical shape.\n\nThe objective of the puzzle is to move the entire stack to another designated peg, obeying the following simple rules:\n1. Only one disk can be moved at a time.\n2. Each move consists of taking the upper disk from one of the stacks and placing it on top of another stack or on an empty peg.\n3. No disk may be placed on top of a smaller disk.\n\nThe puzzle can be solved efficiently using a recursive algorithm. To move n disks from a source peg to a target peg, using an auxiliary peg:\n1. Move n-1 disks from the source peg to the auxiliary peg (using the target peg as temporary storage).\n2. Move the nth (largest) disk from the source peg to the target peg.\n3. Move the n-1 disks from the auxiliary peg to the target peg (using the source peg as temporary storage).\n\nThe base case for the recursion is when n=1 (moving a single disk), which is a direct move from source to target.',
  timeComplexities: { 
    best: "O(2^n)", 
    average: "O(2^n)", 
    worst: "O(2^n)" 
  },
  spaceComplexity: "O(n) for recursion stack depth.",
};
    
