
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'trie',
  title: 'Trie (Prefix Tree)',
  category: 'Trees',
  difficulty: 'Medium',
  description: 'A tree-like data structure that stores a dynamic set or associative array where the keys are usually strings. Efficient for prefix-based searches.',
  longDescription: `A Trie, also known as a prefix tree or digital tree, is an ordered tree data structure that is used to store a dynamic set or associative array where the keys are usually strings. Unlike a binary search tree, no node in the tree stores the key associated with that node; instead, its position in the tree defines the key with which it is associated. All the descendants of a node have a common prefix of the string associated with that node, and the root is associated with the empty string.

### Core Components:
1.  **TrieNode**: Each node in a Trie typically contains:
    *   An array or map of child pointers (e.g., one for each possible character in the alphabet).
    *   A boolean flag (\`isEndOfWord\`) indicating if the path from the root to this node forms a complete word stored in the Trie.
2.  **Root**: The root of the Trie represents an empty string.

### How it Works (Key Operations):

**1. Insertion (O(L))**
   -   To insert a word, start from the root.
   -   For each character in the word:
       a.  Check if there is an existing child node corresponding to the current character.
       b.  If not, create a new node and link it from the current node.
       c.  Move to the child node.
   -   After processing all characters in the word, mark the final node's \`isEndOfWord\` flag as true.

**2. Search (O(L))**
   -   To search for a word, start from the root.
   -   For each character in the word:
       a.  Check if there is a child node corresponding to the current character.
       b.  If not, the word does not exist in the Trie. Return false.
       c.  Move to the child node.
   -   After processing all characters, if the final node's \`isEndOfWord\` flag is true, the word exists. Otherwise, the word is a prefix of another word but not a complete word itself in the Trie.

**3. StartsWith (Prefix Search) (O(P))**
   -   To check if any word starts with a given prefix, start from the root.
   -   For each character in the prefix:
       a.  Check if there is a child node corresponding to the current character.
       b.  If not, no word in the Trie starts with this prefix. Return false.
       c.  Move to the child node.
   -   If all characters of the prefix are successfully traversed, it means at least one word in the Trie starts with this prefix. Return true.

**4. Deletion (O(L))** (Conceptual for this visualizer, not implemented in steps)
   -   Search for the word to be deleted.
   -   If found, unmark its \`isEndOfWord\` flag.
   -   Optionally, if the node (and its ancestors) are no longer part of any other word or prefix, they can be removed from the Trie to save space. This requires careful traversal upwards from the deleted word's end node.

### Characteristics:
-   **Path Represents Key**: The path from the root to a node represents a prefix. If the node is marked as \`isEndOfWord\`, that path represents a complete key.
-   **Space Efficient for Common Prefixes**: Words with common prefixes share the same prefix path in the Trie, saving space compared to storing them separately.
-   **Alphabet Size Dependency**: The number of children per node can depend on the size of the alphabet (e.g., 26 for English lowercase letters, more for extended character sets). A hash map for children can make this more flexible.

### Advantages:
-   **Fast Prefix-Based Operations**: Searching for words, or checking if any word starts with a given prefix, is very efficient (proportional to the length of the word/prefix).
-   **Efficient for Dictionary Operations**: Good for auto-completion, spell-checking.
-   Can be used to sort a collection of strings lexicographically.

### Disadvantages:
-   **Space Consumption**: Can consume a lot of memory if keys are long and do not share many common prefixes, or if the alphabet size is large and an array is used for children at each node (a map is more space-efficient for sparse children).
-   Compared to hash tables, Tries are generally slower for exact match lookups if prefix operations are not needed, as hash tables have O(1) average search time.

### Common Use Cases:
-   **Autocomplete / Autosuggest Features**: Suggesting words as a user types.
-   **Spell Checkers**: Quickly checking if a word is in a dictionary or finding similar words.
-   **IP Routing Tables**: Longest prefix match for routing IP packets.
-   **Storing Dictionaries**: For efficient word lookup and prefix searches.
-   Bioinformatics for sequence matching.

The AlgoVista visualizer demonstrates Insert, Search, and StartsWith operations, showing the traversal path and node states.`,
  timeComplexities: {
    best: "Insert/Search/StartsWith: O(L) where L is length of the key/word.",
    average: "Insert/Search/StartsWith: O(L)",
    worst: "Insert/Search/StartsWith: O(L)"
  },
  spaceComplexity: "O(N*L_avg*A) where N is number of words, L_avg is average length, A is alphabet size (worst case if using arrays for children). O(TotalCharacters) if using maps for children and many shared prefixes.",
};
