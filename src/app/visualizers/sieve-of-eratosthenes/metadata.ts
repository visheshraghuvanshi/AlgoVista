
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'sieve-of-eratosthenes',
  title: 'Sieve of Eratosthenes',
  category: 'Math & Number Theory',
  difficulty: 'Medium',
  description: 'An ancient algorithm for finding all prime numbers up to a specified integer.',
  longDescription: 'The Sieve of Eratosthenes is a highly efficient ancient algorithm for finding all prime numbers up to any given limit. It does so by iteratively marking as composite (i.e., not prime) the multiples of each prime, starting with the first prime number, 2.\n\nAlgorithm Steps:\n1. Create a list of consecutive integers from 2 through n: (2, 3, 4, ..., n).\n2. Initially, let p equal 2, the smallest prime number.\n3. Enumerate the multiples of p by counting in increments of p from 2p to n, and mark them in the list (e.g., 2p, 3p, 4p, ...; these are 4, 6, 8,... for p=2). These will be composite numbers.\n4. Find the first number greater than p in the list that is not marked. If there was no such number, stop. Otherwise, let p now equal this new number (which is the next prime), and repeat from step 3.\n\nWhen the algorithm terminates, the numbers remaining not marked in the list are all the primes below n. The optimization is that one only needs to start marking multiples from p*p, because smaller multiples of p would have already been marked by smaller primes.\n\nExample: Find primes up to 10.\nList: 2, 3, 4, 5, 6, 7, 8, 9, 10\n- p = 2: Mark 4, 6, 8, 10. List: 2, 3, (4), 5, (6), 7, (8), (10)\n- Next unmarked > 2 is p = 3: Mark 6 (already marked), 9. List: 2, 3, (4), 5, (6), 7, (8), (9), (10)\n- Next unmarked > 5 is p = 5: Mark 10 (already marked). p*p = 25 > 10, so stop for multiples of 5.\n- Next unmarked > 5 is p = 7: p*p = 49 > 10, so stop for multiples of 7.\nPrimes: 2, 3, 5, 7.',
  timeComplexities: {
    best: "O(n log log n)",
    average: "O(n log log n)",
    worst: "O(n log log n)",
  },
  spaceComplexity: "O(n) for storing the boolean array of markings.",
};
    
