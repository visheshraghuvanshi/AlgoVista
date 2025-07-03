
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
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard';
import type { AlgorithmMetadata, LinkedListAlgorithmStep, LinkedListNodeVisual, AlgorithmDetailsProps } from './types';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
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

  const [list1Str, setList1Str] = useState('1,3,5,7');
  const [list2Str, setList2Str] = useState('2,4,6,8');
  const [mergeType, setMergeType] = useState<MergeType>('iterative');
  
  const [steps, setSteps] = useState<LinkedListAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [currentNodes, setCurrentNodes] = useState<LinkedListNodeVisual[]>([]); 
  const [currentHeadId, setCurrentHeadId] = useState<string | null>(null); 
  const [currentAuxPointers, setCurrentAuxPointers] = useState<Record<string, string | null>>({});
  const [currentMessage, setCurrentMessage] = useState<string | undefined>("");
  const [currentLine, setCurrentLine] = useState<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true); 
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setCurrentNodes(currentS.nodes); 
      setCurrentHeadId(currentS.headId ?? null);
      setCurrentAuxPointers(currentS.auxiliaryPointers || {});
      setCurrentMessage(currentS.message);
      setCurrentLine(currentS.currentLine);
    }
  }, [steps]);
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (mergeType === 'init') {
        const initialMessage = "Lists ready for merge. Select merge type and play/step.";
        setCurrentNodes([]); 
        setCurrentHeadId(null);
        setCurrentAuxPointers({l1: 'L1_Head_Placeholder', l2: 'L2_Head_Placeholder'});
        setCurrentMessage(initialMessage);
        setCurrentLine(null);
        setSteps([{ nodes: [], headId: null, currentLine: 0, message: initialMessage }]);
        setIsPlaying(false); setIsFinished(true); 
        return;
    }
    if (list1Str.trim() === '' && list2Str.trim() === '') {
        toast({title: "Input Missing", description: "Please provide at least one list.", variant: "destructive"});
        setCurrentNodes([]); setCurrentHeadId(null); setSteps([]); setIsFinished(true);
        return;
    }
    const newSteps = generateMergeSortedListsSteps(list1Str, list2Str, mergeType);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    if (newSteps.length > 0) {
        const firstStep = newSteps[0];
        setCurrentNodes(firstStep.nodes);
        setCurrentHeadId(firstStep.headId ?? null);
        setCurrentAuxPointers(firstStep.auxiliaryPointers || {});
        setCurrentMessage(firstStep.message);
        setCurrentLine(firstStep.currentLine);
    } else {
        setCurrentNodes([]); setCurrentHeadId(null); setCurrentAuxPointers({}); setCurrentMessage("No steps generated."); setCurrentLine(null);
    }
  }, [list1Str, list2Str, mergeType, toast]);

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

  const handlePlay = () => { if (!isFinished && steps.length > 1 && mergeType !== 'init') { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1 || mergeType === 'init') return;
    setIsPlaying(false); const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateVisualStateFromStep(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => {
    setIsPlaying(false); setIsFinished(false); 
    setList1Str('1,3,5,7'); setList2Str('2,4,6,8'); setMergeType('iterative');
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
          <div className="lg:w-3/5 xl:w-2/3"><LinkedListVisualizationPanel nodes={currentNodes} headId={currentHeadId} auxiliaryPointers={currentAuxPointers} message={currentMessage} listType="singly" /></div>
          <div className="lg:w-2/5 xl:w-1/3"><MergeSortedLinkedListsCodePanel currentLine={currentLine} mergeType={mergeType} /></div>
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
             <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full md:w-auto mt-2">Merge Lists / Reset Steps</Button>
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset All</Button>
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
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
