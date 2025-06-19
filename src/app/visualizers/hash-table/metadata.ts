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
    *   A function that takes a key (which can be of various types like string, number, etc.) and computes an integer index, often called a "hash code" or simply "hash".
    *   This index determines the "bucket" or "slot" in an underlying array where the corresponding value (or a reference to it) should be stored.
    *   **Properties of a good hash function**:
        *   **Deterministic**: For the same key, it must always produce the same hash.
        *   **Uniform Distribution**: It should distribute keys as evenly as possible across the available buckets to minimize collisions.
        *   **Efficient to Compute**: Calculating the hash should be fast.
    *   A common simple hash function for strings involves summing ASCII values or using polynomial rolling hashes, then taking modulo table size.

2.  **Array (Buckets/Slots)**:
    *   An array that serves as the primary storage. The size of this array is often called the "table size" or "capacity".
    *   Each element of this array is a "bucket" or "slot".

3.  **Collision Resolution Strategy**:
    *   A **collision** occurs when two different keys hash to the same index (bucket). Since the number of possible keys is often much larger than the table size, collisions are inevitable.
    *   Strategies to handle collisions include:
        *   **Chaining (Separate Chaining)**: Each bucket stores a pointer to another data structure (commonly a linked list, but could be a balanced tree for better worst-case performance) that holds all key-value pairs hashing to that index.
            *   *Insert*: Compute hash, go to bucket, add new pair to the list in that bucket. If key already exists, update value.
            *   *Search*: Compute hash, go to bucket, traverse the list to find the key.
            *   *Delete*: Compute hash, go to bucket, find and remove the key from the list.
            *   *AlgoVista visualizes this approach.*
        *   **Open Addressing**: All key-value pairs are stored directly in the bucket array itself. When a collision occurs (the target bucket is already occupied by a different key), a "probing" sequence is used to find the next available slot.
            *   *Linear Probing*: Check the next slot (\`index + 1\`, \`index + 2\`, ... modulo table size). Can lead to "primary clustering."
            *   *Quadratic Probing*: Check slots using a quadratic offset (\`index + 1^2\`, \`index + 2^2\`, ...). Helps reduce primary clustering but can cause "secondary clustering."
            *   *Double Hashing*: Use a second hash function to determine the step size for probing.

### Key Operations:
-   **Insert (or Put, Set)**:
    *   Calculate hash index for the key.
    *   Go to the bucket at that index.
    *   Using the collision resolution strategy (e.g., search linked list in chaining):
        *   If key already exists, update its value.
        *   Otherwise, add the new key-value pair.
    *   Time Complexity: Average O(1 + L) where L is load factor, Worst O(N) if all keys collide.

-   **Search (or Get)**:
    *   Calculate hash index for the key.
    *   Go to the bucket.
    *   Search for the key within that bucket (e.g., traverse list).
    *   If found, return value; otherwise, indicate key not found.
    *   Time Complexity: Average O(1 + L), Worst O(N).

-   **Delete (or Remove)**:
    *   Calculate hash index for the key.
    *   Go to the bucket.
    *   Search for the key and remove it.
    *   Deletion can be complex with open addressing (often requires marking slots as "deleted" instead of just "empty" to not break probe sequences).
    *   Time Complexity: Average O(1 + L), Worst O(N).

### Load Factor & Rehashing:
-   **Load Factor (α)**: The ratio of the number of stored entries (N) to the number of buckets (M), i.e., \`α = N / M\`.
-   A high load factor increases the probability of collisions and can degrade performance (e.g., linked lists in chaining become longer).
-   When the load factor exceeds a certain threshold (e.g., 0.7 or 0.75 for chaining), **rehashing** is typically performed:
    1.  A new, larger array (e.g., double the size) is created.
    2.  All existing key-value pairs are re-hashed (using the new table size in the hash function) and inserted into the new table.
    3.  Rehashing is an O(N+M) operation but is amortized over many insertions, so average insertion time remains efficient.

### Advantages:
-   **Extremely Fast Average-Case Performance**: O(1) on average for insert, search, and delete, assuming a good hash function and effective collision resolution.
-   Flexible keys: Can store various data types as keys (if a suitable hash function exists).

### Disadvantages:
-   **Worst-Case Performance**: O(N) if many collisions occur (e.g., poor hash function or all keys hashing to the same bucket).
-   **No Ordered Traversal**: Elements are not stored in any particular order, so iterating through keys in sorted order is inefficient (requires collecting all keys and sorting them separately). Tree-based maps (like BSTs) are better for ordered operations.
-   Choosing a good hash function and table size can be critical and sometimes complex.

### Common Use Cases:
-   Implementing dictionaries, maps, and sets in programming languages (e.g., Python \`dict\`, Java \`HashMap\`, C++ \`std::unordered_map\`).
-   Database indexing (hash indexes).
-   Caching mechanisms.
-   Symbol tables in compilers.
-   Counting frequencies of items.

The AlgoVista Hash Table visualizer demonstrates the chaining method for collision resolution and operations like insert, search, and delete.`,
  timeComplexities: {
    best: "Insert/Search/Delete: O(1) (no collisions, ideal hash).",
    average: "Insert/Search/Delete: O(1) or O(1+L) where L is load factor (with good hashing and collision resolution).",
    worst: "Insert/Search/Delete: O(N) (all keys collide into one bucket).",
  },
  spaceComplexity: "O(N+M) where N is number of entries and M is number of buckets. For chaining, O(N) for entries + O(M) for bucket array.",
};
