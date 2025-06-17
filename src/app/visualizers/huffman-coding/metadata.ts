
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'huffman-coding',
  title: 'Huffman Coding',
  category: 'Trees',
  difficulty: 'Medium',
  description: 'A lossless data compression algorithm that uses variable-length codes for characters based on their frequencies.',
  longDescription: 'Huffman Coding is a greedy algorithm used for lossless data compression. The main idea is to assign variable-length codes to input characters, lengths of the assigned codes are based on the frequencies of corresponding characters. The most frequent character gets the smallest code and the least frequent character gets the largest code.\\n\\nAlgorithm Steps:\\n1.  Calculate the frequency of each character in the input data.\\n2.  Create a leaf node for each unique character and build a min-priority queue (min-heap) of these nodes. The priority of a node is its frequency.\\n3.  While there is more than one node in the queue:\\n    a.  Extract the two nodes with the minimum frequency from the priority queue.\\n    b.  Create a new internal node with these two nodes as children and with frequency equal to the sum of the two nodes\\\' frequencies.\\n    c.  Add the new node to the priority queue.\\n4.  The remaining node is the root of the Huffman Tree.\\n5.  Traverse the Huffman Tree to assign codes to characters. Typically, assign 0 to left branches and 1 to right branches (or vice-versa). The code for each character is the sequence of 0s and 1s on the path from the root to the character\\\'s leaf node.\\n\\nUse Cases: Widely used in compression formats like JPEG, MP3, and ZIP (often in conjunction with other compression techniques).',
  timeComplexities: {
    best: "O(n log n) where n is the number of unique characters (due to heap operations).",
    average: "O(n log n)",
    worst: "O(n log n)",
  },
  spaceComplexity: "O(n) for storing frequencies and the Huffman tree.",
};
    