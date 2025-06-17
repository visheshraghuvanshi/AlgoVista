
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BinaryTreeVisualizationPanel } from '@/app/visualizers/binary-tree-traversal/BinaryTreeVisualizationPanel'; // Re-using for tree display
import { HeapOperationsCodePanel } from './HeapOperationsCodePanel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, TreeAlgorithmStep, BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { generateHeapSteps, HEAP_OPERATION_LINE_MAPS } from './heap-operations-logic';
import type { HeapOperationType } from './heap-operations-logic';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge, Binary, PlusCircle, MinusCircle, Cog } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


const DEFAULT_ANIMATION_SPEED = 900;
const MIN_SPEED = 150;
const MAX_SPEED = 2200;
const ALGORITHM_SLUG = 'heap-operations';

export default function HeapOperationsPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);

  const [heapArrayInput, setHeapArrayInput] = useState('4,10,3,5,1');
  const [operationValue, setOperationValue] = useState('2'); // For insert
  const [selectedOperation, setSelectedOperation] = useState<HeapOperationType>('buildMinHeap');
  
  const [steps, setSteps] = useState<TreeAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentNodes, setCurrentNodes] = useState<BinaryTreeNodeVisual[]>([]);
  const [currentEdges, setCurrentEdges] = useState<BinaryTreeEdgeVisual[]>([]);
  const [currentPath, setCurrentPath] = useState<(string | number)[]>([]); 
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [currentProcessingNodeId, setCurrentProcessingNodeId] = useState<string|null>(null);
  const [currentMessage, setCurrentMessage] = useState<string>("Initialize heap or select an operation.");

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Stores the actual heap array separate from visualization nodes/edges
  const heapDataRef = useRef<number[]>([]); 


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
      setCurrentPath(currentS.traversalPath || []); 
      setCurrentLine(currentS.currentLine);
      setCurrentProcessingNodeId(currentS.currentProcessingNodeId ?? null);
      setCurrentMessage(currentS.message || "Step executed.");
      // Update heapDataRef if the step's array state is relevant (e.g., after a build or modification)
      // For heap, the 'nodes' in TreeAlgorithmStep will represent the tree view,
      // but the underlying array state is managed in heapDataRef and updated by generateHeapSteps.
    }
  }, [steps]);
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let valueForOp: number | undefined = undefined;
    if (selectedOperation === 'insertMinHeap') {
      valueForOp = parseInt(operationValue, 10);
      if (isNaN(valueForOp)) {
        toast({ title: "Invalid Value", description: "Please enter a numeric value for insertion.", variant: "destructive" });
        return;
      }
    }
    
    const newSteps = generateHeapSteps(
      heapDataRef, // Pass the ref so logic can update the underlying array
      selectedOperation,
      valueForOp,
      selectedOperation === 'buildMinHeap' ? heapArrayInput : undefined // Initial array only for build
    );
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
        updateStateFromStep(0);
        const lastStep = newSteps[newSteps.length - 1];
        if(lastStep.message?.toLowerCase().includes("error")){
             toast({ title: "Operation Info", description: lastStep.message, variant: "destructive" });
        } else if (lastStep.message && (selectedOperation !== 'buildMinHeap' || newSteps.length > 1) ) { // Avoid toast for initial build display
             toast({ title: selectedOperation.replace(/([A-Z])/g, ' $1').trim(), description: lastStep.message, variant: "default", duration: 3000 });
        }
    } else {
      setCurrentNodes([]); setCurrentEdges([]); setCurrentPath([]); setCurrentLine(null); setCurrentProcessingNodeId(null);
      setCurrentMessage("No steps generated. Check inputs or operation.");
    }
  }, [heapArrayInput, selectedOperation, operationValue, toast, updateStateFromStep]);

  // Effect for initial build or when input array string changes AND build is selected
  useEffect(() => {
    if (selectedOperation === 'buildMinHeap') {
        heapDataRef.current = heapArrayInput.split(',').map(s => s.trim()).filter(s => s!== '').map(Number).filter(n => !isNaN(n));
        handleGenerateSteps();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heapArrayInput, selectedOperation]); // handleGenerateSteps is not added to avoid loops with its own dependencies

  // Effect for other operations when selected or value changes
   useEffect(() => {
    if (selectedOperation !== 'buildMinHeap') {
        // For insert/extract, we operate on the current heapDataRef.current
        // The initial state of heapDataRef.current should be set by a 'buildMinHeap' first or be empty.
        handleGenerateSteps();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOperation, operationValue]); // Only re-run for these ops if they or their value changes


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
  const handleReset = () => { 
    setIsPlaying(false); setIsFinished(false);
    heapDataRef.current = []; // Clear internal heap data
    setHeapArrayInput('4,10,3,5,1'); // Reset input string
    setSelectedOperation('buildMinHeap'); // Default to build
    setCurrentMessage("Heap reset. Build heap or select an operation.");
    // handleGenerateSteps will be triggered by heapArrayInput or selectedOperation change
  };
  
  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.longDescription || algorithm.description,
    timeComplexities: { 
      best: "Insert: O(1) (amortized if no heapifyUp), Extract-Min/Max: O(log n)", 
      average: "Insert: O(log n), Extract-Min/Max: O(log n), BuildHeap: O(n)", 
      worst: "Insert: O(log n), Extract-Min/Max: O(log n), BuildHeap: O(n)" 
    },
    spaceComplexity: "O(n) for storing elements. O(log n) for recursive heapify, O(1) for iterative.",
  } : null;

  if (!algorithm || !algoDetails) {
    return ( <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle className="w-16 h-16 text-destructive" /></main><Footer /></div> );
  }

  const isOperationWithValue = selectedOperation === 'insertMinHeap';

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
            <HeapOperationsCodePanel currentLine={currentLine} selectedOperation={selectedOperation} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Heap Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="heapArrayInput" className="text-sm font-medium flex items-center"><Binary className="mr-2 h-4 w-4"/>Initial Array (for Build Heap)</Label>
                <Input id="heapArrayInput" value={heapArrayInput} onChange={(e) => setHeapArrayInput(e.target.value)} placeholder="e.g., 4,10,3,5,1" disabled={isPlaying || selectedOperation !== 'buildMinHeap'} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationSelect">Operation</Label>
                <Select value={selectedOperation} onValueChange={(v) => setSelectedOperation(v as HeapOperationType)} disabled={isPlaying}>
                  <SelectTrigger id="operationSelect"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buildMinHeap"><Cog className="mr-2 h-4 w-4 inline-block"/>Build Min-Heap</SelectItem>
                    <SelectItem value="insertMinHeap"><PlusCircle className="mr-2 h-4 w-4 inline-block"/>Insert Value</SelectItem>
                    <SelectItem value="extractMin"><MinusCircle className="mr-2 h-4 w-4 inline-block"/>Extract Min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationValue">Value for Insert</Label>
                <Input id="operationValue" value={operationValue} onChange={(e) => setOperationValue(e.target.value)} placeholder="Enter number" type="number" disabled={isPlaying || !isOperationWithValue} />
              </div>
            </div>
            <Button onClick={handleGenerateSteps} disabled={isPlaying}>Execute Operation & Generate Steps</Button>
            <div className="flex items-center justify-start pt-4 border-t">
              <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Heap & Controls</Button>
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

