
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { RadixSortCodePanel } from './RadixSortCodePanel'; 
import { SortingControlsPanel } from '@/components/algo-vista/sorting-controls-panel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmStep } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { RADIX_SORT_LINE_MAP, generateRadixSortSteps } from './radix-sort-logic';
import { algorithmMetadata } from './metadata'; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // For auxiliary data display

const RADIX_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "// Radix Sort (JavaScript - LSD, using Counting Sort as helper)", 
    "function radixSort(arr) {",                                
    "  if (arr.length === 0) return arr;",
    "  const maxVal = Math.max(...arr);",                       
    "  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {", 
    "    countingSortForRadix(arr, exp);",                      
    "  }",
    "  return arr;",                                            
    "}",                                                        
    "",
    "function countingSortForRadix(arr, exp) {",                 
    "  const n = arr.length;",                                  
    "  const output = new Array(n);",                           
    "  const count = new Array(10).fill(0);",                   
    "",
    "  for (let i = 0; i < n; i++) {",                           
    "    const digit = Math.floor(arr[i] / exp) % 10;",         
    "    count[digit]++;",                                      
    "  }",                                                      
    "",
    "  for (let i = 1; i < 10; i++) {",                          
    "    count[i] += count[i - 1];",                            
    "  }",                                                      
    "",
    "  for (let i = n - 1; i >= 0; i--) {",                      
    "    const digit = Math.floor(arr[i] / exp) % 10;",         
    "    output[count[digit] - 1] = arr[i];",                   
    "    count[digit]--;",                                      
    "  }",                                                      
    "",
    "  for (let i = 0; i < n; i++) {",                           
    "    arr[i] = output[i];",                                  
    "  }",                                                      
    "}",                                                        
  ],
  Python: [
    "def counting_sort_for_radix(arr, exp):",
    "    n = len(arr)",
    "    output = [0] * n",
    "    count = [0] * 10",
    "    for i in range(n):",
    "        index = arr[i] // exp",
    "        count[index % 10] += 1",
    "    for i in range(1, 10):",
    "        count[i] += count[i - 1]",
    "    i = n - 1",
    "    while i >= 0:",
    "        index = arr[i] // exp",
    "        output[count[index % 10] - 1] = arr[i]",
    "        count[index % 10] -= 1",
    "        i -= 1",
    "    for i in range(n):",
    "        arr[i] = output[i]",
    "",
    "def radix_sort(arr):",
    "    if not arr: return arr",
    "    max_val = max(arr)",
    "    exp = 1",
    "    while max_val // exp > 0:",
    "        counting_sort_for_radix(arr, exp)",
    "        exp *= 10",
    "    return arr",
  ],
   Java: [
    "import java.util.Arrays;",
    "class RadixSort {",
    "    static void countingSort(int arr[], int n, int exp) {",
    "        int output[] = new int[n];",
    "        int count[] = new int[10];",
    "        Arrays.fill(count, 0);",
    "        for (int i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;",
    "        for (int i = 1; i < 10; i++) count[i] += count[i - 1];",
    "        for (int i = n - 1; i >= 0; i--) {",
    "            output[count[(arr[i] / exp) % 10] - 1] = arr[i];",
    "            count[(arr[i] / exp) % 10]--;",
    "        }",
    "        for (int i = 0; i < n; i++) arr[i] = output[i];",
    "    }",
    "    static void radixSort(int arr[]) {",
    "        if (arr.length == 0) return;",
    "        int maxVal = arr[0];",
    "        for (int i = 1; i < arr.length; i++) if (arr[i] > maxVal) maxVal = arr[i];",
    "        for (int exp = 1; maxVal / exp > 0; exp *= 10)",
    "            countingSort(arr, arr.length, exp);",
    "    }",
    "}",
  ],
  "C++": [
    "#include <vector>",
    "#include <algorithm> // For std::max_element",
    "void countingSortForRadix(std::vector<int>& arr, int exp) {",
    "    int n = arr.size();",
    "    std::vector<int> output(n);",
    "    std::vector<int> count(10, 0);",
    "    for (int i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;",
    "    for (int i = 1; i < 10; i++) count[i] += count[i - 1];",
    "    for (int i = n - 1; i >= 0; i--) {",
    "        output[count[(arr[i] / exp) % 10] - 1] = arr[i];",
    "        count[(arr[i] / exp) % 10]--;",
    "    }",
    "    for (int i = 0; i < n; i++) arr[i] = output[i];",
    "}",
    "void radixSort(std::vector<int>& arr) {",
    "    if (arr.empty()) return;",
    "    int maxVal = 0;",
    "    if (!arr.empty()) maxVal = *std::max_element(arr.begin(), arr.end());",
    "    for (int exp = 1; maxVal / exp > 0; exp *= 10)",
    "        countingSortForRadix(arr, exp);",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 700; 
const MIN_SPEED = 100; 
const MAX_SPEED = 2000;

export default function RadixSortVisualizerPage() {
  const { toast } = useToast();
    
  const [inputValue, setInputValue] = useState('170,45,75,90,802,24,2,66');

  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [displayedData, setDisplayedData] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [processingSubArrayRange, setProcessingSubArrayRange] = useState<[number, number] | null>(null);
  const [pivotActualIndex, setPivotActualIndex] = useState<number | null>(null);
  const [auxiliaryData, setAuxiliaryData] = useState<AlgorithmStep['auxiliaryData']>(null);


  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAlgoImplemented = true; 

  const parseInput = useCallback((value: string): number[] | null => {
    if (value.trim() === '') return [];
    const parsed = value.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => parseInt(s, 10));

    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Input", description: "Please enter comma-separated non-negative integers.", variant: "destructive" });
      return null;
    }
    if (parsed.some(n => n < 0 || n > 9999)) { // Radix for non-negative, limit max for viz
       toast({ title: "Input out of range", description: "Please enter numbers between 0 and 9999.", variant: "destructive" });
      return null;
    }
    return parsed;
  }, [toast]);
  
  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setDisplayedData(currentS.array);
      setActiveIndices(currentS.activeIndices);
      setSwappingIndices(currentS.swappingIndices);
      setSortedIndices(currentS.sortedIndices);
      setCurrentLine(currentS.currentLine);
      setProcessingSubArrayRange(currentS.processingSubArrayRange || null);
      setPivotActualIndex(currentS.pivotActualIndex || null);
      setAuxiliaryData(currentS.auxiliaryData || null);
    }
  }, [steps]);

  const generateSteps = useCallback(() => {
    const parsedData = parseInput(inputValue);
    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
    }
    if (parsedData !== null) {
      let newSteps: AlgorithmStep[] = generateRadixSortSteps(parsedData);
      
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsFinished(newSteps.length <= 1); // Finish if only one step (e.g. error or empty array)


      if (newSteps.length > 0) {
        updateStateFromStep(0);
      } else { 
        setDisplayedData(parsedData);
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null); setAuxiliaryData(null);
      }
    } else {
        setSteps([]);
        setCurrentStepIndex(0);
        setDisplayedData([]); 
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null); setAuxiliaryData(null);
        setIsPlaying(false); setIsFinished(true); // No steps to play
    }
  }, [inputValue, parseInput, updateStateFromStep]);

  useEffect(() => {
    generateSteps();
  }, [generateSteps]); 


  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length -1 ) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);
        updateStateFromStep(nextStepIndex);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length -1) {
        setIsPlaying(false);
        setIsFinished(true);
    }
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateStateFromStep]);


  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handlePlay = () => {
    if (isFinished || steps.length <= 1 || currentStepIndex >= steps.length -1) {
      toast({ title: "Cannot Play", description: isFinished ? "Algorithm finished. Reset to play again." : "No data or steps to visualize.", variant: "default" });
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setIsFinished(false); 
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  };

  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length -1) {
       toast({ title: "Cannot Step", description: isFinished ? "Algorithm finished. Reset to step again." : "No data or steps to visualize.", variant: "default" });
      return;
    }
    setIsPlaying(false); 
     if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStepIndex(nextStepIndex);
      updateStateFromStep(nextStepIndex);
      if (nextStepIndex === steps.length - 1) {
        setIsFinished(true);
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsFinished(false); // Allow playing new steps
    setInputValue('170,45,75,90,802,24,2,66'); // Reset to default
    // generateSteps will be called by useEffect due to inputValue change
  };
  
  const handleSpeedChange = (speedValue: number) => {
    setAnimationSpeed(speedValue);
  };

  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!algorithmMetadata) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
            <p className="text-muted-foreground text-lg">
              Could not load data for Radix Sort.
            </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {steps[currentStepIndex]?.message || algorithmMetadata.description} (Note: Only non-negative integers supported for this visualization.)
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <VisualizationPanel 
              data={displayedData} 
              activeIndices={activeIndices}
              swappingIndices={swappingIndices}
              sortedIndices={sortedIndices}
              processingSubArrayRange={processingSubArrayRange}
              pivotActualIndex={pivotActualIndex}
            />
             {auxiliaryData && (
                <Card className="mt-4">
                    <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm font-medium text-center">Current Pass Info</CardTitle></CardHeader>
                    <CardContent className="text-sm flex flex-wrap justify-around gap-2 p-3">
                        {auxiliaryData.exponent !== undefined && <p><strong>Exponent (Digit Place):</strong> {auxiliaryData.exponent}</p>}
                        {auxiliaryData.countArray && <p><strong>Count Array (Digit Frequencies):</strong> <span className="font-mono text-xs break-all">[{auxiliaryData.countArray.join(', ')}]</span></p>}
                         {auxiliaryData.outputArray && <p><strong>Output Array (Current Pass):</strong> <span className="font-mono text-xs break-all">[{auxiliaryData.outputArray.join(', ')}]</span></p>}
                         {auxiliaryData.currentDigitProcessing !== undefined && <p><strong>Processing Digit:</strong> {auxiliaryData.currentDigitProcessing}</p>}
                    </CardContent>
                </Card>
            )}
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <RadixSortCodePanel 
              codeSnippets={RADIX_SORT_CODE_SNIPPETS} 
              currentLine={currentLine}
            />
          </div>
        </div>
        
        <div className="w-full">
          <SortingControlsPanel
            onPlay={handlePlay}
            onPause={handlePause}
            onStep={handleStep}
            onReset={handleReset}
            onInputChange={handleInputChange}
            inputValue={inputValue}
            isPlaying={isPlaying}
            isFinished={isFinished}
            currentSpeed={animationSpeed}
            onSpeedChange={handleSpeedChange}
            isAlgoImplemented={isAlgoImplemented} 
            minSpeed={MIN_SPEED}
            maxSpeed={MAX_SPEED}
          />
        </div>
        {algoDetails && <AlgorithmDetailsCard {...algoDetails} />}
      </main>
      <Footer />
    </div>
  );
}
