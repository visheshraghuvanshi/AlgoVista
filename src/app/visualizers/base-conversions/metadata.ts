
// src/app/visualizers/base-conversions/metadata.ts
import type { AlgorithmMetadata } from './types'; // Local import

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'base-conversions',
  title: 'Base Conversions',
  category: 'Math & Number Theory',
  difficulty: 'Easy',
  description: 'Converts numbers between different numeral systems (bases), e.g., decimal to binary.',
  longDescription: `Base conversion is the process of changing the representation of a number from one numeral system (base) to another. A numeral system is a way of representing numbers using a set of symbols (digits). The base (or radix) of a positional numeral system is the number of unique digits, including zero, used to represent numbers. Common bases include:
-   **Binary (Base-2)**: Uses digits 0, 1. Fundamental in computer systems.
-   **Octal (Base-8)**: Uses digits 0-7.
-   **Decimal (Base-10)**: The standard system we use, with digits 0-9.
-   **Hexadecimal (Base-16)**: Uses digits 0-9 and A-F (representing 10-15). Often used in computing for memory addresses and color codes.

### Converting from an Arbitrary Base B to Decimal (Base-10)
To convert a number \`(d_k d_{k-1} ... d_1 d_0 . f_1 f_2 ... f_m)_B\` from base B to decimal:
-   **Integer Part**: Sum \`(d_i * B^i)\` for each digit \`d_i\` from right to left (position \`i\` starting at 0).
    Example: \`(1011)_2 = (1*2^3) + (0*2^2) + (1*2^1) + (1*2^0) = 8 + 0 + 2 + 1 = (11)_{10}\`.
    Example: \`(2A)_{16} = (2*16^1) + (10*16^0) = 32 + 10 = (42)_{10}\`.
-   **Fractional Part** (if any): Sum \`(f_j * B^{-j})\` for each digit \`f_j\` from left to right (position \`j\` starting at 1 after the radix point).
    Example: \`(0.101)_2 = (1*2^{-1}) + (0*2^{-2}) + (1*2^{-3}) = 1/2 + 0/4 + 1/8 = 0.5 + 0.125 = (0.625)_{10}\`.

### Converting from Decimal (Base-10) to an Arbitrary Base B
**Integer Part:**
1.  Repeatedly divide the decimal number by the target base B.
2.  The remainder of each division (in order from last to first) forms the digits of the number in base B. The first remainder is the least significant digit (LSD), and the last remainder (from the division where the quotient becomes 0) is the most significant digit (MSD).
    Example: Convert decimal 42 to binary (Base 2):
    - \`42 / 2 = 21\` remainder \`0\` (LSD)
    - \`21 / 2 = 10\` remainder \`1\`
    - \`10 / 2 = 5\`  remainder \`0\`
    - \`5  / 2 = 2\`  remainder \`1\`
    - \`2  / 2 = 1\`  remainder \`0\`
    - \`1  / 2 = 0\`  remainder \`1\` (MSD)
    Reading remainders in reverse: \`(101010)_2\`.

**Fractional Part** (if any):
1.  Repeatedly multiply the fractional part of the decimal number by the target base B.
2.  The integer part of each product forms the digits of the fractional part in base B, read from first to last.
3.  The new fractional part for the next step is the fractional part of the current product.
4.  This process may terminate if the fractional part becomes 0, or it may be non-terminating (requiring a decision on precision).
    Example: Convert decimal 0.625 to binary (Base 2):
    - \`0.625 * 2 = 1.25\` (Integer part: \`1\`)
    - \`0.25  * 2 = 0.5\`  (Integer part: \`0\`)
    - \`0.5   * 2 = 1.0\`  (Integer part: \`1\`)
    - Fractional part is now 0. Stop.
    Reading integer parts: \`(0.101)_2\`.

### Converting Between Two Non-Decimal Bases
Usually, the easiest way is to convert the source base number to decimal first, and then convert that decimal number to the target base.
Example: Convert \`(1A)_{12}\` (duodecimal) to Base-7.
1.  Convert \`(1A)_{12}\` to decimal: \`(1 * 12^1) + (10 * 12^0) = 12 + 10 = (22)_{10}\`.
2.  Convert \`(22)_{10}\` to Base-7:
    - \`22 / 7 = 3\` remainder \`1\`
    - \`3  / 7 = 0\` remainder \`3\`
    Result: \`(31)_7\`.

### Special Cases:
-   Converting between bases that are powers of each other (e.g., binary to hexadecimal, binary to octal) can be done by grouping digits.
    -   Binary to Hex: Group binary digits in sets of 4. (e.g., \`101010_2 -> (00)10 1010_2 -> 2A_{16}\`)
    -   Binary to Octal: Group binary digits in sets of 3.

The AlgoVista visualizer currently focuses on integer conversions between a given base and decimal, and then decimal to another given base.`,
  timeComplexities: {
    best: "O(log_B N) for integer part, O(P) for P precision digits of fractional part",
    average: "O(log_B N) for integer part, O(P) for P precision digits of fractional part",
    worst: "O(log_B N) for integer part, O(P) for P precision digits of fractional part",
  },
  spaceComplexity: "O(log_B N) or O(P) for storing the digits of the result.",
};
    
