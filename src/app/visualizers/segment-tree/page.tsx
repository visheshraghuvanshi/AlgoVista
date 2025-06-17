
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, AlgorithmStep } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { SegmentTreeCodePanel } from './SegmentTreeCodePanel';
import { generateSegmentTreeBuildSteps, SEGMENT_TREE_LINE_MAP } from './segment-tree-logic';
import { SortingControlsPanel } from '@/components/algo-vista/sorting-controls-panel';


const ALGORITHM_SLUG = 'segment-tree';
const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;


export default function SegmentTreeVisualizerPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [inputValue, setInputValue] = useState("1,3,5,7,9,11");
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayedData, setDisplayedData] = useState<number[]>([]); // Will show the segment tree array
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]); // Not used for ST build
  const [sortedIndices, setSortedIndices] = useState<number[]>([]); // Not directly applicable
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [processingSubArrayRange, setProcessingSubArrayRange] = useState<[number, number] | null>(null);
  const [pivotActualIndex, setPivotActualIndex] = useState<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    setIsClient(true);
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) {
      setAlgorithm(foundAlgorithm);
    } else {
      toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
    }
  }, [toast]);

  const parseInput = useCallback((value: string): number[] | null => {
    if (value.trim() === '') return [];
    const parsed = value.split(',').map(s => s.trim()).filter(s => s !== '').map(s => parseInt(s, 10));
    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Input", description: "Please enter comma-separated numbers only for the array.", variant: "destructive" });
      return null;
    }
    if (parsed.some(n => n > 999 || n < -999)) {
      toast({ title: "Input out of range", description: "Array numbers must be between -999 and 999.", variant: "destructive" });
      return null;
    }
    return parsed;
  }, [toast]);

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setDisplayedData(currentS.array); // This will be the segment tree array
      setActiveIndices(currentS.activeIndices);
      setSwappingIndices(currentS.swappingIndices);
      setSortedIndices(currentS.sortedIndices);
      setCurrentLine(currentS.currentLine);
      setProcessingSubArrayRange(currentS.processingSubArrayRange || null);
      setPivotActualIndex(currentS.pivotActualIndex || null);
    }
  }, [steps]);

  const handleBuildTree = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    const parsedArray = parseInput(inputValue);
    if (parsedArray === null) return;
    if (parsedArray.length === 0) {
        toast({title: "Input Empty", description: "Please provide an array to build the segment tree.", variant: "default"});
        setSteps([]); setDisplayedData([]);
        return;
    }

    const newSteps = generateSegmentTreeBuildSteps(parsedArray);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    if (newSteps.length > 0) updateStateFromStep(0);
    else setDisplayedData([]);
    toast({title: "Segment Tree Build", description: "Steps generated for building the segment tree array."});
  }, [inputValue, parseInput, toast, updateStateFromStep]);

  useEffect(() => { // Initial build on load
    handleBuildTree();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);
        updateStateFromStep(nextStepIndex);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateStateFromStep]);

  const handlePlay = () => {
    if (isFinished || steps.length === 0 || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Play", description: "Build tree first or operation finished.", variant: "default" });
      return;
    }
    setIsPlaying(true); setIsFinished(false);
  };
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(false);
    const nextStepIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextStepIndex);
    updateStateFromStep(nextStepIndex);
    if (nextStepIndex === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => { // Resets to initial input and re-generates build steps
    setIsPlaying(false); setIsFinished(false);
    setInputValue("1,3,5,7,9,11"); // Reset input
    // handleBuildTree will be called by the useEffect listening to inputValue if it changes,
    // or explicitly if inputValue doesn't change but we want to force re-gen.
    // For simplicity, we directly call handleBuildTree if inputValue is already default.
    if (inputValue === "1,3,5,7,9,11") {
        handleBuildTree();
    } 
    // If inputValue changes due to setInputValue, useEffect will trigger handleBuildTree.
  };


  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.longDescription || algorithm.description,
    timeComplexities: { 
      best: "Build: O(n), Query: O(log n), Update: O(log n)", 
      average: "Build: O(n), Query: O(log n), Update: O(log n)", 
      worst: "Build: O(n), Query: O(log n), Update: O(log n)" 
    },
    spaceComplexity: "O(n) for the tree structure (typically 2n or 4n elements in array representation).",
  } : null;

  if (!isClient) { /* SSR loading state */ }
  if (!algorithm || !algoDetails) { /* Error/Loading state */ }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithm?.title || "Segment Tree"}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="lg:w-3/5 xl:w-2/3">
                <VisualizationPanel
                    data={displayedData} // Shows the segment tree array
                    activeIndices={activeIndices}
                    swappingIndices={swappingIndices}
                    sortedIndices={sortedIndices}
                    processingSubArrayRange={processingSubArrayRange}
                    pivotActualIndex={pivotActualIndex}
                />
            </div>
            <div className="lg:w-2/5 xl:w-1/3">
                <SegmentTreeCodePanel currentLine={currentLine} />
            </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Segment Tree Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="arrayInput">Initial Array (comma-separated)</Label>
                <Input id="arrayInput" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="e.g., 1,3,5,7" disabled={isPlaying} />
              </div>
              <div className="space-y-2">
                 <Button onClick={handleBuildTree} disabled={isPlaying} className="w-full md:w-auto mt-6">Build Segment Tree Array</Button>
              </div>
            </div>
            <div className="text-center my-4 p-4 border rounded-lg bg-muted/50">
                <Construction className="mx-auto h-8 w-8 text-primary dark:text-accent mb-2" />
                <p className="text-muted-foreground text-sm">
                    Interactive Query and Update operations for the Segment Tree are under construction.
                    Currently, only the tree array **build process** is visualized.
                </p>
            </div>
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset to Default & Rebuild</Button>
            </div>
             <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex gap-2">
                {!isPlaying ? <Button onClick={handlePlay} disabled={isFinished || steps.length <=1} size="lg"><Play className="mr-2"/>Play Build</Button> 
                             : <Button onClick={handlePause} size="lg"><Pause className="mr-2"/>Pause</Button>}
                <Button onClick={handleStep} variant="outline" disabled={isFinished || steps.length <=1} size="lg"><SkipForward className="mr-2"/>Step Build</Button>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
                <Label htmlFor="speedControl">Animation Speed</Label>
                 <Slider id="speedControl" min={MIN_SPEED} max={MAX_SPEED} step={50} value={[animationSpeed]} onValueChange={(v) => setAnimationSpeed(v[0])} disabled={isPlaying} />
                <p className="text-xs text-muted-foreground text-center">{animationSpeed} ms delay</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {algoDetails && <AlgorithmDetailsCard {...algoDetails} />}
      </main>
      <Footer />
    </div>
  );
}

