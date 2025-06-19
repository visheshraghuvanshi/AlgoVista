
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BinaryTreeVisualizationPanel } from './BinaryTreeVisualizationPanel'; // Local import
import { HeapOperationsCodePanel } from './HeapOperationsCodePanel';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, BinaryTreeEdgeVisual, AlgorithmDetailsProps } from './types'; // Local import
import type { HeapOperationType } from './types'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { generateHeapSteps, HEAP_OPERATION_LINE_MAPS } from './heap-operations-logic';
import { algorithmMetadata } from './metadata'; 

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

export default function HeapOperationsPage() {
  const { toast } = useToast();

  const [heapArrayInput, setHeapArrayInput] = useState('4,10,3,5,1');
  const [operationValue, setOperationValue] = useState('2'); 
  const [selectedOperation, setSelectedOperation] = useState<HeapOperationType>('buildMinHeap');
  
  const [steps, setSteps] = useState<TreeAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentNodes, setCurrentNodes] = useState<BinaryTreeNodeVisual[]>([]);
  const [currentEdges, setCurrentEdges] = useState<TreeAlgorithmStep['edges']>([]);
  const [currentPath, setCurrentPath] = useState<(string | number)[]>([]); 
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [currentProcessingNodeId, setCurrentProcessingNodeId] = useState<string|null>(null);
  const [currentMessage, setCurrentMessage] = useState<string>("Initialize heap or select an operation.");

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const heapDataRef = useRef<number[]>([]); 


  useEffect(() => {
    if (selectedOperation === 'buildMinHeap') {
      heapDataRef.current = heapArrayInput.split(',').map(s => s.trim()).filter(s=>s!== '').map(Number).filter(n => !isNaN(n));
      handleOperation('buildMinHeap', heapArrayInput);
    } else {
      const { nodes, edges } = generateHeapSteps(heapDataRef, 'classDefinition')[0] || {nodes: [], edges: []};
      setCurrentNodes(nodes);
      setCurrentEdges(edges);
      if(heapDataRef.current.length === 0 && heapArrayInput.trim() !== "") {
         setCurrentMessage("Heap is empty. Build tree with initial array or insert values.");
      } else if (heapDataRef.current.length > 0){
         setCurrentMessage("Current heap structure. Select an operation.");
      } else {
         setCurrentMessage("Heap is empty. Enter initial array and Build, or Insert values.");
      }
    }
  }, [heapArrayInput, selectedOperation]); // Re-evaluate if initial array or selected op changes // eslint-disable-line react-hooks/exhaustive-deps

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
      opTypeInput: HeapOperationType, 
      primaryValue?: string, 
    ) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const opType = opTypeInput;

    let valuesForBuild: string | undefined = undefined;
    let valueForOp: number | undefined = undefined;

    if (opType === 'buildMinHeap') {
        valuesForBuild = primaryValue || heapArrayInput;
        const parsedBuildArray = valuesForBuild.split(',').map(s=>s.trim()).filter(s=>s!== '').map(Number).filter(n => !isNaN(n));
        if (parsedBuildArray.length > 15) {
            toast({ title: "Input Too Large", description: "Max 15 elements for Build Heap for smoother visualization.", variant: "default" });
        }
        heapDataRef.current = []; // Reset heap for new build
    } else if (opType === 'insertMinHeap') {
        const opValStr = primaryValue || operationValue;
        if (opValStr.trim() === "") {
            toast({ title: "Input Missing", description: "Please enter a value for insertion.", variant: "destructive" });
            return;
        }
        valueForOp = parseInt(opValStr, 10);
        if (isNaN(valueForOp) || valueForOp < -999 || valueForOp > 999) {
            toast({ title: "Invalid Value", description: "Please enter a numeric value between -999 and 999 for insertion.", variant: "destructive" });
            return;
        }
        if (heapDataRef.current.length >= 15 && opType === 'insertMinHeap') {
             toast({ title: "Heap Too Large", description: "Max 15 elements in heap for smoother insert visualization.", variant: "default" });
             return;
        }
    } else if (opType === 'classDefinition') {
        const { nodes, edges } = generateHeapSteps(heapDataRef, 'classDefinition')[0] || {nodes: [], edges: []};
        setCurrentNodes(nodes);
        setCurrentEdges(edges);
        setCurrentPath([]);
        setCurrentLine(null);
        setCurrentProcessingNodeId(null);
        setCurrentMessage("Displaying Heap class structure. Select an operation to visualize.");
        setSteps([]);
        setIsPlaying(false);
        setIsFinished(true);
        return;
    }
    
    const newSteps = generateHeapSteps(
      heapDataRef, 
      opType,
      valueForOp,
      valuesForBuild 
    );
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
        const firstStep = newSteps[0];
        setCurrentNodes(firstStep.nodes);
        setCurrentEdges(firstStep.edges);
        setCurrentPath(firstStep.traversalPath || []);
        setCurrentLine(firstStep.currentLine);
        setCurrentProcessingNodeId(firstStep.currentProcessingNodeId ?? null);
        setCurrentMessage(firstStep.message || "Step executed.");
        
        const lastStepMsg = newSteps[newSteps.length - 1]?.message;
        if (lastStepMsg && opType !== 'buildMinHeap' && opType !== 'classDefinition' && newSteps.length > 1) { 
            const opDisplay = opType.replace(/([A-Z])/g, ' $1').trim();
            toast({ title: `${opDisplay}`, description: lastStepMsg, variant: "default", duration: 3000 });
        } else if (opType === 'buildMinHeap' && newSteps.length > 1 && lastStepMsg) {
             toast({ title: "Build Min-Heap", description: lastStepMsg, variant: "default", duration: 2000 });
        }
    } else {
      setCurrentNodes([]); setCurrentEdges([]); setCurrentPath([]); setCurrentLine(null); setCurrentProcessingNodeId(null);
      setCurrentMessage("No steps generated. Check inputs or operation.");
    }
  }, [heapArrayInput, operationValue, toast, setCurrentNodes, setCurrentEdges, setCurrentPath, setCurrentLine, setCurrentProcessingNodeId, setCurrentMessage, setSteps, setCurrentStepIndex, setIsPlaying, setIsFinished]);


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
    const defaultInitialArray = '4,10,3,5,1';
    setHeapArrayInput(defaultInitialArray);
    setOperationValue('2');
    heapDataRef.current = []; 
    setSelectedOperation('buildMinHeap'); 
    setCurrentMessage("Heap reset. Building new tree with default values.");
    // Let useEffect handle the build with new default values
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

  const isOperationWithValue = selectedOperation === 'insertMinHeap';

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
            <HeapOperationsCodePanel currentLine={currentLine} selectedOperation={selectedOperation} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls &amp; Heap Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="heapArrayInput" className="text-sm font-medium flex items-center"><Cog className="mr-2 h-4 w-4"/>Initial Array (for Build Heap)</Label>
                <Input id="heapArrayInput" value={heapArrayInput} onChange={(e) => setHeapArrayInput(e.target.value)} placeholder="e.g., 4,10,3,5,1" disabled={isPlaying} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationSelect">Operation</Label>
                <Select value={selectedOperation} onValueChange={(v) => setSelectedOperation(v as HeapOperationType)} disabled={isPlaying}>
                  <SelectTrigger id="operationSelect"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buildMinHeap"><Cog className="mr-2 h-4 w-4 inline-block"/>Build Min-Heap</SelectItem>
                    <SelectItem value="insertMinHeap"><PlusCircle className="mr-2 h-4 w-4 inline-block"/>Insert Value</SelectItem>
                    <SelectItem value="extractMin"><MinusCircle className="mr-2 h-4 w-4 inline-block"/>Extract Min</SelectItem>
                     <SelectItem value="classDefinition">Show Class Structure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationValue">Value for Insert</Label>
                <Input id="operationValue" value={operationValue} onChange={(e) => setOperationValue(e.target.value)} placeholder="Enter number" type="number" disabled={isPlaying || !isOperationWithValue || selectedOperation === 'classDefinition'} />
                 <Button onClick={()=>handleOperation(selectedOperation, isOperationWithValue ? operationValue : heapArrayInput)} disabled={isPlaying || selectedOperation === 'classDefinition'} className="w-full md:w-auto mt-1">
                    Execute {selectedOperation.replace(/([A-Z])/g, ' $1').trim()}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-start pt-4 border-t">
              <Button onClick={handleResetControls} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Heap &amp; Controls</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex gap-2">
                {!isPlaying ? <Button onClick={handlePlay} disabled={isFinished || steps.length <=1 || selectedOperation === 'classDefinition' } size="lg"><Play className="mr-2"/>Play</Button> 
                             : <Button onClick={handlePause} size="lg"><Pause className="mr-2"/>Pause</Button>}
                <Button onClick={handleStep} variant="outline" disabled={isFinished || steps.length <=1 || selectedOperation === 'classDefinition'} size="lg"><SkipForward className="mr-2"/>Step</Button>
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
              NIL nodes are logical and not visually rendered for clarity. Delete operation is conceptual.
            </p>
          </CardContent>
        </Card>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
