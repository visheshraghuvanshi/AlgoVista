
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LinkedListVisualizationPanel } from '@/components/algo-vista/LinkedListVisualizationPanel';
import { LinkedListReversalCodePanel } from './LinkedListReversalCodePanel'; 
import { LinkedListControlsPanel, type LinkedListOperation } from '@/components/algo-vista/LinkedListControlsPanel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, LinkedListAlgorithmStep, LinkedListNodeVisual } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { generateLinkedListReversalSteps, REVERSAL_ITERATIVE_LINE_MAP, REVERSAL_RECURSIVE_LINE_MAP } from './linked-list-reversal-logic';

const ALGORITHM_SLUG = 'linked-list-reversal';
const DEFAULT_ANIMATION_SPEED = 900;
const MIN_SPEED = 150;
const MAX_SPEED = 2200;

type ReversalType = 'iterative' | 'recursive' | 'init';

export default function LinkedListReversalPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);

  const [initialListStr, setInitialListStr] = useState('1,2,3,4');
  const [reversalType, setReversalType] = useState<ReversalType>('iterative');
  
  const [steps, setSteps] = useState<LinkedListAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [currentNodes, setCurrentNodes] = useState<LinkedListNodeVisual[]>([]);
  const [currentHeadId, setCurrentHeadId] = useState<string | null>(null);
  const [currentAuxPointers, setCurrentAuxPointers] = useState<Record<string, string | null>>({});
  const [currentMessage, setCurrentMessage] = useState<string | undefined>("");
  const [currentLine, setCurrentLine] = useState<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) setAlgorithm(foundAlgorithm);
    else toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
  }, [toast]);

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
    if (reversalType === 'init') { // Just show initial list
        const initSteps = generateLinkedListReversalSteps(initialListStr, 'iterative'); // use iterative for structure
        if (initSteps.length > 0) {
            const firstStep = initSteps[0];
             setSteps([firstStep]); // Only the first step
             updateVisualStateFromStep(0);
        } else {
             setSteps([]); setCurrentNodes([]); setCurrentHeadId(null); setCurrentMessage("Could not initialize list.");
        }
        setIsPlaying(false); setIsFinished(true); // No animation for init display
        return;
    }

    const newSteps = generateLinkedListReversalSteps(initialListStr, reversalType);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    if (newSteps.length > 0) updateVisualStateFromStep(0);
    else setCurrentNodes([]);
  }, [initialListStr, reversalType, updateVisualStateFromStep]);

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
  const handleReset = () => {
    setIsPlaying(false); setIsFinished(false); setInitialListStr('1,2,3,4'); setReversalType('iterative');
    // handleGenerateSteps will be called by useEffect
  };
  
  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.description,
    timeComplexities: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "Iterative: O(1), Recursive: O(n) stack space",
  } : null;

  if (!algorithm || !algoDetails) return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle className="w-16 h-16 text-destructive" /></main><Footer /></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center"><h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary dark:text-accent">{algorithm.title}</h1></div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3"><LinkedListVisualizationPanel nodes={currentNodes} headId={currentHeadId} auxiliaryPointers={currentAuxPointers} message={currentMessage} listType="singly" /></div>
          <div className="lg:w-2/5 xl:w-1/3"><LinkedListReversalCodePanel currentLine={currentLine} reversalType={reversalType} /></div>
        </div>
        {/* Simplified Controls Panel for Reversal */}
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
                <Button onClick={onReset} variant="outline" disabled={isPlaying} aria-label="Reset visualization and inputs">
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset All
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
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
