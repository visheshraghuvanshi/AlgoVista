
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, TreeAlgorithmStep, BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Play, Pause, SkipForward, RotateCcw, LocateFixed, Binary, FastForward, Gauge, Sigma } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { BinaryTreeVisualizationPanel } from '@/app/visualizers/binary-tree-traversal/BinaryTreeVisualizationPanel';
import { TreePathProblemsCodePanel } from './TreePathProblemsCodePanel'; 
import { generatePathSumSteps, TREE_PATH_SUM_LINE_MAP } from './tree-path-problems-logic'; 

const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 1800;
const DEFAULT_TREE_INPUT = "5,4,8,11,null,13,4,7,2,null,null,null,1"; // Example from LeetCode Path Sum
const DEFAULT_TARGET_SUM = "22";

export default function TreePathProblemsVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  const [treeInputValue, setTreeInputValue] = useState(DEFAULT_TREE_INPUT); 
  const [targetSumInput, setTargetSumInput] = useState(DEFAULT_TARGET_SUM);
  
  const [steps, setSteps] = useState<TreeAlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<TreeAlgorithmStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [pathFoundResult, setPathFoundResult] = useState<boolean | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [initialDisplayTree, setInitialDisplayTree] = useState<{nodes: BinaryTreeNodeVisual[], edges: BinaryTreeEdgeVisual[]}>({nodes: [], edges: []});


  useEffect(() => { setIsClient(true); }, []);

  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setCurrentStep(currentS);
      if (stepIndex === steps.length - 1 && currentS.auxiliaryData?.pathFound !== undefined) {
         setPathFoundResult(currentS.auxiliaryData.pathFound as boolean);
      }
    }
  }, [steps]);

  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const target = parseInt(targetSumInput, 10);
    if (isNaN(target)) {
        toast({title: "Invalid Target Sum", description: "Target sum must be a number.", variant: "destructive"});
        setSteps([]); setCurrentStep(null); setIsFinished(true); setPathFoundResult(null);
        return;
    }

    const newSteps = generatePathSumSteps(treeInputValue, target);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    setPathFoundResult(null); 

    if (newSteps.length > 0) {
        updateVisualStateFromStep(0);
        const lastStep = newSteps[newSteps.length-1];
        if (lastStep.auxiliaryData?.pathFound !== undefined) {
            setPathFoundResult(lastStep.auxiliaryData.pathFound as boolean);
            const pathMessage = lastStep.auxiliaryData.pathFound ? "Path with target sum found!" : "No path with target sum found.";
            toast({ title: "Path Sum Result", description: pathMessage });
        }
    } else {
        setCurrentStep(null); // Clear visual if no steps
    }
  }, [treeInputValue, targetSumInput, toast, updateVisualStateFromStep]);
  
  useEffect(() => { handleGenerateSteps(); }, [treeInputValue, targetSumInput, handleGenerateSteps]);


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
    setIsPlaying(false); setIsFinished(true); 
    setTreeInputValue(DEFAULT_TREE_INPUT); 
    setTargetSumInput(DEFAULT_TARGET_SUM);
    setPathFoundResult(null);
  };
  
  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>;}
  if (!algoDetails) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle /></main><Footer /></div>;}
  
  const displayNodes = currentStep?.nodes || [];
  const displayEdges = currentStep?.edges || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Sigma className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}: Path Sum
          </h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || "Find a root-to-leaf path that sums to a target."}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="lg:w-3/5 xl:w-2/3">
              <BinaryTreeVisualizationPanel 
                nodes={displayNodes} 
                edges={displayEdges} 
                traversalPath={currentStep?.traversalPath || []} 
                currentProcessingNodeId={currentStep?.currentProcessingNodeId}
              />
               {currentStep?.auxiliaryData && (
                 <Card className="mt-4">
                    <CardHeader className="pb-2 pt-3"><CardTitle className="text-sm font-medium text-center">Current State</CardTitle></CardHeader>
                    <CardContent className="text-xs flex justify-around p-2">
                        <p><strong>Target Sum:</strong> {currentStep.auxiliaryData.targetSum}</p>
                        <p><strong>Current Path Sum:</strong> {currentStep.auxiliaryData.currentSum}</p>
                    </CardContent>
                 </Card>
               )}
            </div>
            <div className="lg:w-2/5 xl:w-1/3">
                <TreePathProblemsCodePanel currentLine={currentStep?.currentLine ?? null} />
            </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Find Path Sum</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-1">
                    <Label htmlFor="treePathTreeInput">Tree Input (comma-sep, level-order, 'null')</Label>
                    <Input id="treePathTreeInput" value={treeInputValue} onChange={e => setTreeInputValue(e.target.value)} placeholder="e.g., 5,3,8,1,4,null,9" disabled={isPlaying}/>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="treePathTargetSumInput">Target Sum</Label>
                    <Input id="treePathTargetSumInput" type="number" value={targetSumInput} onChange={e => setTargetSumInput(e.target.value)} placeholder="e.g., 22" disabled={isPlaying}/>
                </div>
                 <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full md:w-auto self-end"><Sigma className="mr-2 h-4 w-4"/>Find Path Sum</Button>
            </div>
            
            {isFinished && pathFoundResult !== null && (
                <p className={`text-center font-semibold text-lg mt-2 ${pathFoundResult ? 'text-green-500' : 'text-red-500'}`}>
                    {pathFoundResult ? `Path Found! Sum: ${currentStep?.auxiliaryData?.currentSum}, Target: ${currentStep?.auxiliaryData?.targetSum}` : "No path with the target sum found."}
                </p>
            )}
            
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset All</Button>
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

