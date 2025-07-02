
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, DPAlgorithmStep, AlgorithmDetailsProps } from './types'; // Local import
import { algorithmMetadata } from './metadata'; // Local import
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { LISVisualizationPanel } from './LISVisualizationPanel'; // Local import
import { LISCodePanel, LIS_CODE_SNIPPETS_N2 } from './LISCodePanel'; // Local import
import { generateLIS_N2_Steps } from './lis-logic'; 

const DEFAULT_ANIMATION_SPEED = 600;
const MIN_SPEED = 50;
const MAX_SPEED = 1500;
const DEFAULT_LIS_INPUT = "10,9,2,5,3,7,101,18";
const MAX_INPUT_SIZE = 12;

export default function LISVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [inputValue, setInputValue] = useState(DEFAULT_LIS_INPUT);
  
  const [steps, setSteps] = useState<DPAlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<DPAlgorithmStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  const parseInput = useCallback((value: string): number[] | null => {
    if (value.trim() === '') return [];
    const parsed = value.split(',').map(s => parseInt(s.trim(), 10));
    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Input", description: "Please enter comma-separated numbers.", variant: "destructive" });
      return null;
    }
    if (parsed.length > MAX_INPUT_SIZE) {
        toast({title: "Input Too Large", description: `Max ${MAX_INPUT_SIZE} numbers for optimal visualization.`, variant: "default"});
    }
    return parsed.slice(0, MAX_INPUT_SIZE);
  }, [toast]);

  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) setCurrentStep(steps[stepIndex]);
  }, [steps]);
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const nums = parseInput(inputValue);
    if (!nums) {
      setSteps([]); setCurrentStep(null); setIsFinished(true); return;
    }

    const newSteps = generateLIS_N2_Steps(nums);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    
    if (newSteps.length > 0) {
        setCurrentStep(newSteps[0]);
    } else {
        setCurrentStep(null);
    }
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

  }, [inputValue, parseInput, toast]);
  
  useEffect(() => { handleGenerateSteps(); }, [inputValue, handleGenerateSteps]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateVisualStateFromStep(nextIdx);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false); setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateVisualStateFromStep]);

  const handlePlay = () => { if (!isFinished && steps.length > 1) { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(false); const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateVisualStateFromStep(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => { 
    setIsPlaying(false); setIsFinished(false); 
    setInputValue(DEFAULT_LIS_INPUT);
  };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <TrendingUp className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <LISVisualizationPanel step={currentStep} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <LISCodePanel currentLine={currentStep?.currentLine ?? null} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Input</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="arrayInputLIS">Input Array (comma-separated, max {MAX_INPUT_SIZE})</Label>
                <Input id="arrayInputLIS" value={inputValue} onChange={e => setInputValue(e.target.value)} disabled={isPlaying}/>
              </div>
            </div>
            
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Input & Simulation</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex gap-2">
                {!isPlaying ? <Button onClick={handlePlay} disabled={isFinished || steps.length <=1} size="lg"><Play className="mr-2"/>Play</Button> 
                             : <Button onClick={handlePause} size="lg"><Pause className="mr-2"/>Pause</Button>}
                <Button onClick={handleStep} variant="outline" disabled={isFinished || steps.length <=1} size="lg"><SkipForward className="mr-2"/>Step</Button>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
                <Label htmlFor="speedControl">Animation Speed</Label>
                <Slider id="speedControl" min={MIN_SPEED} max={MAX_SPEED} step={50} value={[animationSpeed]} onValueChange={(v) => setAnimationSpeed(v[0])} disabled={isPlaying} />
                <p className="text-xs text-muted-foreground text-center">{animationSpeed} ms delay</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
