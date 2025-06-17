
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'dutch-national-flag',
  title: 'Dutch National Flag Problem',
  category: 'Arrays & Search',
  difficulty: 'Medium',
  description: 'Sorts an array of 0s, 1s, and 2s in a single pass. An in-place partitioning algorithm.',
  longDescription: 'The Dutch National Flag problem (also known as 3-way partitioning) is a computer science programming problem proposed by Edsger Dijkstra. The flag of the Netherlands consists of three colors: red, white and blue. Given balls of these three colors arranged randomly in a line (the actual problem was for programming with 0s, 1s, and 2s), the task is to arrange them such that all balls of the same color are together and in the correct order (e.g., red, then white, then blue, or 0s, then 1s, then 2s).\n\nAlgorithm Steps (using 0s, 1s, and 2s):\n1. Maintain three pointers: `low`, `mid`, and `high`.\n   - `low`: Points to the boundary of the 0s section (elements before `low` are 0s).\n   - `mid`: Current element being considered.\n   - `high`: Points to the boundary of the 2s section (elements after `high` are 2s).\n2. Initialize `low = 0`, `mid = 0`, `high = n-1` (where n is array length).\n3. Iterate while `mid <= high`:\n   a. If `arr[mid]` is 0: Swap `arr[low]` and `arr[mid]`. Increment both `low` and `mid`.\n   b. If `arr[mid]` is 1: Increment `mid` (element is in its correct relative place).\n   c. If `arr[mid]` is 2: Swap `arr[mid]` and `arr[high]`. Decrement `high` (do not increment `mid` as the swapped element from `high` needs to be processed).\n\nThis algorithm sorts the array in O(N) time complexity and O(1) space complexity, making it very efficient.',
  timeComplexities: {
    best: "O(N)",
    average: "O(N)",
    worst: "O(N)",
  },
  spaceComplexity: "O(1)",
};
