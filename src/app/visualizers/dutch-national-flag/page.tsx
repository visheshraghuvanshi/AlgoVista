
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from './VisualizationPanel'; // Local import
import { DutchNationalFlagCodePanel, DUTCH_NATIONAL_FLAG_CODE_SNIPPETS } from './DutchNationalFlagCodePanel'; 
import { SortingControlsPanel } from './SortingControlsPanel'; // Local import
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, AlgorithmStep, AlgorithmDetailsProps } from './types'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react'; // Keep AlertTriangle for error states
import { Layers } from 'lucide-react'; // Icon for DNF
import { DUTCH_NATIONAL_FLAG_LINE_MAP, generateDutchNationalFlagSteps } from './dutch-national-flag-logic';
import { algorithmMetadata } from './metadata'; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 

const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

export default function DutchNationalFlagVisualizerPage() {
  const { toast } = useToast();
  
  const [inputValue, setInputValue] = useState('0,1,2,0,1,1,2,0,2,1,0'); 
  
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
    const parsed = value.split(',').map(s => s.trim()).filter(s => s !== '').map(s => parseInt(s, 10));
    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Input", description: "Please enter comma-separated numbers (0, 1, or 2).", variant: "destructive" });
      return null;
    }
    if (parsed.some(n => ![0,1,2].includes(n))) {
       toast({ title: "Invalid Values", description: "Array must contain only 0s, 1s, and 2s.", variant: "destructive" });
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
      setAuxiliaryData(currentS.auxiliaryData || null); // Ensure auxData is updated
    }
  }, [steps, setDisplayedData, setActiveIndices, setSwappingIndices, setSortedIndices, setCurrentLine, setProcessingSubArrayRange, setPivotActualIndex, setAuxiliaryData]); // Added setters
  
  const generateSteps = useCallback(() => {
    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
    }
    const parsedArray = parseInput(inputValue);

    if (parsedArray !== null) {
      const newSteps = generateDutchNationalFlagSteps(parsedArray);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsFinished(newSteps.length <= 1);

      if (newSteps.length > 0) {
        const firstStep = newSteps[0];
        setDisplayedData(firstStep.array);
        setActiveIndices(firstStep.activeIndices);
        setSwappingIndices(firstStep.swappingIndices);
        setSortedIndices(firstStep.sortedIndices);
        setCurrentLine(firstStep.currentLine);
        setProcessingSubArrayRange(firstStep.processingSubArrayRange || null);
        setPivotActualIndex(firstStep.pivotActualIndex || null);
        setAuxiliaryData(firstStep.auxiliaryData || null); // Set auxData for the first step
      } else { 
        setDisplayedData(parsedArray); 
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null); setAuxiliaryData(null);
      }
    } else { 
      setSteps([]); setCurrentStepIndex(0);
      setDisplayedData([]);
      setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
      setProcessingSubArrayRange(null); setPivotActualIndex(null); setAuxiliaryData(null);
      setIsPlaying(false); setIsFinished(true);
    }
  }, [
    inputValue, 
    parseInput, 
    setSteps, 
    setCurrentStepIndex, 
    setIsPlaying, 
    setIsFinished,
    setDisplayedData,
    setActiveIndices,
    setSwappingIndices,
    setSortedIndices,
    setCurrentLine,
    setProcessingSubArrayRange,
    setPivotActualIndex,
    setAuxiliaryData 
  ]);


  useEffect(() => {
    generateSteps();
  }, [generateSteps]); 

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);
        updateStateFromStep(nextStepIndex);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateStateFromStep]);

  const handleInputChange = (value: string) => setInputValue(value);

  const handlePlay = () => {
    if (isFinished || steps.length <= 1 || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Play", description: isFinished ? "Algorithm finished. Reset to play." : "No steps. Check input.", variant: "default" });
      setIsPlaying(false); return;
    }
    setIsPlaying(true); setIsFinished(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
  };

  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Step", description: isFinished ? "Algorithm finished. Reset to step." : "No steps.", variant: "default" });
      return;
    }
    setIsPlaying(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStepIndex(nextStepIndex);
      updateStateFromStep(nextStepIndex);
      if (nextStepIndex === steps.length - 1) setIsFinished(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false); setIsFinished(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    setInputValue('0,1,2,0,1,1,2,0,2,1,0'); 
    // generateSteps will be called by useEffect due to inputValue change
  };

  const handleSpeedChange = (speedValue: number) => setAnimationSpeed(speedValue);

  const localAlgoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? { 
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!algorithmMetadata || !localAlgoDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
          <p className="text-muted-foreground text-lg">Could not load data for Dutch National Flag.</p>
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
          <Layers className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" /> {/* Changed icon */}
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{steps[currentStepIndex]?.message || algorithmMetadata.description}</p>
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
                    <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm font-medium text-center">Algorithm Pointers</CardTitle></CardHeader>
                    <CardContent className="text-sm flex justify-around p-3">
                        <p><strong>Low:</strong> {auxiliaryData.low?.toString()}</p>
                        <p><strong>Mid:</strong> {auxiliaryData.mid?.toString()}</p>
                        <p><strong>High:</strong> {auxiliaryData.high?.toString()}</p>
                    </CardContent>
                </Card>
            )}
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <DutchNationalFlagCodePanel
              codeSnippets={DUTCH_NATIONAL_FLAG_CODE_SNIPPETS}
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
         <AlgorithmDetailsCard {...localAlgoDetails} />
      </main>
      <Footer />
    </div>
  );
}
