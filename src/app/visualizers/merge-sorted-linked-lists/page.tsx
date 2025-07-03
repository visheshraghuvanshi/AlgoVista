
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LinkedListVisualizationPanel } from './LinkedListVisualizationPanel';
import { MergeSortedLinkedListsCodePanel } from './MergeSortedLinkedListsCodePanel'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard';
import type { AlgorithmMetadata, LinkedListAlgorithmStep } from './types';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Play, Pause, SkipForward, RotateCcw, FastForward, Gauge, GitMerge } from 'lucide-react';
import { generateMergeSortedListsSteps } from './merge-sorted-linked-lists-logic';
import { algorithmMetadata } from './metadata';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DEFAULT_ANIMATION_SPEED = 900;
const MIN_SPEED = 150;
const MAX_SPEED = 2200;

type MergeType = 'iterative' | 'recursive' | 'init';

export default function MergeSortedLinkedListsPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [list1Str, setList1Str] = useState('1,3,5,7');
  const [list2Str, setList2Str] = useState('2,4,6,8');
  const [mergeType, setMergeType] = useState<MergeType>('iterative');
  
  const [steps, setSteps] = useState<LinkedListAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState<LinkedListAlgorithmStep | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true); 
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => { setIsClient(true); }, []);
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (mergeType === 'init') {
        setSteps([]);
        setCurrentStep(null);
        setIsPlaying(false); setIsFinished(true); 
        return;
    }
    if (list1Str.trim() === '' && list2Str.trim() === '') {
        toast({title: "Input Missing", description: "Please provide at least one list.", variant: "destructive"});
        setSteps([]); setCurrentStep(null); setIsFinished(true);
        return;
    }
    const newSteps = generateMergeSortedListsSteps(list1Str, list2Str, mergeType);
    setSteps(newSteps);
  }, [list1Str, list2Str, mergeType, toast]);

  useEffect(() => { handleGenerateSteps(); }, [handleGenerateSteps]);

  // Effect to reset animation state when steps change
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(steps.length <= 1);
    if(steps.length > 0) setCurrentStep(steps[0]);
  }, [steps]);

  // Effect to update displayed step when index changes
  useEffect(() => {
    if (steps[currentStepIndex]) setCurrentStep(steps[currentStepIndex]);
  }, [currentStepIndex, steps]);

  // Main animation timer effect
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

  const handlePlay = () => { if (!isFinished && steps.length > 1 && mergeType !== 'init') { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1 || mergeType === 'init') return;
    setIsPlaying(false); const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => {
    setIsPlaying(false); setIsFinished(true); 
    setList1Str('1,3,5,7'); setList2Str('2,4,6,8'); setMergeType('iterative');
  };
  
  useEffect(() => { handleReset(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!algorithmMetadata) return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle /></main><Footer /></div>;
  const localAlgoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center"><h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary dark:text-accent">{algorithmMetadata.title}</h1></div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3"><LinkedListVisualizationPanel nodes={currentStep?.nodes || []} headId={currentStep?.headId} auxiliaryPointers={currentStep?.auxiliaryPointers} message={currentStep?.message} listType="singly" /></div>
          <div className="lg:w-2/5 xl:w-1/3"><MergeSortedLinkedListsCodePanel currentLine={currentStep?.currentLine ?? null} mergeType={mergeType} /></div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Setup</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div>
                    <Label htmlFor="list1Input">List 1 (sorted, comma-sep)</Label>
                    <Input id="list1Input" value={list1Str} onChange={e => setList1Str(e.target.value)} disabled={isPlaying} />
                </div>
                <div>
                    <Label htmlFor="list2Input">List 2 (sorted, comma-sep)</Label>
                    <Input id="list2Input" value={list2Str} onChange={e => setList2Str(e.target.value)} disabled={isPlaying} />
                </div>
                <div>
                    <Label htmlFor="mergeTypeSelect">Merge Type</Label>
                    <Select value={mergeType} onValueChange={(val) => setMergeType(val as MergeType)} disabled={isPlaying}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="iterative">Iterative</SelectItem>
                            <SelectItem value="recursive">Recursive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full md:w-auto mt-2"><GitMerge className="mr-2 h-4 w-4"/>Merge Lists / Reset Steps</Button>
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Defaults</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex gap-2">
                {!isPlaying ? <Button onClick={handlePlay} disabled={isFinished || steps.length <=1 || mergeType === 'init'} size="lg"><Play className="mr-2"/>Play</Button> 
                             : <Button onClick={handlePause} size="lg"><Pause className="mr-2"/>Pause</Button>}
                <Button onClick={handleStep} variant="outline" disabled={isFinished || steps.length <=1 || mergeType === 'init'} size="lg"><SkipForward className="mr-2"/>Step</Button>
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
