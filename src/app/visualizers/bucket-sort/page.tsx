
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BucketSortVisualizationPanel } from './BucketSortVisualizationPanel';
import { BucketSortCodePanel } from './BucketSortCodePanel'; 
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { BucketSortStep, AlgorithmMetadata, AlgorithmDetailsProps } from './types'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Rows, Play, Pause, SkipForward, RotateCcw, FastForward, Gauge } from 'lucide-react'; 
import { generateBucketSortSteps } from './bucket-sort-logic';
import { algorithmMetadata } from './metadata'; 
import { BUCKET_SORT_CODE_SNIPPETS } from './BucketSortCodePanel'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { SortingControlsPanel } from './SortingControlsPanel'; // Local import


const DEFAULT_ANIMATION_SPEED = 700; 
const MIN_SPEED = 100; 
const MAX_SPEED = 1800;
const DEFAULT_NUM_BUCKETS = 5;

export default function BucketSortVisualizerPage() {
  const { toast } = useToast();
    
  const [inputValue, setInputValue] = useState('29,25,3,49,9,37,21,43'); // Non-negative example
  const [numBuckets, setNumBuckets] = useState<number>(DEFAULT_NUM_BUCKETS);

  const [steps, setSteps] = useState<BucketSortStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [currentStepData, setCurrentStepData] = useState<BucketSortStep | null>(null);

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
    if (parsed.some(n => n < 0 || n > 999)) { // Bucket sort often assumes non-negative, and for viz small range
       toast({ title: "Input out of range", description: "Please enter non-negative numbers up to 999 for visualization.", variant: "destructive" });
      return null;
    }
    return parsed;
  }, [toast]);
  
  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      setCurrentStepData(steps[stepIndex]);
    }
  }, [steps]);

  const generateSteps = useCallback(() => {
    const parsedData = parseInput(inputValue);
    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
    }
    if (numBuckets <=0 || numBuckets > 10) {
        toast({title: "Invalid Bucket Count", description: "Number of buckets must be between 1 and 10.", variant: "destructive"});
        return;
    }

    if (parsedData !== null) {
      let newSteps: BucketSortStep[] = generateBucketSortSteps(parsedData, numBuckets);
      
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsFinished(newSteps.length <=1);

      if (newSteps.length > 0) {
        setCurrentStepData(newSteps[0]);
      } else { 
        setCurrentStepData({array: parsedData, activeIndices:[], swappingIndices:[], sortedIndices:[], currentLine: null, message:"Input processed", phase: 'initial', buckets: Array.from({length:numBuckets}, (_,i)=>({id:i, elements:[]}))});
      }
    } else {
        setSteps([]);
        setCurrentStepIndex(0);
        setCurrentStepData(null);
        setIsPlaying(false); setIsFinished(true); 
    }
  }, [inputValue, numBuckets, parseInput, toast]);

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

  const handleNumBucketsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0 && val <= 10) { // Limit buckets for viz
        setNumBuckets(val);
    } else if (e.target.value === "") {
        setNumBuckets(DEFAULT_NUM_BUCKETS); 
    } else if (val > 10) {
        toast({title: "Max Buckets", description: "Visualizer supports up to 10 buckets.", variant: "default"});
        setNumBuckets(10);
    } else if (val <= 0 && e.target.value !== "") {
        toast({title: "Min Buckets", description: "At least 1 bucket required.", variant: "default"});
        setNumBuckets(1);
    }
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
    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
    }
    setInputValue('29,25,3,49,9,37,21,43'); 
    setNumBuckets(DEFAULT_NUM_BUCKETS); 
  };
  
  const handleSpeedChange = (speedValue: number) => {
    setAnimationSpeed(speedValue);
  };

  const localAlgoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
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
              Could not load data for Bucket Sort.
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
          <Rows className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4"/>
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {algorithmMetadata.description} (Note: Assumes non-negative integers for visualization).
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <BucketSortVisualizationPanel step={currentStepData} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <BucketSortCodePanel 
              currentLine={currentStepData?.currentLine ?? null}
            />
          </div>
        </div>
        
         <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Input</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="customInputBS" className="text-sm font-medium">
                  Input Array (non-negative, comma-separated)
                </Label>
                <Input
                  id="customInputBS"
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="e.g., 29,25,3,49"
                  className="w-full"
                  disabled={isPlaying}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numBucketsInput" className="text-sm font-medium">
                  Number of Buckets (1-10)
                </Label>
                <Input
                  id="numBucketsInput"
                  type="number"
                  value={numBuckets}
                  onChange={handleNumBucketsChange}
                  min="1" max="10"
                  className="w-full"
                  disabled={isPlaying}
                />
              </div>
            </div>
            <Button onClick={generateSteps} disabled={isPlaying} className="w-full md:w-auto">Run / Reset Steps</Button>
            <div className="flex items-center justify-start pt-4 border-t">
                <Button
                    onClick={handleReset}
                    variant="outline"
                    disabled={isPlaying}
                    aria-label="Reset algorithm and input"
                >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset to Defaults
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {!isPlaying ? (
                  <Button onClick={handlePlay} disabled={isFinished || steps.length <=1} className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90" size="lg">
                    <Play className="mr-2 h-5 w-5" /> Play
                  </Button>
                ) : (
                  <Button onClick={handlePause} className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90" size="lg">
                    <Pause className="mr-2 h-5 w-5" /> Pause
                  </Button>
                )}
                <Button onClick={handleStep} variant="outline" disabled={isFinished || steps.length <=1} size="lg">
                  <SkipForward className="mr-2 h-5 w-5" /> Step
                </Button>
              </div>

              <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
                <Label htmlFor="speedControl" className="text-sm font-medium flex items-center">
                  <Gauge className="mr-2 h-4 w-4 text-muted-foreground" /> Animation Speed
                </Label>
                <div className="flex items-center gap-2">
                  <FastForward className="h-4 w-4 text-muted-foreground transform rotate-180" />
                  <Slider id="speedControl" min={MIN_SPEED} max={MAX_SPEED} step={50} value={[animationSpeed]} onValueChange={(v) => handleSpeedChange(v[0])} disabled={isPlaying} className="flex-grow" />
                  <FastForward className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground text-center">{animationSpeed} ms delay</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {localAlgoDetails && <AlgorithmDetailsCard {...localAlgoDetails} />}
      </main>
      <Footer />
    </div>
  );
}
