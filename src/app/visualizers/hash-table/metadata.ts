
// src/app/visualizers/hash-table/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'hash-table',
  title: 'Hash Table Operations',
  category: 'Data Structures',
  difficulty: 'Medium',
  description: 'A data structure that implements an associative array abstract data type, a structure that can map keys to values. Uses a hash function to compute an index into an array of buckets or slots.',
  longDescription: `A Hash Table (or Hash Map) is a fundamental data structure used to implement an associative array, which is a collection of key-value pairs. It's highly efficient for lookups, insertions, and deletions on average.

### Core Components:
1.  **Hash Function**:
    *   A function that takes a key and computes an integer index, often called a "hash code".
    *   This index determines the "bucket" in an underlying array where the corresponding value should be stored.
    *   **Properties of a good hash function**: Deterministic, uniform distribution, and efficient to compute.

2.  **Array (Buckets/Slots)**:
    *   An array that serves as the primary storage. The size of this array is the table size.

3.  **Collision Resolution Strategy**:
    *   A **collision** occurs when two different keys hash to the same index.
    *   **Separate Chaining (Visualized Here)**: Each bucket stores a pointer to a data structure (commonly a linked list or, as in this visualizer, a simple array) that holds all key-value pairs hashing to that index.
        *   *Insert*: Compute hash, go to bucket, add the new pair to the list in that bucket. If key exists, update its value.
        *   *Search*: Compute hash, go to bucket, traverse the list to find the key.
        *   *Delete*: Compute hash, go to bucket, find and remove the key from the list.
    *   **Open Addressing**: Another strategy where all pairs are stored in the bucket array itself, probing for the next available slot on collision.

### Key Operations (with Chaining):
-   **Insert(key, value)**: Hash the key to find the bucket index. Search the list in the bucket. If the key exists, update the value. Otherwise, add the new key-value pair to the list.
-   **Search(key)**: Hash the key to find the bucket index. Search the list in that bucket for the key and return its associated value if found.
-   **Delete(key)**: Hash the key to find the bucket index. Search the list for the key and remove the key-value pair if found.

### Load Factor & Rehashing:
-   **Load Factor (α)**: The ratio of stored entries (N) to buckets (M). A high load factor increases collisions and degrades performance.
-   **Rehashing**: When the load factor exceeds a threshold (e.g., 0.75), a new, larger table is created, and all existing entries are re-hashed into the new table. This is an expensive operation but amortizes over many insertions. (Rehashing is not implemented in this visualizer).

### Time and Space Complexity:
-   **Time Complexity**: Average Case for Insert, Search, Delete is O(1 + α), which is effectively O(1) if the load factor is kept small. Worst Case is O(N) if all keys hash to the same bucket.
-   **Space Complexity**: O(N + M), where N is the number of entries and M is the number of buckets.

The AlgoVista Hash Table visualizer demonstrates the **separate chaining** method for collision resolution.`,
  timeComplexities: {
    best: "Insert/Search/Delete: O(1) (no collisions, ideal hash).",
    average: "Insert/Search/Delete: O(1+α) where α is the load factor.",
    worst: "Insert/Search/Delete: O(N) (all keys collide into one bucket).",
  },
  spaceComplexity: "O(N+M) where N is number of entries and M is number of buckets.",
};
