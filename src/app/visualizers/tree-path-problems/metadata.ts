
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'tree-path-problems',
  title: 'Tree Path Sum (Root-to-Leaf)',
  category: 'Trees',
  difficulty: 'Medium',
  description: 'Finds if a root-to-leaf path exists in a binary tree such that the sum of node values along the path equals a given target sum.',
  longDescription: 'The Root-to-Leaf Path Sum problem is a common tree traversal challenge. Given a binary tree and a target sum, the goal is to determine if there exists a path from the root node to any leaf node where the sum of the values of the nodes along that path equals the target sum. A leaf node is a node with no children.\\n\\nAlgorithm Steps (DFS-based Recursive Approach):\\n1. If the current node is null (empty tree or end of a branch), return false (no path here).\\n2. Subtract the current node\'s value from the target sum to get the remaining sum needed from its children.\\n3. If the current node is a leaf node (no left and no right child):\\n   a. Check if the remaining sum is zero (i.e., current node\'s value equals what was needed). If so, a path is found, return true.\\n   b. Otherwise, this leaf path doesn\'t match, return false.\\n4. If not a leaf node, recursively call the function for the left child with the remaining sum.\\n5. If the left child call returns true, a path is found, so return true.\\n6. Otherwise, recursively call the function for the right child with the remaining sum.\\n7. Return the result of the right child call.\\n\\nThis approach systematically explores all root-to-leaf paths. The interactive visualizer demonstrates this DFS traversal, showing the current path being explored and the sum accumulated so far.',
  timeComplexities: {
    best: "O(N) in the best case (path found quickly).",
    average: "O(N) as it visits each node at most once.",
    worst: "O(N) as it visits each node at most once.",
  },
  spaceComplexity: "O(H) for recursion stack, where H is the height of the tree. In the worst case (skewed tree), H can be N.",
};
    
