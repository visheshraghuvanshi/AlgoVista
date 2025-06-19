
// src/app/visualizers/tower-of-hanoi/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, AlgorithmDetailsProps, TowerOfHanoiStep } from './types'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Play, Pause, SkipForward, RotateCcw, FastForward, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";

import { algorithmMetadata } from './metadata'; // Local import
import { TowerOfHanoiCodePanel } from './TowerOfHanoiCodePanel';
import { TowerOfHanoiVisualizationPanel } from './TowerOfHanoiVisualizationPanel';
import { generateTowerOfHanoiSteps, TOWER_OF_HANOI_LINE_MAP } from './tower-of-hanoi-logic';

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 200;
const MAX_SPEED = 2000;
const DEFAULT_NUM_DISKS = 3;
const MAX_DISKS_FOR_VIS = 6; 

export default function TowerOfHanoiVisualizerPage() {
  const { toast } = useToast();
  
  const [numDisks, setNumDisks] = useState(DEFAULT_NUM_DISKS);
  const [steps, setSteps] = useState<TowerOfHanoiStep[]>([]);
  const [currentStep, setCurrentStep] = useState<TowerOfHanoiStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNumDisksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 1;
    val = Math.max(1, Math.min(val, MAX_DISKS_FOR_VIS)); 
    setNumDisks(val);
  };

  const generateNewSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (numDisks < 1 || numDisks > MAX_DISKS_FOR_VIS) {
        toast({title: "Invalid Disk Count", description: `Please enter between 1 and ${MAX_DISKS_FOR_VIS} disks.`, variant: "destructive"});
        return;
    }
    const newSteps = generateTowerOfHanoiSteps(numDisks);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setCurrentStep(newSteps[0] || null);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
  }, [numDisks, toast]);

  useEffect(() => {
    generateNewSteps();
  }, [numDisks, generateNewSteps]); 

  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      setCurrentStep(steps[stepIndex]);
    }
  }, [steps]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextIdx = currentStepIndex + 1;
        setCurrentStepIndex(nextIdx);
        updateVisualStateFromStep(nextIdx);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateVisualStateFromStep]);

  const handlePlay = () => {
    if (isFinished || steps.length <= 1 || currentStepIndex >= steps.length -1) {
      toast({ title: "Simulation Finished", description: "Reset to run again or change disk count.", variant: "default" });
      setIsPlaying(false); return;
    }
    setIsPlaying(true); setIsFinished(false);
  };
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(false);
    const nextIdx = currentStepIndex + 1;
    setCurrentStepIndex(nextIdx);
    updateVisualStateFromStep(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => {
    setIsPlaying(false);
    setIsFinished(true); 
    setNumDisks(DEFAULT_NUM_DISKS); 
    // generateNewSteps will be called by useEffect on numDisks change
  };
  
  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!algoDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle className="w-16 h-16 text-destructive" /></main>
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
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <TowerOfHanoiVisualizationPanel step={currentStep} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <TowerOfHanoiCodePanel currentLine={currentStep?.currentLine ?? null} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Setup</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="space-y-1">
                    <Label htmlFor="numDisksInput" className="text-sm font-medium">Number of Disks (1-{MAX_DISKS_FOR_VIS})</Label>
                    <Input id="numDisksInput" type="number" value={numDisks} onChange={handleNumDisksChange} min="1" max={MAX_DISKS_FOR_VIS.toString()} disabled={isPlaying} />
                </div>
                 <Button onClick={generateNewSteps} disabled={isPlaying} className="w-full md:w-auto self-end">Start / Reset Simulation</Button>
            </div>
            <div className="flex items-center justify-start pt-4 border-t">
                 {/* Reset to Defaults button - handled by N change or Start/Reset above */}
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

