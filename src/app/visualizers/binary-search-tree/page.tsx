
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BinaryTreeVisualizationPanel } from '@/app/visualizers/binary-tree-traversal/BinaryTreeVisualizationPanel'; // Reusing for display
import { BinarySearchTreeCodePanel } from './BinarySearchTreeCodePanel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, BinaryTreeNodeVisual, BinaryTreeEdgeVisual, TreeAlgorithmStep } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import {
  parseBSTInput,
  buildBSTNodesAndEdgesFromSteps,
  generateBSTSteps,
  type BSTOperationType,
  BST_OPERATION_LINE_MAPS,
} from './binary-search-tree-logic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge, Binary } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


const DEFAULT_ANIMATION_SPEED = 900;
const MIN_SPEED = 150;
const MAX_SPEED = 2200;
const ALGORITHM_SLUG = 'binary-search-tree';

export default function BinarySearchTreePage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);

  const [treeInputValue, setTreeInputValue] = useState('50,30,70,20,40,60,80');
  const [operationValue, setOperationValue] = useState('25'); // For insert, delete, search
  const [selectedOperation, setSelectedOperation] = useState<BSTOperationType>('insert');
  
  const [steps, setSteps] = useState<TreeAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentNodes, setCurrentNodes] = useState<BinaryTreeNodeVisual[]>([]);
  const [currentEdges, setCurrentEdges] = useState<BinaryTreeEdgeVisual[]>([]);
  const [currentPath, setCurrentPath] = useState<(string | number)[]>([]); // Could show traversal path for search/insert
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [currentProcessingNodeId, setCurrentProcessingNodeId] = useState<string|null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // This ref will store the actual BST structure (nodes map with left/right children IDs)
  // It will be modified by the logic generating steps.
  const bstStructureRef = useRef<{ rootId: string | null, nodes: Map<string, { value: number, leftId: string | null, rightId: string | null }> }>({ rootId: null, nodes: new Map() });


  useEffect(() => {
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) setAlgorithm(foundAlgorithm);
    else toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
  }, [toast]);

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setCurrentNodes(currentS.nodes);
      setCurrentEdges(currentS.edges);
      setCurrentPath(currentS.traversalPath || []); // traversalPath used for search/insert path
      setCurrentLine(currentS.currentLine);
      setCurrentProcessingNodeId(currentS.currentProcessingNodeId ?? null);
    }
  }, [steps]);
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let valueForOp: number | undefined = undefined;
    if (selectedOperation !== 'build') {
      valueForOp = parseInt(operationValue, 10);
      if (isNaN(valueForOp)) {
        toast({ title: "Invalid Value", description: "Please enter a numeric value for the operation.", variant: "destructive" });
        return;
      }
    }

    const newSteps = generateBSTSteps(
      bstStructureRef.current, // Pass current tree structure
      selectedOperation,
      valueForOp,
      treeInputValue // Only used for 'build' operation
    );
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
        updateStateFromStep(0);
        // Crucially, update bstStructureRef based on the *final* state of the operation
        const lastStep = newSteps[newSteps.length - 1];
        const { rootId: finalRootId, nodes: finalNodesMap } = buildBSTNodesAndEdgesFromSteps(lastStep.nodes);
        bstStructureRef.current = { rootId: finalRootId, nodes: finalNodesMap };

        if (lastStep.message && lastStep.message.toLowerCase().includes("error")) {
             toast({ title: "Operation Info", description: lastStep.message, variant: "destructive" });
        } else if (lastStep.message) {
             toast({ title: "Operation Info", description: lastStep.message, variant: "default" });
        }

    } else {
      setCurrentNodes([]); setCurrentEdges([]); setCurrentPath([]); setCurrentLine(null); setCurrentProcessingNodeId(null);
    }
  }, [treeInputValue, selectedOperation, operationValue, toast, updateStateFromStep]);

  // Initialize tree on load or when initial input string changes
  useEffect(() => {
    bstStructureRef.current = { rootId: null, nodes: new Map() }; // Reset internal structure
    generateBSTSteps(bstStructureRef.current, 'build', undefined, treeInputValue); // Initial build
    handleGenerateSteps(); // Trigger step generation for the currently selected operation (which might be 'insert' by default)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeInputValue]); // Only re-trigger full build on initial tree input change

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
  const handleResetAndRebuild = () => { // Full reset including rebuilding tree from input string
    setIsPlaying(false); setIsFinished(false);
    bstStructureRef.current = { rootId: null, nodes: new Map() }; // Clear internal structure
    // This will first build the tree based on treeInputValue, then apply the selected operation
    generateBSTSteps(bstStructureRef.current, 'build', undefined, treeInputValue);
    handleGenerateSteps(); 
  };
  
  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.longDescription || algorithm.description,
    timeComplexities: { 
      best: "O(log n) for Search, Insert, Delete (balanced tree)", 
      average: "O(log n) for Search, Insert, Delete", 
      worst: "O(n) for Search, Insert, Delete (skewed tree)" 
    },
    spaceComplexity: "O(h) for recursive calls (h=height), O(n) in worst case (skewed tree). O(n) for storage.",
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
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <BinaryTreeVisualizationPanel nodes={currentNodes} edges={currentEdges} traversalPath={currentPath} currentProcessingNodeId={currentProcessingNodeId} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <BinarySearchTreeCodePanel currentLine={currentLine} selectedOperation={selectedOperation} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & BST Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="treeInput" className="text-sm font-medium flex items-center"><Binary className="mr-2 h-4 w-4"/>Initial Tree (comma-sep)</Label>
                <Input id="treeInput" value={treeInputValue} onChange={(e) => setTreeInputValue(e.target.value)} placeholder="e.g., 50,30,70,20,40" disabled={isPlaying} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationSelect">Operation</Label>
                <Select value={selectedOperation} onValueChange={(v) => setSelectedOperation(v as BSTOperationType)} disabled={isPlaying}>
                  <SelectTrigger id="operationSelect"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insert">Insert</SelectItem>
                    <SelectItem value="search">Search</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationValue">Value for Operation</Label>
                <Input id="operationValue" value={operationValue} onChange={(e) => setOperationValue(e.target.value)} placeholder="Enter number" type="number" disabled={isPlaying || selectedOperation === 'build'} />
              </div>
            </div>
            <Button onClick={handleGenerateSteps} disabled={isPlaying}>Apply Operation & Generate Steps</Button>
            <div className="flex items-center justify-start pt-4 border-t">
              <Button onClick={handleResetAndRebuild} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Tree & Controls</Button>
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
