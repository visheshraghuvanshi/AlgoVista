
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'modular-exponentiation',
  title: 'Modular Exponentiation',
  category: 'Math & Number Theory',
  difficulty: 'Medium',
  description: 'Calculates (base^exponent) % modulus efficiently, often used in cryptography.',
  longDescription: 'Modular exponentiation is the computation of (base^exponent) mod modulus. It is a common operation in computer science, especially in the field of public-key cryptography. Naively computing base^exponent first and then taking the modulus can be very slow and can result in extremely large intermediate numbers.\n\nThe method of exponentiation by squaring (also known as binary exponentiation) allows modular exponentiation to be computed efficiently. \n\nAlgorithm Steps (Exponentiation by Squaring - Iterative):\n1. Initialize result = 1.\n2. Reduce base = base % modulus (to keep numbers smaller).\n3. While exponent > 0:\n   a. If exponent is odd, result = (result * base) % modulus.\n   b. exponent = exponent >> 1 (integer division by 2, or floor(exponent/2)).\n   c. base = (base * base) % modulus.\n4. Return result.\n\nThis algorithm works because if the exponent `exp` is even, then base^exp = (base^2)^(exp/2). If `exp` is odd, then base^exp = base * base^(exp-1) = base * (base^2)^((exp-1)/2).\n\nThis technique significantly reduces the number of multiplications required compared to the naive approach. It is fundamental in algorithms like RSA and Diffie-Hellman key exchange.',
  timeComplexities: {
    best: "O(log exponent)",
    average: "O(log exponent)",
    worst: "O(log exponent)",
  },
  spaceComplexity: "O(1) for iterative, O(log exponent) for recursive due to stack space.",
};
    
