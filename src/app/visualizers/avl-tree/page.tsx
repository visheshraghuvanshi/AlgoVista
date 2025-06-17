
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BinaryTreeVisualizationPanel } from '@/app/visualizers/binary-tree-traversal/BinaryTreeVisualizationPanel';
import { AVLTreeCodePanel } from './AVLTreeCodePanel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, BinaryTreeNodeVisual, BinaryTreeEdgeVisual, TreeAlgorithmStep } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import {
  generateAVLSteps,
  getFinalAVLTreeState,
  resetAVLTreeState,
  type AVL_TREE_LINE_MAP // Assuming line map is exported for potential use
} from './avl-tree-logic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, SkipForward, RotateCcw, FastForward, Cog, PlusCircle, Trash2 } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DEFAULT_ANIMATION_SPEED = 1200; // Slower for complex ops
const MIN_SPEED = 200;
const MAX_SPEED = 3000;
const ALGORITHM_SLUG = 'avl-tree';

// Internal representation of AVL node for the page's state
interface AVLNodeState {
  id: string;
  value: number;
  height: number;
  leftId: string | null;
  rightId: string | null;
  parentId: string | null;
}

export default function AVLTreeVisualizerPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);

  const [initialValuesInput, setInitialValuesInput] = useState('50,30,70,20,40,60,80');
  const [operationValueInput, setOperationValueInput] = useState('25'); 
  
  const [steps, setSteps] = useState<TreeAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentNodes, setCurrentNodes] = useState<BinaryTreeNodeVisual[]>([]);
  const [currentEdges, setCurrentEdges] = useState<BinaryTreeEdgeVisual[]>([]);
  const [currentPath, setCurrentPath] = useState<(string | number)[]>([]); 
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [currentProcessingNodeId, setCurrentProcessingNodeId] = useState<string|null>(null);
  const [currentMessage, setCurrentMessage] = useState<string>("Initialize tree or select an operation.");

  const [isPlaying, setIsPlaying] = useState(isPlaying);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref to store the actual tree structure (map of nodes and rootId)
  const avlTreeRef = useRef<{ rootId: string | null, nodes: Map<string, AVLNodeState> }>({ rootId: null, nodes: new Map() });

  useEffect(() => {
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) setAlgorithm(foundAlgorithm);
    else toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
    // Initial build
    handleBuildTree();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setCurrentNodes(currentS.nodes);
      setCurrentEdges(currentS.edges);
      setCurrentPath(currentS.traversalPath || []); 
      setCurrentLine(currentS.currentLine);
      setCurrentProcessingNodeId(currentS.currentProcessingNodeId ?? null);
      setCurrentMessage(currentS.message || "Step executed.");
    }
  }, [steps]);
  
  const processOperation = (operation: 'build' | 'insert') => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let valuesToProcess: number[] = [];
    if (operation === 'build') {
        valuesToProcess = initialValuesInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        if (valuesToProcess.length === 0 && initialValuesInput.trim() !== "") {
            toast({ title: "Invalid Input", description: "Please enter comma-separated numbers for build.", variant: "destructive" });
            return;
        }
        resetAVLTreeState(); // Clear internal state in logic file before build
        avlTreeRef.current = { rootId: null, nodes: new Map() }; // Reset local ref
    } else if (operation === 'insert') {
        const val = parseInt(operationValueInput, 10);
        if (isNaN(val)) {
            toast({ title: "Invalid Value", description: "Please enter a numeric value to insert.", variant: "destructive" });
            return;
        }
        valuesToProcess = [val];
    }

    const newSteps = generateAVLSteps(
      operation,
      valuesToProcess,
      avlTreeRef.current.rootId,
      avlTreeRef.current.nodes
    );
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
        updateStateFromStep(0);
        const finalState = getFinalAVLTreeState(); // Get updated tree from logic
        avlTreeRef.current = finalState; // Update local ref
        const lastStepMsg = newSteps[newSteps.length - 1]?.message;
        if (lastStepMsg) {
            toast({ title: operation.charAt(0).toUpperCase() + operation.slice(1) + " Info", description: lastStepMsg, duration: 3000 });
        }
    } else {
      setCurrentNodes([]); setCurrentEdges([]); setCurrentPath([]); setCurrentLine(null); setCurrentProcessingNodeId(null);
      setCurrentMessage("No steps generated. Check inputs or operation.");
    }
  };

  const handleBuildTree = () => processOperation('build');
  const handleInsertValue = () => processOperation('insert');

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
      toast({ title: "Cannot Play", description: isFinished ? "Operation finished. Reset or new op." : "No steps. Generate first.", variant: "default" });
      setIsPlaying(false); return;
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
  const handleResetControls = () => { 
    setIsPlaying(false); setIsFinished(true);
    setCurrentStepIndex(0);
    setInitialValuesInput('50,30,70,20,40,60,80');
    setOperationValueInput('25');
    resetAVLTreeState();
    avlTreeRef.current = { rootId: null, nodes: new Map() };
    setSteps([]);
    setCurrentNodes([]); setCurrentEdges([]); setCurrentPath([]); setCurrentLine(null); setCurrentProcessingNodeId(null);
    setCurrentMessage("AVL Tree reset. Build a new tree or insert values.");
    // Optionally, rebuild a default tree:
    // handleBuildTree(); // This would immediately build '50,30,70...'
  };
  
  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.longDescription || algorithm.description,
    timeComplexities: { 
      best: "O(log n) for search, insert, delete", 
      average: "O(log n) for search, insert, delete", 
      worst: "O(log n) for search, insert, delete (guaranteed due to balancing)" 
    },
    spaceComplexity: "O(n) for storage, O(log n) for recursion stack.",
  } : null;

  if (!algorithm || !algoDetails) {
    return ( <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle className="w-16 h-16 text-destructive" /></main><Footer /></div> );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithm.title}</h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentMessage}</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <BinaryTreeVisualizationPanel nodes={currentNodes} edges={currentEdges} traversalPath={currentPath} currentProcessingNodeId={currentProcessingNodeId} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <AVLTreeCodePanel currentLine={currentLine} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & AVL Tree Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="initialValuesInput" className="text-sm font-medium">Initial Values (for Build Tree)</Label>
                <Input id="initialValuesInput" value={initialValuesInput} onChange={(e) => setInitialValuesInput(e.target.value)} placeholder="e.g., 50,30,70" disabled={isPlaying} />
                 <Button onClick={handleBuildTree} disabled={isPlaying} className="w-full md:w-auto"><Cog className="mr-2 h-4 w-4"/>Build Tree</Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationValueInput">Value to Insert</Label>
                <Input id="operationValueInput" value={operationValueInput} onChange={(e) => setOperationValueInput(e.target.value)} placeholder="Enter number" type="number" disabled={isPlaying} />
                 <Button onClick={handleInsertValue} disabled={isPlaying || !avlTreeRef.current.rootId} className="w-full md:w-auto"><PlusCircle className="mr-2 h-4 w-4"/>Insert Value</Button>
              </div>
            </div>
            {/* Placeholder for Delete operation button - to be implemented later */}
            {/* <Button disabled className="w-full md:w-auto opacity-50"><Trash2 className="mr-2 h-4 w-4"/>Delete Value (Coming Soon)</Button> */}
            
            <div className="flex items-center justify-start pt-4 border-t">
              <Button onClick={handleResetControls} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Controls & Tree</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex gap-2">
                {!isPlaying ? <Button onClick={handlePlay} disabled={isFinished || steps.length <=1} size="lg"><Play className="mr-2"/>Play</Button> 
                             : <Button onClick={handlePause} size="lg"><Pause className="mr-2"/>Pause</Button>}
                <Button onClick={handleStep} variant="outline" disabled={isFinished || steps.length <=1} size="lg"><SkipForward className="mr-2"/>Step</Button>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
                <Label htmlFor="speedControl">Animation Speed</Label>
                <div className="flex items-center gap-2">
                    <FastForward className="h-4 w-4 text-muted-foreground transform rotate-180" />
                    <Slider id="speedControl" min={MIN_SPEED} max={MAX_SPEED} step={50} value={[animationSpeed]} onValueChange={(v) => setAnimationSpeed(v[0])} disabled={isPlaying} />
                    <FastForward className="h-4 w-4 text-muted-foreground" />
                </div>
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
