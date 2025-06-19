
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, DPAlgorithmStep, AlgorithmDetailsProps } from './types'; // Local import
import { algorithmMetadata } from './metadata'; // Local import
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { EditDistanceVisualizationPanel } from './EditDistanceVisualizationPanel'; // Local import
import { EditDistanceCodePanel, EDIT_DISTANCE_CODE_SNIPPETS } from './EditDistanceCodePanel'; 
import { generateEditDistanceSteps } from './edit-distance-logic'; // Local import

const DEFAULT_ANIMATION_SPEED = 400;
const MIN_SPEED = 50;
const MAX_SPEED = 1500;
const DEFAULT_STRING1 = "kitten";
const DEFAULT_STRING2 = "sitting";
const MAX_STRING_LENGTH = 15;

export default function EditDistanceVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [string1Input, setString1Input] = useState(DEFAULT_STRING1);
  const [string2Input, setString2Input] = useState(DEFAULT_STRING2);
  
  const [steps, setSteps] = useState<DPAlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<DPAlgorithmStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) setCurrentStep(steps[stepIndex]);
  }, [steps]);
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const s1 = string1Input.trim();
    const s2 = string2Input.trim();

    if (s1.length > MAX_STRING_LENGTH || s2.length > MAX_STRING_LENGTH) {
        toast({ title: "Input Too Long", description: `Strings should be at most ${MAX_STRING_LENGTH} characters for optimal visualization.`, variant: "destructive" });
        setSteps([]); setCurrentStep(null); setIsFinished(true);
        return;
    }
     if (s1 === "" && s2 === "") { 
        toast({ title: "Input Empty", description: "Enter at least one string.", variant: "default"});
        setSteps([]); setCurrentStep(null); setIsFinished(true);
        return;
    }

    const newSteps = generateEditDistanceSteps(s1, s2);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setCurrentStep(newSteps[0] || null);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

  }, [string1Input, string2Input, toast, updateVisualStateFromStep]);
  
  useEffect(() => { handleGenerateSteps(); }, [string1Input, string2Input, handleGenerateSteps]);

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
    setString1Input(DEFAULT_STRING1);
    setString2Input(DEFAULT_STRING2);
  };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Wand2 className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <EditDistanceVisualizationPanel step={currentStep} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <EditDistanceCodePanel currentLine={currentStep?.currentLine ?? null} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Input</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1 md:col-span-1">
                <Label htmlFor="string1InputED">String 1 (max {MAX_STRING_LENGTH} chars)</Label>
                <Input id="string1InputED" value={string1Input} onChange={e => setString1Input(e.target.value)} maxLength={MAX_STRING_LENGTH} disabled={isPlaying}/>
              </div>
              <div className="space-y-1 md:col-span-1">
                <Label htmlFor="string2InputED">String 2 (max {MAX_STRING_LENGTH} chars)</Label>
                <Input id="string2InputED" value={string2Input} onChange={e => setString2Input(e.target.value)} maxLength={MAX_STRING_LENGTH} disabled={isPlaying}/>
              </div>
              <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full md:w-auto self-end md:col-span-1">Calculate</Button>
            </div>
            
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
    
