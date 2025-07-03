
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BinaryTreeVisualizationPanel } from './BinaryTreeVisualizationPanel';
import { MorrisTraversalCodePanel, MORRIS_TRAVERSAL_CODE_SNIPPETS } from './MorrisTraversalCodePanel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard';
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, BinaryTreeEdgeVisual, AlgorithmMetadata } from './types';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Play, Pause, SkipForward, RotateCcw, FastForward, Gauge, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { generateMorrisInorderSteps, MORRIS_INORDER_LINE_MAP } from './morris-traversal-logic';
import { algorithmMetadata } from './metadata';
import { parseTreeInput, buildTreeNodesAndEdges as initialBuildTreeForDisplay } from '@/app/visualizers/binary-tree-traversal/binary-tree-traversal-logic'; // Re-use parser


const DEFAULT_ANIMATION_SPEED = 900;
const MIN_SPEED = 150;
const MAX_SPEED = 2200;
const DEFAULT_MORRIS_TREE_INPUT = "4,2,6,1,3,5,7";

export default function MorrisTraversalPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [treeInputValue, setTreeInputValue] = useState(DEFAULT_MORRIS_TREE_INPUT);
  
  const [steps, setSteps] = useState<TreeAlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<TreeAlgorithmStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [initialDisplayTree, setInitialDisplayTree] = useState<{nodes: BinaryTreeNodeVisual[], edges: BinaryTreeEdgeVisual[]}>({nodes: [], edges: []});

  useEffect(() => { setIsClient(true); }, []);

  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      setCurrentStep(steps[stepIndex]);
    }
  }, [steps]); 
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const parsedInput = parseTreeInput(treeInputValue);
    if (!parsedInput) {
        toast({title: "Invalid Tree Input", description: "Format: comma-sep, level-order, 'null' for empty.", variant: "destructive"});
        setSteps([]); setCurrentStep(null); setIsFinished(true);
        setInitialDisplayTree({nodes: [], edges: []});
        return;
    }
    const { nodes: iNodes, edges: iEdges } = initialBuildTreeForDisplay(parsedInput);
    setInitialDisplayTree({nodes: iNodes, edges: iEdges});

    const newSteps = generateMorrisInorderSteps(treeInputValue);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setCurrentStep(newSteps[0] || null);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
  }, [treeInputValue, toast, updateVisualStateFromStep]);
  
  useEffect(() => { handleGenerateSteps(); }, [treeInputValue, handleGenerateSteps]);

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
    setTreeInputValue(DEFAULT_MORRIS_TREE_INPUT);
  };
  
  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>;}
  if (!algoDetails) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle /></main><Footer /></div>;}
  
  const displayNodes = currentStep?.nodes && currentStep.nodes.length > 0 ? currentStep.nodes : initialDisplayTree.nodes;
  const displayEdges = currentStep?.edges && currentStep.edges.length > 0 ? currentStep.edges : initialDisplayTree.edges;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <GitBranch className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="lg:w-3/5 xl:w-2/3">
              <BinaryTreeVisualizationPanel 
                nodes={displayNodes} 
                edges={displayEdges} 
                traversalPath={currentStep?.traversalPath || []} 
                currentProcessingNodeId={currentStep?.currentProcessingNodeId}
                step={currentStep}
              />
            </div>
            <div className="lg:w-2/5 xl:w-1/3">
                <MorrisTraversalCodePanel currentLine={currentStep?.currentLine ?? null} />
            </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Input</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="morrisTreeInput">Tree Input (comma-sep, level-order, 'null')</Label>
                <Input id="morrisTreeInput" value={treeInputValue} onChange={e => setTreeInputValue(e.target.value)} disabled={isPlaying}/>
              </div>
            </div>
             <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full md:w-auto">Run / Reset Traversal</Button>
            
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Default Tree</Button>
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
