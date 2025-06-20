
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from './VisualizationPanel'; 
import { DutchNationalFlagCodePanel } from './DutchNationalFlagCodePanel'; 
import { SortingControlsPanel } from './SortingControlsPanel'; 
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; 
import type { AlgorithmStep, AlgorithmMetadata, AlgorithmDetailsProps } from './types'; 
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Layers } from 'lucide-react'; 
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
  const [activeIndices, setActiveIndices] = useState<number[]>([]); // Stores [low, mid, high]
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]); 
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [processingSubArrayRange, setProcessingSubArrayRange] = useState<[number, number] | null>(null);
  const [pivotActualIndex, setPivotActualIndex] = useState<number | null>(null); // Not used for DNF
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
    if (parsed.length > 20) {
        toast({title: "Input Too Large", description: "Max 20 elements for optimal visualization.", variant: "default"});
        return parsed.slice(0, 20); // Truncate
    }
    return parsed;
  }, [toast]);

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setDisplayedData(currentS.array);
      setActiveIndices(currentS.activeIndices); // [low, mid, high]
      setSwappingIndices(currentS.swappingIndices);
      setSortedIndices(currentS.sortedIndices); // Reflects 0s and 2s sections
      setCurrentLine(currentS.currentLine);
      setProcessingSubArrayRange(currentS.processingSubArrayRange || null);
      setAuxiliaryData(currentS.auxiliaryData || null);
    }
  }, [steps]);
  
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
        setAuxiliaryData(firstStep.auxiliaryData || null);
      } else { 
        setDisplayedData(parsedArray); 
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setAuxiliaryData(null);
      }
    } else { 
      setSteps([]); setCurrentStepIndex(0);
      setDisplayedData([]);
      setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
      setProcessingSubArrayRange(null); setAuxiliaryData(null);
      setIsPlaying(false); setIsFinished(true);
    }
  }, [
    inputValue, 
    parseInput, 
    setDisplayedData,
    setActiveIndices,
    setSwappingIndices,
    setSortedIndices,
    setCurrentLine,
    setProcessingSubArrayRange,
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
  
  const legendColors = [
    { label: "0 (Red)", color: "bg-red-500 text-white" },
    { label: "1 (White)", color: "bg-white text-black border border-gray-400" },
    { label: "2 (Blue)", color: "bg-blue-500 text-white" },
    { label: "Mid Pointer Focus", color: "bg-purple-500 text-white"},
    { label: "Swapping", color: "bg-yellow-400 text-black"},
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Layers className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" /> 
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{steps[currentStepIndex]?.message || algorithmMetadata.description}</p>
            {auxiliaryData?.currentPointers && (
                <div className="mt-2 text-sm font-mono text-muted-foreground">
                    Low: {auxiliaryData.currentPointers.low}, Mid: {auxiliaryData.currentPointers.mid}, High: {auxiliaryData.currentPointers.high}
                </div>
            )}
        </div>
        {/* Legend */}
        <div className="flex justify-center flex-wrap gap-2 my-4">
          {legendColors.map(item => (
            <div key={item.label} className="flex items-center space-x-1 text-xs">
              <span className={`inline-block w-3 h-3 rounded-full ${item.color.split(' ')[0]} ${item.color.includes('border') ? item.color.split(' ')[2] : ''}`}></span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <VisualizationPanel
              data={displayedData}
              activeIndices={activeIndices}
              swappingIndices={swappingIndices}
              sortedIndices={sortedIndices} 
              processingSubArrayRange={processingSubArrayRange}
              pivotActualIndex={pivotActualIndex} // Not used but part of props
              auxiliaryData={auxiliaryData}
            />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <DutchNationalFlagCodePanel
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

