
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from './RadixSortVisualizationPanel'; // Changed to specific import
import { RadixSortCodePanel, RADIX_SORT_CODE_SNIPPETS } from './RadixSortCodePanel'; 
import { SortingControlsPanel } from './SortingControlsPanel'; // Local import
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmStep, AlgorithmMetadata, AlgorithmDetailsProps } from './types'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { RADIX_SORT_LINE_MAP, generateRadixSortSteps } from './radix-sort-logic';
import { algorithmMetadata } from './metadata'; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 


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
      setIsFinished(newSteps.length <= 1); 


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
        setIsPlaying(false); setIsFinished(true); 
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
    setIsFinished(false); 
    setInputValue('170,45,75,90,802,24,2,66'); 
  };
  
  const handleSpeedChange = (speedValue: number) => {
    setAnimationSpeed(speedValue);
  };

  const localAlgoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? { // Use local type
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!algorithmMetadata) { // Check against local metadata
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
            <VisualizationPanel step={steps[currentStepIndex]} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <RadixSortCodePanel 
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
        {localAlgoDetails && <AlgorithmDetailsCard {...localAlgoDetails} />}
      </main>
      <Footer />
    </div>
  );
}
