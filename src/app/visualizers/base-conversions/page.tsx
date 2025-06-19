
      
// src/app/visualizers/base-conversions/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, AlgorithmDetailsProps, BaseConversionStep } from './types'; // Local import
import { algorithmMetadata } from './metadata'; // Local import
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";

import { BaseConversionsCodePanel } from './BaseConversionsCodePanel';
import { BaseConversionsVisualizationPanel } from './BaseConversionsVisualizationPanel';
import { generateBaseConversionSteps } from './base-conversions-logic';

const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 1800;
const DEFAULT_NUMBER_INPUT = "42";
const DEFAULT_FROM_BASE = "10";
const DEFAULT_TO_BASE = "2";

export default function BaseConversionsVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  const [numberInput, setNumberInput] = useState(DEFAULT_NUMBER_INPUT);
  const [fromBaseInput, setFromBaseInput] = useState(DEFAULT_FROM_BASE);
  const [toBaseInput, setToBaseInput] = useState(DEFAULT_TO_BASE);

  const [steps, setSteps] = useState<BaseConversionStep[]>([]);
  const [currentStep, setCurrentStep] = useState<BaseConversionStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      setCurrentStep(steps[stepIndex]);
    }
  }, [steps]);
  
  const handleConvert = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const fromBase = parseInt(fromBaseInput, 10);
    const toBase = parseInt(toBaseInput, 10);

    if (isNaN(fromBase) || fromBase < 2 || fromBase > 36 || 
        isNaN(toBase) || toBase < 2 || toBase > 36) {
      toast({ title: "Invalid Base", description: "Bases must be integers between 2 and 36.", variant: "destructive" });
      setSteps([]); setCurrentStep(null); setIsFinished(true);
      return;
    }
    
    if (fromBase !== 10) {
        const validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, fromBase);
        const inputToCheck = numberInput.toUpperCase();
        if (!inputToCheck.split('').every(char => validChars.includes(char))) {
            toast({ title: "Invalid Number", description: `Number "${numberInput}" contains invalid characters for base ${fromBase}.`, variant: "destructive" });
            setSteps([]); setCurrentStep(null); setIsFinished(true);
            return;
        }
    } else {
        if (isNaN(parseInt(numberInput,10))) {
             toast({ title: "Invalid Decimal Number", description: `"${numberInput}" is not a valid decimal number.`, variant: "destructive" });
             setSteps([]); setCurrentStep(null); setIsFinished(true);
            return;
        }
    }

    const newSteps = generateBaseConversionSteps(numberInput, fromBase, toBase);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setCurrentStep(newSteps[0] || null); // Directly set first step
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
  }, [numberInput, fromBaseInput, toBaseInput, toast, setSteps, setCurrentStep, setCurrentStepIndex, setIsPlaying, setIsFinished]); 
  
  useEffect(() => { 
    handleConvert();
  }, [handleConvert]); 

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

  const handlePlay = () => { if (!isFinished && steps.length > 1) { setIsPlaying(true); setIsFinished(false); }};
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
    setNumberInput(DEFAULT_NUMBER_INPUT);
    setFromBaseInput(DEFAULT_FROM_BASE);
    setToBaseInput(DEFAULT_TO_BASE);
    // handleConvert will be called by its useEffect dependency on input changes
  };
  
  const algoDetails: AlgorithmDetailsProps = {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  };

  if (!isClient) { 
    return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Repeat className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <BaseConversionsVisualizationPanel step={currentStep} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <BaseConversionsCodePanel currentLine={currentStep?.currentLine ?? null} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Input</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-1">
                    <Label htmlFor="numberInputBC">Number to Convert</Label>
                    <Input id="numberInputBC" type="text" value={numberInput} onChange={(e) => setNumberInput(e.target.value)} disabled={isPlaying} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="fromBaseInput">From Base (2-36)</Label>
                    <Input id="fromBaseInput" type="number" value={fromBaseInput} onChange={(e) => setFromBaseInput(e.target.value)} min="2" max="36" disabled={isPlaying} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="toBaseInput">To Base (2-36)</Label>
                    <Input id="toBaseInput" type="number" value={toBaseInput} onChange={(e) => setToBaseInput(e.target.value)} min="2" max="36" disabled={isPlaying} />
                </div>
            </div>
            <Button onClick={handleConvert} disabled={isPlaying} className="w-full md:w-auto">Convert</Button>
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
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
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}


    