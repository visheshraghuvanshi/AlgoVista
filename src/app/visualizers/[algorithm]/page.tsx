
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { CodePanel } from '@/components/algo-vista/code-panel';
import { ControlsPanel } from '@/components/algo-vista/controls-panel';
import type { AlgorithmMetadata } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page'; // Using the same mock
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';

// Mock code for Bubble Sort
const BUBBLE_SORT_CODE = [
  "function bubbleSort(arr) {",
  "  let n = arr.length;",
  "  let swapped;",
  "  do {",
  "    swapped = false;",
  "    for (let i = 0; i < n - 1; i++) {",
  "      if (arr[i] > arr[i + 1]) {",
  "        // Swap arr[i] and arr[i+1]",
  "        let temp = arr[i];",
  "        arr[i] = arr[i + 1];",
  "        arr[i + 1] = temp;",
  "        swapped = true;",
  "      }",
  "    }",
  "    n--; // Optimization: last element is in place",
  "  } while (swapped);",
  "  return arr;",
  "}",
];

export default function AlgorithmVisualizerPage() {
  const params = useParams();
  const { toast } = useToast();
  const algorithmSlug = typeof params.algorithm === 'string' ? params.algorithm : '';
  
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);
  const [data, setData] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('5,1,9,3,7,4,6,2,8');
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === algorithmSlug);
    if (foundAlgorithm) {
      setAlgorithm(foundAlgorithm);
    } else {
      // Handle algorithm not found, maybe redirect or show error
      console.error("Algorithm not found:", algorithmSlug);
    }
  }, [algorithmSlug]);

  const parseInput = useCallback((value: string): number[] => {
    if (value.trim() === '') return [];
    return value.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => parseInt(s, 10))
      .filter(n => !isNaN(n));
  }, []);

  useEffect(() => {
    setData(parseInput(inputValue));
  }, [inputValue, parseInput]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsFinished(false);
    // Potentially add validation here
    const parsed = parseInput(value);
    if (value.trim() !== '' && parsed.length === 0 && value.split(',').some(s => isNaN(parseInt(s.trim())))) {
        toast({
            title: "Invalid Input",
            description: "Please enter comma-separated numbers only.",
            variant: "destructive",
        });
    } else if (parsed.some(n => n > 999 || n < -999)) {
         toast({
            title: "Input out of range",
            description: "Please enter numbers between -999 and 999.",
            variant: "destructive",
        });
    }
  };

  const handlePlay = () => {
    if (data.length === 0) {
      toast({ title: "Cannot Play", description: "Please enter data to visualize.", variant: "destructive" });
      return;
    }
    setIsPlaying(true);
    setIsFinished(false);
    // Mock playing: cycle through lines and indices
    setCurrentLine(1);
    setActiveIndices([0,1]);
    // Actual algorithm logic would go here
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStep = () => {
    if (data.length === 0) {
      toast({ title: "Cannot Step", description: "Please enter data to visualize.", variant: "destructive" });
      return;
    }
    setIsFinished(false);
    // Mock stepping
    setCurrentLine(prev => (prev === null || prev >= BUBBLE_SORT_CODE.length ? 1 : prev + 1));
    setActiveIndices(prev => prev.length > 0 ? [(prev[0] + 1) % data.length, (prev[1] + 1) % data.length] : [0,1]);
    setSwappingIndices([]); // Clear swapping on step
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsFinished(false);
    setCurrentLine(null);
    setActiveIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    setInputValue('5,1,9,3,7,4,6,2,8'); // Reset to default or clear
    setData(parseInput('5,1,9,3,7,4,6,2,8'));
  };

  if (!algorithm) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Not Found</h1>
            <p className="text-muted-foreground text-lg">
              The visualizer for &quot;{algorithmSlug}&quot; could not be found.
            </p>
            <p className="text-muted-foreground mt-1">
              Please check the URL or navigate back to the visualizers page.
            </p>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine which code to display. For now, only Bubble Sort.
  const codeToDisplay = algorithm.slug === 'bubble-sort' ? BUBBLE_SORT_CODE : ["// Code not available for this algorithm yet."];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithm.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {algorithm.description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side: Visualization Panel */}
          <div className="lg:w-3/5">
            <VisualizationPanel 
              data={data} 
              activeIndices={activeIndices}
              swappingIndices={swappingIndices}
              sortedIndices={sortedIndices}
            />
          </div>

          {/* Right side: Code Panel */}
          <div className="lg:w-2/5">
            <CodePanel 
              codeLines={codeToDisplay} 
              currentLine={currentLine} 
            />
          </div>
        </div>

        {/* Bottom: Controls Panel */}
        <div className="mt-6">
          <ControlsPanel
            onPlay={handlePlay}
            onPause={handlePause}
            onStep={handleStep}
            onReset={handleReset}
            onInputChange={handleInputChange}
            inputValue={inputValue}
            isPlaying={isPlaying}
            isFinished={isFinished}
          />
        </div>
        
        {/* TODO: Add Explanation Panel and Legend as per PRD */}

      </main>
      <Footer />
    </div>
  );
}
