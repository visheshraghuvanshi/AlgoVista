
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, DPAlgorithmStep } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from "@/components/ui/slider";
import { KnapsackVisualizationPanel } from './KnapsackVisualizationPanel';
import { KnapsackCodePanel, KNAPSACK_01_CODE_SNIPPETS } from './KnapsackCodePanel'; // Import snippets
import { generateKnapsack01Steps } from './knapsack-0-1-logic';

const DEFAULT_ANIMATION_SPEED = 500;
const MIN_SPEED = 50;
const MAX_SPEED = 1500;
const DEFAULT_ITEMS_INPUT = "w:3,v:10; w:4,v:40; w:5,v:30; w:6,v:50";
const DEFAULT_CAPACITY = "10";

interface KnapsackItem { weight: number; value: number; }

export default function KnapsackVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [itemInput, setItemInput] = useState(DEFAULT_ITEMS_INPUT);
  const [capacityInput, setCapacityInput] = useState(DEFAULT_CAPACITY);
  
  const [steps, setSteps] = useState<DPAlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<DPAlgorithmStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  const parseItemsInput = useCallback((input: string): KnapsackItem[] | null => {
    try {
      const items = input.split(';').map(itemStr => {
        const parts = itemStr.split(',');
        const weightPart = parts.find(p => p.includes('w:'));
        const valuePart = parts.find(p => p.includes('v:'));
        if (!weightPart || !valuePart) throw new Error("Each item must have 'w:' and 'v:'.");
        const weight = parseInt(weightPart.split(':')[1], 10);
        const value = parseInt(valuePart.split(':')[1], 10);
        if (isNaN(weight) || isNaN(value) || weight <=0 || value < 0) {
          throw new Error("Weights must be positive, values non-negative.");
        }
        return { weight, value };
      }).filter(item => item !== null && item !== undefined); // Ensure no undefined items if parsing fails for one part
      if (items.length === 0 && input.trim() !== "") throw new Error("No valid items found.");
      return items;
    } catch (e: any) {
      toast({ title: "Invalid Item Format", description: e.message || "Use 'w:weight,v:value; w:weight2,v:value2; ...'", variant: "destructive" });
      return null;
    }
  }, [toast]);

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) setCurrentStep(steps[stepIndex]);
  }, [steps]);
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const items = parseItemsInput(itemInput);
    const capacity = parseInt(capacityInput, 10);

    if (!items || isNaN(capacity) || capacity <= 0) {
      if (!items) {} 
      else toast({ title: "Invalid Capacity", description: "Capacity must be a positive integer.", variant: "destructive" });
      setSteps([]); setCurrentStep(null); setIsFinished(true);
      return;
    }
    if (items.length > 10 || capacity > 50) { 
        toast({title:"Input too large", description: "Max 10 items and capacity 50 for smooth viz.", variant:"default"});
    }

    const newSteps = generateKnapsack01Steps(items, capacity);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setCurrentStep(newSteps[0] || null);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

  }, [itemInput, capacityInput, parseItemsInput, toast, updateStateFromStep]);
  
  useEffect(() => { handleGenerateSteps(); }, [handleGenerateSteps]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateStateFromStep(nextIdx);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false); setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateStateFromStep]);

  const handlePlay = () => { if (!isFinished && steps.length > 1) { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(false); const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateStateFromStep(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => { 
    setIsPlaying(false); setIsFinished(false); 
    setItemInput(DEFAULT_ITEMS_INPUT);
    setCapacityInput(DEFAULT_CAPACITY);
  };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Package className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <KnapsackVisualizationPanel step={currentStep} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <KnapsackCodePanel currentLine={currentStep?.currentLine ?? null} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Problem Setup</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-1">
                <Label htmlFor="itemInputKnapsack">Items (Format: w:weight,v:value; ...)</Label>
                <Textarea id="itemInputKnapsack" value={itemInput} onChange={e => setItemInput(e.target.value)} className="font-mono text-sm" rows={3} disabled={isPlaying} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="capacityInputKnapsack">Knapsack Capacity</Label>
                <Input id="capacityInputKnapsack" type="number" value={capacityInput} onChange={e => setCapacityInput(e.target.value)} className="mt-1" disabled={isPlaying} />
              </div>
            </div>
            <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full md:w-auto">Solve Knapsack</Button>
            
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Inputs & Simulation</Button>
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

    
