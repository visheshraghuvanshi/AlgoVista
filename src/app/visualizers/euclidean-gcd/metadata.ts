
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'euclidean-gcd',
  title: 'Euclidean Algorithm for GCD',
  category: 'Math & Number Theory',
  difficulty: 'Easy',
  description: 'Efficiently finds the greatest common divisor (GCD) of two integers. Now with interactive step-by-step visualization!',
  longDescription: 'The Euclidean Algorithm is an efficient method for computing the greatest common divisor (GCD) of two integers (a, b), which is the largest positive integer that divides both a and b without a remainder. It is one of the oldest algorithms in common use, appearing in Euclid\'s Elements around 300 BC.\n\nThe algorithm is based on the principle that the greatest common divisor of two numbers does not change if the larger number is replaced by its difference with the smaller number. This process is repeated until one of the numbers becomes zero, at which point the other number is the GCD. A more efficient version uses the remainder instead of the difference: replace the larger number with its remainder when divided by the smaller number. This process continues until the remainder is zero, and the GCD is the last non-zero remainder (which will be the value of the other number at that point).\n\nExample: GCD(48, 18)\n1. 48 = 2 * 18 + 12\n2. 18 = 1 * 12 + 6\n3. 12 = 2 * 6 + 0\nThe last non-zero remainder is 6, so GCD(48, 18) = 6.\n\nThe extended Euclidean algorithm can also be used to find integers x and y such that ax + by = GCD(a, b). This interactive visualizer demonstrates the standard iterative Euclidean Algorithm.',
  timeComplexities: {
    best: "O(log min(a,b))",
    average: "O(log min(a,b))",
    worst: "O(log min(a,b))",
  },
  spaceComplexity: "O(1) for iterative, O(log min(a,b)) for recursive due to stack space.",
};
    