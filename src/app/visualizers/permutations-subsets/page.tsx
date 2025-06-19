"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, ArrayAlgorithmStep, AlgorithmDetailsProps } from './types'; // Local import
import { algorithmMetadata } from './metadata'; // Local import
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, Shapes } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PermutationsSubsetsVisualizationPanel } from './PermutationsSubsetsVisualizationPanel';
import { PermutationsSubsetsCodePanel } from './PermutationsSubsetsCodePanel';
import { generatePermutationsSteps, generateSubsetsSteps, PERMUTATIONS_LINE_MAP, SUBSETS_LINE_MAP } from './permutations-subsets-logic';
import type { PermutationsSubsetsProblemType } from './permutations-subsets-logic';

const DEFAULT_ANIMATION_SPEED = 500;
const MIN_SPEED = 50;
const MAX_SPEED = 1500;
const MAX_INPUT_ELEMENTS = 5; // Keep small for performance

export default function PermutationsSubsetsVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [inputValue, setInputValue] = useState('1,2,3');
  const [problemType, setProblemType] = useState<PermutationsSubsetsProblemType>('permutations');
  const [originalInputSet, setOriginalInputSet] = useState<(string|number)[]>(['1','2','3']);

  const [steps, setSteps] = useState<ArrayAlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<ArrayAlgorithmStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  const parseInput = useCallback((value: string): (string|number)[] | null => {
    if (value.trim() === '') return [];
    const elements = value.split(',').map(s => s.trim()).filter(s => s !== '');
    if (elements.length > MAX_INPUT_ELEMENTS) {
      toast({ title: "Input Too Large", description: `Please enter up to ${MAX_INPUT_ELEMENTS} elements for performance.`, variant: "destructive" });
      return null;
    }
    // Keep as string or try to parse as number
    return elements.map(el => isNaN(Number(el)) ? el : Number(el));
  }, [toast]);

  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      setCurrentStep(steps[stepIndex]);
    }
  }, [steps]);
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const elements = parseInput(inputValue);
    if (!elements) {
      setSteps([]); setCurrentStep(null); setIsFinished(true); return;
    }
    setOriginalInputSet(elements);

    let newSteps: ArrayAlgorithmStep[] = [];
    if (problemType === 'permutations') {
      newSteps = generatePermutationsSteps(elements);
    } else if (problemType === 'subsets') {
      newSteps = generateSubsetsSteps(elements);
    }
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setCurrentStep(newSteps[0] || null);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

  }, [inputValue, problemType, parseInput, updateVisualStateFromStep]);
  
  useEffect(() => { handleGenerateSteps(); }, [handleGenerateSteps]);

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
  const handleReset = () => { setIsPlaying(false); setIsFinished(false); handleGenerateSteps(); };
  
  const localAlgoDetails: AlgorithmDetailsProps = { ...algorithmMetadata }; // Use local type

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Shapes className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <PermutationsSubsetsVisualizationPanel step={currentStep} problemType={problemType} originalInputSet={originalInputSet} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <PermutationsSubsetsCodePanel currentLine={currentStep?.currentLine ?? null} selectedProblemType={problemType} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls &amp; Setup</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="elementsInput">Input Elements (comma-sep, max {MAX_INPUT_ELEMENTS})</Label>
                <Input id="elementsInput" value={inputValue} onChange={e => setInputValue(e.target.value)} disabled={isPlaying} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="problemTypeSelectPS">Problem Type</Label>
                <Select value={problemType} onValueChange={v => setProblemType(v as PermutationsSubsetsProblemType)} disabled={isPlaying}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permutations">Permutations</SelectItem>
                    <SelectItem value="subsets">Subsets (Powerset)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full md:w-auto">Generate {problemType.charAt(0).toUpperCase() + problemType.slice(1)}</Button>
            
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Simulation</Button>
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
        <AlgorithmDetailsCard {...localAlgoDetails} />
      </main>
      <Footer />
    </div>
  );
}
