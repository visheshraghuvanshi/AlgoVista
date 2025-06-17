
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BinaryTreeVisualizationPanel } from '@/components/algo-vista/BinaryTreeVisualizationPanel'; // Updated path
import { RedBlackTreeCodePanel } from './RedBlackTreeCodePanel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, TreeAlgorithmStep, BinaryTreeNodeVisual } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import {
  generateRBTreeSteps,
  type RBTNodeInternal,
  type RBTreeGraph,
  NIL_ID,
  createInitialRBTreeGraph,
  // getFinalRBTreeGraph, // This helper might not be strictly needed if logic modifies ref or returns final state
} from './red-black-tree-logic';
import type { RBTOperationType } from './RedBlackTreeCodePanel';
import { algorithmMetadata } from './metadata'; // Import local metadata

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge, Cog, PlusCircle, Search, Trash2 } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DEFAULT_ANIMATION_SPEED = 1200;
const MIN_SPEED = 200;
const MAX_SPEED = 3000;

export default function RedBlackTreePage() {
  const { toast } = useToast();

  const [initialArrayInput, setInitialArrayInput] = useState('10,20,30,5,15,25,35,1,8');
  const [operationValue, setOperationValue] = useState('22'); 
  const [selectedOperation, setSelectedOperation] = useState<RBTOperationType>('insert');
  
  const [steps, setSteps] = useState<TreeAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentNodes, setCurrentNodes] = useState<BinaryTreeNodeVisual[]>([]);
  const [currentEdges, setCurrentEdges] = useState<TreeAlgorithmStep['edges']>([]);
  const [currentPath, setCurrentPath] = useState<(string | number)[]>([]); 
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [currentProcessingNodeId, setCurrentProcessingNodeId] = useState<string|null>(null);
  const [currentMessage, setCurrentMessage] = useState<string>("Initialize tree or select an operation.");

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rbtRef = useRef<RBTreeGraph>(createInitialRBTreeGraph());

  useEffect(() => {
    handleOperation('build', initialArrayInput);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

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
  
  const handleOperation = useCallback((
      opType: 'build' | 'insert' | 'search', 
      primaryValue?: string,
    ) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let valuesForBuild: string | undefined = undefined;
    let valueForOp: number | undefined = undefined;

    if (opType === 'build') {
        valuesForBuild = primaryValue || initialArrayInput;
        rbtRef.current = createInitialRBTreeGraph(); 
    } else if (opType === 'insert' || opType === 'search') {
        const opValStr = primaryValue || operationValue;
        if (opValStr.trim() === "") {
            toast({ title: "Input Missing", description: "Please enter a value for the operation.", variant: "destructive" });
            return;
        }
        valueForOp = parseInt(opValStr, 10);
        if (isNaN(valueForOp)) {
            toast({ title: "Invalid Value", description: "Please enter a numeric value for the operation.", variant: "destructive" });
            return;
        }
    }
    
    const newSteps = generateRBTreeSteps(
      opType,
      valuesForBuild,
      valueForOp,
      rbtRef.current // Pass the current state of the tree for insert/search
    );
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
        updateStateFromStep(0);
        const lastStepMsg = newSteps[newSteps.length - 1]?.message;
        if (lastStepMsg && opType !== 'build' && newSteps.length > 1) { // Avoid toast for initial build display
            const opDisplay = opType.charAt(0).toUpperCase() + opType.slice(1);
            toast({ title: `${opDisplay} Info`, description: lastStepMsg, duration: 3000 });
        }
    } else {
      setCurrentNodes([]); setCurrentEdges([]); setCurrentPath([]); setCurrentLine(null); setCurrentProcessingNodeId(null);
      setCurrentMessage("No steps generated. Check inputs or operation.");
    }
  }, [initialArrayInput, operationValue, toast, updateStateFromStep]);


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
      toast({ title: "Cannot Play", description: isFinished ? "Operation finished." : "No steps. Execute an operation first.", variant: "default" });
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
    const defaultInitialArray = '10,20,30,5,15,25,35,1,8';
    setInitialArrayInput(defaultInitialArray);
    setOperationValue('22');
    setSelectedOperation('insert');
    setCurrentMessage("RBT Reset. Building new tree with default values.");
    handleOperation('build', defaultInitialArray);
  };
  
  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!algoDetails) {
    return ( <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle className="w-16 h-16 text-destructive" /></main><Footer /></div> );
  }

  const isOperationWithValue = selectedOperation === 'insert' || selectedOperation === 'search';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentMessage}</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <BinaryTreeVisualizationPanel nodes={currentNodes} edges={currentEdges || []} traversalPath={currentPath} currentProcessingNodeId={currentProcessingNodeId} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <RedBlackTreeCodePanel currentLine={currentLine} selectedOperation={selectedOperation} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & RBT Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="initialArrayInput" className="text-sm font-medium flex items-center"><Cog className="mr-2 h-4 w-4"/>Initial Array (for Build Tree)</Label>
                <Input id="initialArrayInput" value={initialArrayInput} onChange={(e) => setInitialArrayInput(e.target.value)} placeholder="e.g., 10,20,5" disabled={isPlaying} />
                <Button onClick={() => handleOperation('build', initialArrayInput)} disabled={isPlaying} className="w-full md:w-auto">Build Tree</Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationSelect">Operation</Label>
                <Select value={selectedOperation} onValueChange={(v) => setSelectedOperation(v as RBTOperationType)} disabled={isPlaying}>
                  <SelectTrigger id="operationSelect"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insert">Insert Value</SelectItem>
                    <SelectItem value="search">Search Value</SelectItem>
                    <SelectItem value="delete" disabled>Delete Value (Conceptual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationValue">Value for Operation</Label>
                <Input id="operationValue" value={operationValue} onChange={(e) => setOperationValue(e.target.value)} placeholder="Enter number" type="number" disabled={isPlaying || !isOperationWithValue} />
                 <Button onClick={() => handleOperation(selectedOperation as 'insert' | 'search', operationValue)} disabled={isPlaying || !isOperationWithValue || selectedOperation === 'delete'} className="w-full md:w-auto mt-1">
                    {selectedOperation === 'insert' ? <PlusCircle className="mr-2 h-4 w-4"/> : <Search className="mr-2 h-4 w-4"/>}
                    Execute {selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-start pt-4 border-t">
              <Button onClick={handleResetControls} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Tree & Controls</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex gap-2">
                {!isPlaying ? <Button onClick={handlePlay} disabled={isFinished || steps.length <=1 } size="lg"><Play className="mr-2"/>Play</Button> 
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
             <p className="text-sm text-muted-foreground">
              Interactive visualization for **Insert** and **Search** operations are available. Delete is conceptual and not interactive.
              NIL nodes are logical and not visually rendered for clarity.
            </p>
          </CardContent>
        </Card>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
