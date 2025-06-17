
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { AlgorithmMetadata } from '@/types';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizerCard } from '@/components/algo-vista/visualizer-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ListFilter, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MOCK_ALGORITHMS: AlgorithmMetadata[] = [
  { 
    slug: 'bubble-sort', 
    title: 'Bubble Sort', 
    category: 'Sorting', 
    difficulty: 'Easy', 
    description: 'A simple comparison-based sorting algorithm where adjacent elements are repeatedly compared and swapped if they are in the wrong order.',
  },
  { 
    slug: 'insertion-sort', 
    title: 'Insertion Sort', 
    category: 'Sorting', 
    difficulty: 'Easy', 
    description: 'Builds the final sorted array one item at a time by repeatedly taking the next item and inserting it into its correct position within the sorted portion.',
  },
  { 
    slug: 'merge-sort', 
    title: 'Merge Sort', 
    category: 'Sorting', 
    difficulty: 'Medium', 
    description: 'A divide-and-conquer algorithm that divides the array into halves, sorts them, and then merges them back together.',
  },
  { 
    slug: 'quick-sort', 
    title: 'Quick Sort', 
    category: 'Sorting', 
    difficulty: 'Medium', 
    description: 'A highly efficient divide-and-conquer sorting algorithm that picks an element as a pivot and partitions the array around the pivot.',
  },
  { 
    slug: 'heap-sort', 
    title: 'Heap Sort', 
    category: 'Sorting', 
    difficulty: 'Hard', 
    description: 'A comparison-based sorting technique based on a Binary Heap data structure.',
  },
  { slug: 'linear-search', title: 'Linear Search', category: 'Searching', difficulty: 'Easy', description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.' },
  { slug: 'binary-search', title: 'Binary Search', category: 'Searching', difficulty: 'Easy', description: 'Efficiently finds an item from a sorted list of items by repeatedly dividing the search interval in half.' },
  { slug: 'bfs', title: 'Breadth-First Search (BFS)', category: 'Graph', difficulty: 'Medium', description: 'An algorithm for traversing graph data structures by exploring all neighbor nodes at the present depth prior to moving on to nodes at the next depth level.' },
  { slug: 'dfs', title: 'Depth-First Search (DFS)', category: 'Graph', difficulty: 'Medium', description: 'An algorithm for traversing graph data structures by exploring as far as possible along each branch before backtracking.' },
  { slug: 'dijkstra', title: 'Dijkstra\'s Algorithm', category: 'Graph', difficulty: 'Hard', description: 'Finds the shortest paths between nodes in a graph, which may represent, for example, road networks.' },
  { slug: 'binary-tree-traversal', title: 'Binary Tree Traversal', category: 'Tree', difficulty: 'Medium', description: 'Covers Inorder, Preorder, and Postorder traversals for binary trees.' },
  { slug: 'linked-list-operations', title: 'Linked List Operations', category: 'Data Structures', difficulty: 'Easy', description: 'Visualize insertion, deletion, and search in singly linked lists.'},
  { slug: 'stack-queue', title: 'Stack & Queue', category: 'Data Structures', difficulty: 'Easy', description: 'Illustrates LIFO (Stack) and FIFO (Queue) principles with basic operations.'},
];

const ALL_CATEGORIES = Array.from(new Set(MOCK_ALGORITHMS.map(algo => algo.category))).sort();
const ALL_DIFFICULTIES: Array<AlgorithmMetadata['difficulty']> = ['Easy', 'Medium', 'Hard'];
const ALL_FILTER_SENTINEL_VALUE = "__all__";


export default function VisualizersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<AlgorithmMetadata['difficulty'] | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredAlgorithms = useMemo(() => {
    return MOCK_ALGORITHMS.filter(algo => {
      const matchesSearch = searchTerm.trim() === '' ||
        algo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        algo.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || algo.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || algo.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedDifficulty(null);
  };
  
  const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty;

  if (!isClient) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-12 text-center">
                    <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
                        Explore Visualizers
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Loading interactive visualizations...
                    </p>
                </div>
                 <div className="sticky top-16 bg-background/90 dark:bg-background/80 backdrop-blur-md z-40 py-4 mb-8 rounded-lg shadow">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="h-10 bg-muted rounded-md lg:col-span-2"></div>
                            <div className="h-10 bg-muted rounded-md"></div>
                            <div className="h-10 bg-muted rounded-md"></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-64 bg-card rounded-xl shadow-lg"></div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            Explore Visualizers
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Dive into interactive visualizations of data structures and algorithms. Choose a topic below to get started.
          </p>
        </div>

        <div className="sticky top-[calc(theme(spacing.16)+1px)] bg-background/95 dark:bg-background/90 backdrop-blur-md z-40 py-4 mb-8 rounded-lg shadow-md border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search algorithms (e.g., Merge Sort, BFS)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                  aria-label="Search algorithms"
                />
              </div>
              <div>
                <Select
                  value={selectedCategory || ALL_FILTER_SENTINEL_VALUE}
                  onValueChange={(value) => {
                    setSelectedCategory(value === ALL_FILTER_SENTINEL_VALUE ? null : value);
                  }}
                >
                  <SelectTrigger className="w-full" aria-label="Filter by category">
                    <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_FILTER_SENTINEL_VALUE}>All Categories</SelectItem>
                    {ALL_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={selectedDifficulty || ALL_FILTER_SENTINEL_VALUE}
                  onValueChange={(value) => {
                    setSelectedDifficulty(value === ALL_FILTER_SENTINEL_VALUE ? null : value as AlgorithmMetadata['difficulty'] | null);
                  }}
                >
                  <SelectTrigger className="w-full" aria-label="Filter by difficulty">
                    <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="All Difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_FILTER_SENTINEL_VALUE}>All Difficulties</SelectItem>
                    {ALL_DIFFICULTIES.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="md:col-start-2 lg:col-start-auto text-sm text-muted-foreground hover:text-primary dark:hover:text-accent">
                  <XCircle className="mr-2 h-4 w-4" /> Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {filteredAlgorithms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredAlgorithms.map(algo => (
              <VisualizerCard key={algo.slug} algorithm={algo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground font-semibold">No visualizers match your criteria.</p>
            <p className="mt-2 text-muted-foreground">Try adjusting your search or filters.</p>
             {hasActiveFilters && (
                <Button variant="link" onClick={clearFilters} className="mt-4 text-primary dark:text-accent">
                   Clear all filters
                </Button>
              )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
