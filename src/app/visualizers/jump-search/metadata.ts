
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'jump-search',
  title: 'Jump Search',
  category: 'Arrays & Search',
  difficulty: 'Easy',
  description: 'A searching algorithm for sorted arrays that checks fewer elements than linear search by jumping ahead by fixed steps. Interactive visualization available.',
  longDescription: 'Jump Search (or Block Search) is a searching algorithm for sorted arrays. The basic idea is to check fewer elements (than linear search) by jumping ahead by fixed steps or skipping some elements in place of searching all elements. For example, suppose we have an array arr[] of size n and block (to be jumped) size m. Then we search at arr[0], arr[m], arr[2m]…..arr[km] such that arr[km] < x < arr[(k+1)m]. Once we find the interval (arr[km], arr[(k+1)m]), we perform a linear search operation from the index km to find the element x. The optimal block size is √n, making the time complexity O(√n). It is better than linear search but worse than binary search.',
  timeComplexities: {
    best: "O(1)", // Target is found at the first jump point
    average: "O(√n)",
    worst: "O(√n)",
  },
  spaceComplexity: "O(1)",
};
