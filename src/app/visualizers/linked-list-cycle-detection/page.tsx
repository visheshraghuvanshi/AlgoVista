
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LinkedListVisualizationPanel } from './LinkedListVisualizationPanel';
import { LinkedListCycleDetectionCodePanel } from './LinkedListCycleDetectionCodePanel';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard';
import type { AlgorithmMetadata, LinkedListAlgorithmStep, AlgorithmDetailsProps } from './types';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { generateCycleDetectionSteps } from './linked-list-cycle-detection-logic';
import { algorithmMetadata } from './metadata';

const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 1800;

export default function LinkedListCycleDetectionPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [initialListStr, setInitialListStr] = useState('1,2,3,4,5,6');
  const [cycleConnectsTo, setCycleConnectsTo] = useState('3'); 

  const [steps, setSteps] = useState<LinkedListAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState<LinkedListAlgorithmStep | null>(null);
  
  const [isCycleActuallyDetected, setIsCycleActuallyDetected] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

    const cycleTarget = cycleConnectsTo.trim() === '' ? undefined : (isNaN(Number(cycleConnectsTo)) ? cycleConnectsTo : Number(cycleConnectsTo));

    const newSteps = generateCycleDetectionSteps(initialListStr, cycleTarget);
    setSteps(newSteps);
  }, [initialListStr, cycleConnectsTo]);
  
  useEffect(() => { handleGenerateSteps(); }, [handleGenerateSteps]);

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(steps.length <= 1);
    setIsCycleActuallyDetected(false); 
    if (steps.length > 0) {
      const lastStep = steps[steps.length - 1];
      setCurrentStep(steps[0]);
       if (lastStep.isCycleDetected !== undefined) {
         setIsCycleActuallyDetected(lastStep.isCycleDetected);
       }
    }
  }, [steps]);
  
  useEffect(() => {
     if(steps[currentStepIndex]) {
        setCurrentStep(steps[currentStepIndex]);
     }
  }, [currentStepIndex, steps]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextIdx = currentStepIndex + 1;
        setCurrentStepIndex(nextIdx);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps.length, animationSpeed]);

  const handlePlay = () => { if (!isFinished && steps.length > 1) { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(false); const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => {
    setIsPlaying(false); setIsFinished(true); setInitialListStr('1,2,3,4,5,6'); setCycleConnectsTo('3');
  };
  
  useEffect(() => { 
    handleReset(); 
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!algorithmMetadata) return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle /></main><Footer /></div>;
  
  const localAlgoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center"><h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary dark:text-accent">{algorithmMetadata.title}</h1></div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3"><LinkedListVisualizationPanel step={currentStep} /></div>
          <div className="lg:w-2/5 xl:w-1/3"><LinkedListCycleDetectionCodePanel currentLine={currentStep?.currentLine ?? null} /></div>
        </div>
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Setup</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                    <Label htmlFor="initialListInput" className="text-sm font-medium">List (comma-separated)</Label>
                    <Input id="initialListInput" value={initialListStr} onChange={e => setInitialListStr(e.target.value)} placeholder="e.g., 1,2,3,4,5" disabled={isPlaying} />
                </div>
                <div>
                    <Label htmlFor="cycleConnectToInput" className="text-sm font-medium">Tail Connects to Value (optional)</Label>
                    <Input id="cycleConnectToInput" value={cycleConnectsTo} onChange={e => setCycleConnectsTo(e.target.value)} placeholder="e.g., 3 (makes tail->3)" disabled={isPlaying} />
                </div>
            </div>
             <Button onClick={handleGenerateSteps} disabled={isPlaying}>Generate/Reset List & Steps</Button>
             {isFinished && <p className={`font-bold text-lg mt-2 ${isCycleActuallyDetected ? 'text-green-500' : 'text-red-500'}`}>{isCycleActuallyDetected ? 'Cycle Detected!' : 'No Cycle Found.'}</p>}
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying} aria-label="Reset visualization and inputs">
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset To Default
                </Button>
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
                <p className="text-xs text-muted-foreground text-center">{animationSpeed} ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <AlgorithmDetailsCard {...localAlgoDetails} />
      </main>
      <Footer />
    </div>
  );
}
