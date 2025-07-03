
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LinkedListVisualizationPanel } from './LinkedListVisualizationPanel'; // Local import
import { LinkedListReversalCodePanel } from './LinkedListReversalCodePanel'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, LinkedListAlgorithmStep, LinkedListNodeVisual } from './types'; // Local import
import type { ReversalTypeInternal as ReversalType } from './types'; // Renamed for clarity in this file
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Play, Pause, SkipForward, RotateCcw, FastForward, Gauge } from 'lucide-react';
import { generateLinkedListReversalSteps } from './linked-list-reversal-logic';
import { algorithmMetadata } from './metadata'; 
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DEFAULT_ANIMATION_SPEED = 900;
const MIN_SPEED = 150;
const MAX_SPEED = 2200;

export default function LinkedListReversalPage() {
  const { toast } = useToast();
  
  const [initialListStr, setInitialListStr] = useState('1,2,3,4');
  const [reversalType, setReversalType] = useState<ReversalType>('iterative');
  
  const [steps, setSteps] = useState<LinkedListAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState<LinkedListAlgorithmStep | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (reversalType === 'init') { 
        const initSteps = generateLinkedListReversalSteps(initialListStr, 'iterative'); 
        if (initSteps.length > 0) {
            const firstStep = initSteps[0];
             setSteps([firstStep]); 
             if(steps[0]) setCurrentStep(steps[0]);
        } else {
             setSteps([]); setCurrentStep(null);
        }
        setIsPlaying(false); setIsFinished(true); 
        return;
    }

    const newSteps = generateLinkedListReversalSteps(initialListStr, reversalType);
    setSteps(newSteps);
  }, [initialListStr, reversalType]);

  useEffect(() => { handleGenerateSteps(); }, [handleGenerateSteps]);

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(steps.length <= 1);
    if(steps.length > 0) setCurrentStep(steps[0]);
  }, [steps]);

  useEffect(() => {
    if (steps[currentStepIndex]) setCurrentStep(steps[currentStepIndex]);
  }, [currentStepIndex, steps]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        setCurrentStepIndex(prevIndex => prevIndex + 1);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false); setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps.length, animationSpeed]);

  const handlePlay = () => { if (!isFinished && steps.length > 1 && reversalType !== 'init') { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1 || reversalType === 'init') return;
    setIsPlaying(false); const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => {
    setIsPlaying(false); setIsFinished(true); setInitialListStr('1,2,3,4'); setReversalType('iterative');
  };
  
  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!algoDetails) return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle className="w-16 h-16 text-destructive" /></main><Footer /></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center"><h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary dark:text-accent">{algorithmMetadata.title}</h1></div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3"><LinkedListVisualizationPanel nodes={currentStep?.nodes || []} headId={currentStep?.headId} auxiliaryPointers={currentStep?.auxiliaryPointers} message={currentStep?.message} listType="singly" /></div>
          <div className="lg:w-2/5 xl:w-1/3"><LinkedListReversalCodePanel currentLine={currentStep?.currentLine ?? null} reversalType={reversalType} /></div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                    <Label htmlFor="initialListInput" className="text-sm font-medium">Initial List (comma-separated)</Label>
                    <Input id="initialListInput" value={initialListStr} onChange={e => setInitialListStr(e.target.value)} disabled={isPlaying} />
                </div>
                <div>
                    <Label htmlFor="reversalTypeSelect" className="text-sm font-medium">Reversal Type</Label>
                    <Select value={reversalType} onValueChange={(val) => setReversalType(val as ReversalType)} disabled={isPlaying}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="iterative">Iterative</SelectItem>
                            <SelectItem value="recursive">Recursive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <Button onClick={handleGenerateSteps} disabled={isPlaying}>Generate/Reset Steps</Button>
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying} aria-label="Reset visualization and inputs">
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset All
                </Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex gap-2">
                {!isPlaying ? <Button onClick={handlePlay} disabled={isFinished || steps.length <=1 || reversalType === 'init'} size="lg"><Play className="mr-2"/>Play</Button> 
                             : <Button onClick={handlePause} size="lg"><Pause className="mr-2"/>Pause</Button>}
                <Button onClick={handleStep} variant="outline" disabled={isFinished || steps.length <=1 || reversalType === 'init'} size="lg"><SkipForward className="mr-2"/>Step</Button>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
                <Label htmlFor="speedControl">Animation Speed</Label>
                <Slider id="speedControl" min={MIN_SPEED} max={MAX_SPEED} step={50} value={[animationSpeed]} onValueChange={(v) => setAnimationSpeed(v[0])} disabled={isPlaying} />
                <p className="text-xs text-muted-foreground text-center">{animationSpeed} ms</p>
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
