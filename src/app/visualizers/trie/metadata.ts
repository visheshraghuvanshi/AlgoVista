
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'trie',
  title: 'Trie (Prefix Tree)',
  category: 'Trees',
  difficulty: 'Medium',
  description: 'A tree-like data structure that stores a dynamic set or associative array where the keys are usually strings. Efficient for prefix-based searches.',
  longDescription: 'A Trie, also known as a prefix tree or digital tree, is an ordered tree data structure that is used to store a dynamic set or associative array where the keys are usually strings. Unlike a binary search tree, no node in the tree stores the key associated with that node; instead, its position in the tree defines the key with which it is associated. All the descendants of a node have a common prefix of the string associated with that node, and the root is associated with the empty string.\\n\\nKey Operations:\\n- **Insert**: Adds a word to the trie. Traverse the trie character by character, creating new nodes if a path doesn\'t exist. Mark the end of the word at the final character\'s node.\\n- **Search**: Checks if a word exists in the trie. Traverse the trie according to the characters in the word. If the path exists and the final node is marked as end-of-word, the word is present.\\n- **StartsWith (Prefix Search)**: Checks if any word in the trie starts with a given prefix. Traverse the trie according to the characters in the prefix. If the path exists, then there are words with this prefix.\\n- **Delete**: Removes a word from the trie. This operation can be complex as it may involve deleting nodes if they are no longer part of any other word or prefix.\\n\\nUse Cases: Autocomplete/autosuggest features, spell checkers, IP routing (longest prefix match), dictionary implementations.',
  timeComplexities: {
    best: "Insert/Search/StartsWith: O(L) where L is length of the key/word.",
    average: "Insert/Search/StartsWith: O(L)",
    worst: "Insert/Search/StartsWith: O(L)"
  },
  spaceComplexity: "O(N*L_avg*A) where N is number of words, L_avg is average length, A is alphabet size (worst case). Efficient if many words share common prefixes.",
};
