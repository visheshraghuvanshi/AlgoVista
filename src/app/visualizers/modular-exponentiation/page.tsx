// src/app/visualizers/modular-exponentiation/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard';
import type { AlgorithmMetadata } from './types';
import { algorithmMetadata } from './metadata'; 
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge, Sigma } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";

import { ModularExponentiationCodePanel } from './ModularExponentiationCodePanel';
import { ModularExponentiationVisualizationPanel } from './ModularExponentiationVisualizationPanel';
import { generateModularExponentiationSteps, type ModularExponentiationStep } from './modular-exponentiation-logic';

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;
const DEFAULT_BASE = "7";
const DEFAULT_EXPONENT = "13";
const DEFAULT_MODULUS = "19";

export default function ModularExponentiationVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  const [baseInput, setBaseInput] = useState(DEFAULT_BASE);
  const [exponentInput, setExponentInput] = useState(DEFAULT_EXPONENT);
  const [modulusInput, setModulusInput] = useState(DEFAULT_MODULUS);

  const [steps, setSteps] = useState<ModularExponentiationStep[]>([]);
  const [currentStep, setCurrentStep] = useState<ModularExponentiationStep | null>(null);
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
  
  const handleCalculate = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const base = parseInt(baseInput, 10);
    const exponent = parseInt(exponentInput, 10);
    const modulus = parseInt(modulusInput, 10);

    if (isNaN(base) || isNaN(exponent) || isNaN(modulus)) {
      toast({ title: "Invalid Input", description: "Base, exponent, and modulus must be valid integers.", variant: "destructive" });
      return;
    }
    if (modulus <= 0) {
      toast({ title: "Invalid Modulus", description: "Modulus must be a positive integer.", variant: "destructive" });
      return;
    }
     if (exponent < 0) {
      toast({ title: "Invalid Exponent", description: "Exponent must be non-negative for this implementation.", variant: "destructive" });
      return;
    }
    if (modulus === 1) {
         toast({ title: "Modulus 1", description: "Result is always 0 for modulus 1.", variant: "default" });
    }


    const newSteps = generateModularExponentiationSteps(base, exponent, modulus);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setCurrentStep(newSteps[0] || null);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
  }, [baseInput, exponentInput, modulusInput, toast]);
  
  useEffect(() => { 
    handleCalculate();
  }, [handleCalculate]);

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
    setBaseInput(DEFAULT_BASE);
    setExponentInput(DEFAULT_EXPONENT);
    setModulusInput(DEFAULT_MODULUS);
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
          <Sigma className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <ModularExponentiationVisualizationPanel step={currentStep} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <ModularExponentiationCodePanel currentLine={currentStep?.currentLine ?? null} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Input</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                    <Label htmlFor="baseInput">Base</Label>
                    <Input id="baseInput" type="number" value={baseInput} onChange={e => setBaseInput(e.target.value)} disabled={isPlaying} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="exponentInput">Exponent</Label>
                    <Input id="exponentInput" type="number" value={exponentInput} onChange={e => setExponentInput(e.target.value)} disabled={isPlaying} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="modulusInput">Modulus</Label>
                    <Input id="modulusInput" type="number" value={modulusInput} onChange={e => setModulusInput(e.target.value)} disabled={isPlaying} />
                </div>
                <Button onClick={handleCalculate} disabled={isPlaying} className="w-full self-end">Calculate</Button>
            </div>
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
