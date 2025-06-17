
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'red-black-tree',
  title: 'Red-Black Tree Operations',
  category: 'Trees',
  difficulty: 'Hard',
  description: 'A self-balancing binary search tree that maintains balance using node colors (red or black) and specific rotation/recoloring rules upon insertion and deletion.',
  longDescription: 'A Red-Black Tree is a type of self-balancing binary search tree where each node has an extra bit for storing color ("red" or "black"). By constraining the way nodes can be colored on any path from the root to a leaf, red-black trees ensure that no path is more than twice as long as any other, so the tree remains approximately balanced. This balance ensures that operations like search, insert, and delete can be performed in O(log N) time in the worst case, where N is the number of nodes in the tree.\\n\\nProperties of a Red-Black Tree:\\n1. Every node is either red or black.\\n2. The root is black.\\n3. Every leaf (NIL node, typically a sentinel) is black.\\n4. If a node is red, then both its children are black.\\n5. For each node, all simple paths from the node to descendant leaves contain the same number of black nodes (this is called the black-height).\\n\\nOperations (Insert/Delete) involve standard BST operations followed by "fixup" procedures (rotations and recolorings) to restore the red-black properties if they are violated.\\n\\nUse Cases: Commonly used in implementations of associative arrays (maps/dictionaries) and sets in standard libraries (e.g., C++ STL map, Java TreeMap/TreeSet) due to their guaranteed worst-case performance.',
  timeComplexities: {
    best: "O(log n) for Search, Insert, Delete",
    average: "O(log n) for Search, Insert, Delete",
    worst: "O(log n) for Search, Insert, Delete (guaranteed)"
  },
  spaceComplexity: "O(n) for storage. O(log n) for recursion stack if recursive implementations are used for fixups.",
};

