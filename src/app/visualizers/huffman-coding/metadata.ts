
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'huffman-coding',
  title: 'Huffman Coding',
  category: 'Trees',
  difficulty: 'Medium',
  description: 'A lossless data compression algorithm that uses variable-length codes for characters based on their frequencies.',
  longDescription: `Huffman Coding is a greedy algorithm widely used for lossless data compression. The core idea is to assign variable-length binary codes to input characters, where the lengths of the codes depend on the frequencies of the characters. More frequent characters get shorter codes, and less frequent characters get longer codes, leading to an overall reduction in the number of bits needed to represent the data.

### How it Works:

**1. Calculate Character Frequencies:**
   -   Count the occurrences of each unique character in the input text.

**2. Build Huffman Tree (Min-Priority Queue):**
   -   Create a leaf node for each unique character, storing the character and its frequency.
   -   Initialize a min-priority queue (often implemented as a min-heap) with these leaf nodes. The priority is determined by the frequency (lower frequency = higher priority for extraction).
   -   While there is more than one node in the priority queue:
       a.  Extract the two nodes with the minimum frequencies (let's call them \`left\` and \`right\`).
       b.  Create a new **internal node**. Its frequency is the sum of the frequencies of \`left\` and \`right\`.
       c.  Make \`left\` the left child and \`right\` the right child of this new internal node. (The choice of left/right can be arbitrary but must be consistent for code generation, e.g., smaller frequency to the left).
       d.  Insert the new internal node back into the priority queue.
   -   The single remaining node in the priority queue is the root of the Huffman Tree.

**3. Generate Huffman Codes:**
   -   Traverse the Huffman Tree from the root to each leaf node to generate the binary codes.
   -   Typically, assign '0' for a left branch and '1' for a right branch (or vice-versa).
   -   The Huffman code for a character is the sequence of 0s and 1s encountered on the path from the root to the leaf node representing that character.

### Example: Text "ABBCBCADEFGH"
1.  **Frequencies**: A:1, B:3, C:2, D:1, E:1, F:1, G:1, H:1
2.  **Build Tree**:
    *   PQ: [A:1, D:1, E:1, F:1, G:1, H:1, C:2, B:3] (sorted by freq)
    *   Dequeue A(1), D(1). New internal node Σ(2) [children A,D]. PQ: [E:1, F:1, G:1, H:1, C:2, Σ(A,D):2, B:3]
    *   Dequeue E(1), F(1). New internal node Σ(2) [children E,F]. PQ: [G:1, H:1, C:2, Σ(A,D):2, Σ(E,F):2, B:3]
    *   Dequeue G(1), H(1). New internal node Σ(2) [children G,H]. PQ: [C:2, Σ(A,D):2, Σ(E,F):2, Σ(G,H):2, B:3]
    *   Dequeue C(2), Σ(A,D)(2). New internal node Σ(4) [children C, Σ(A,D)]. PQ: [Σ(E,F):2, Σ(G,H):2, B:3, Σ(C,Σ(A,D)):4]
    *   Dequeue Σ(E,F)(2), Σ(G,H)(2). New internal node Σ(4) [children Σ(E,F), Σ(G,H)]. PQ: [B:3, Σ(C,Σ(A,D)):4, Σ(Σ(E,F),Σ(G,H)):4]
    *   Dequeue B(3), Σ(C,Σ(A,D))(4). New internal node Σ(7) [children B, Σ(C,Σ(A,D))]. PQ: [Σ(Σ(E,F),Σ(G,H)):4, Σ(B,...):7]
    *   Dequeue Σ(Σ(E,F),Σ(G,H))(4), Σ(B,...)(7). New internal node Σ(11) [children Σ(4), Σ(7)]. PQ: [Σ(11)]
    *   Root is Σ(11).
3.  **Generate Codes** (example, 0 for left, 1 for right from root Σ(11)):
    *   Suppose B gets code '0', C gets '100', A gets '1010', D gets '1011', E gets '1100', F gets '1101', G gets '1110', H gets '1111'. (Actual codes depend on tie-breaking in PQ and left/right assignment).

### Characteristics:
-   **Prefix Codes**: No Huffman code is a prefix of another Huffman code. This property is crucial for unambiguous decoding.
-   **Greedy Algorithm**: Makes locally optimal choices (merging two smallest frequencies) hoping to find a global optimum.
-   **Lossless Compression**: Original data can be perfectly reconstructed from the compressed data.

### Advantages:
-   Relatively simple to implement compared to more advanced compression algorithms.
-   Often provides good compression ratios, especially for data with skewed character frequencies.

### Disadvantages:
-   Requires two passes over the data (one to calculate frequencies, one to encode) or storing frequency data with the compressed file.
-   Not the most efficient for all types of data (e.g., data with uniform character distribution).
-   Adaptive Huffman coding exists to handle dynamically changing frequencies.

### Common Use Cases:
-   File compression (e.g., part of formats like ZIP, GZIP).
-   Image compression (e.g., JPEG uses Huffman coding for entropy encoding).
-   Network protocols for efficient data transmission.
-   Text compression.

The AlgoVista visualizer shows the frequency calculation, priority queue operations during tree building, the final Huffman tree, and the code generation process.`,
  timeComplexities: {
    best: "O(N + U log U) where N is text length, U is unique chars (freq calc + heap ops). If U is small, O(N).",
    average: "O(N + U log U)",
    worst: "O(N + U log U)",
  },
  spaceComplexity: "O(U) for storing frequencies and the Huffman tree.",
};
