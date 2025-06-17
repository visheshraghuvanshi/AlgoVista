
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'prime-factorization',
  title: 'Prime Factorization',
  category: 'Math & Number Theory',
  difficulty: 'Easy',
  description: 'Finds the prime numbers that multiply together to make the original number.',
  longDescription: 'Prime factorization is the process of finding which prime numbers multiply together to make the original number. A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.\n\nThe fundamental theorem of arithmetic states that every integer greater than 1 either is a prime number itself or can be represented as a product of prime numbers, and that, moreover, this representation is unique, up to the order of the factors.\n\nAlgorithm Steps (Trial Division):\n1. Start with the smallest prime number, p = 2.\n2. While p*p <= n (where n is the number to factorize):\n   a. While n is divisible by p, add p to the list of factors and divide n by p (n = n / p).\n   b. Increment p. If p is 2, increment to 3. If p is odd, increment by 2 (to check next odd number).\n3. If n > 1 after the loop, the remaining value of n is also a prime factor (this handles the case where the largest prime factor is greater than sqrt(original n)).\n\nExample: Prime factorization of 84\n- n = 84, p = 2. 84 % 2 == 0. Factors: [2]. n = 42.\n- n = 42, p = 2. 42 % 2 == 0. Factors: [2, 2]. n = 21.\n- n = 21, p = 2. 21 % 2 != 0.\n- p = 3. n = 21, p = 3. 21 % 3 == 0. Factors: [2, 2, 3]. n = 7.\n- n = 7, p = 3. 7 % 3 != 0.\n- p = 5. p*p = 25 > n (which is 7). Loop ends.\n- Remaining n = 7 is > 1. Add 7 to factors. Factors: [2, 2, 3, 7].\nSo, 84 = 2 * 2 * 3 * 7 or 2^2 * 3 * 7.',
  timeComplexities: {
    best: "O(log n) if n is a power of 2",
    average: "O(sqrt(n)) using trial division",
    worst: "O(sqrt(n)) using trial division",
  },
  spaceComplexity: "O(log n) for storing factors (in the worst case, like 2*3*5*...)",
};
    