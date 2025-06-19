
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BinaryTreeVisualizationPanel } from './BinaryTreeVisualizationPanel'; 
import { AVLTreeCodePanel } from './AVLTreeCodePanel';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; 
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, BinaryTreeEdgeVisual, AVLNodeInternal, AlgorithmDetailsProps } from './types'; 
import { algorithmMetadata } from './metadata'; 
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import {
  generateAVLSteps,
  getFinalAVLTreeState,
  resetAVLTreeState,
} from './avl-tree-logic'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, SkipForward, RotateCcw, FastForward, Cog, PlusCircle, Trash2 } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DEFAULT_ANIMATION_SPEED = 1200; 
const MIN_SPEED = 200;
const MAX_SPEED = 3000;

export default function AVLTreeVisualizerPage() {
  const { toast } = useToast();
  
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const avlTreeRef = useRef<{ rootId: string | null, nodes: Map<string, AVLNodeInternal> }>({ rootId: null, nodes: new Map() });

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
  }, [steps]); // Depends on steps, which is stable between re-renders of this callback.
  
  const processOperation = useCallback((operation: 'build' | 'insert' | 'delete') => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let valuesToProcess: number[] = [];
    if (operation === 'build') {
        valuesToProcess = initialValuesInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        if (valuesToProcess.length === 0 && initialValuesInput.trim() !== "") {
            toast({ title: "Invalid Input", description: "Please enter comma-separated numbers for build.", variant: "destructive" });
            return;
        }
        if (valuesToProcess.length > 15) {
             toast({ title: "Input Too Large", description: "Max 15 nodes for build for smoother visualization.", variant: "default" });
        }
        resetAVLTreeState(); 
        avlTreeRef.current = { rootId: null, nodes: new Map() }; 
    } else if (operation === 'insert' || operation === 'delete') {
        const val = parseInt(operationValueInput, 10);
        if (isNaN(val)) {
            toast({ title: "Invalid Value", description: `Please enter a numeric value to ${operation}.`, variant: "destructive" });
            return;
        }
        if (operation === 'insert' && avlTreeRef.current.nodes.size >= 20) {
             toast({ title: "Tree Too Large", description: "Max 20 nodes in tree for smoother visualization.", variant: "default" });
             return;
        }
        if (operation === 'delete' && avlTreeRef.current.nodes.size === 0) {
            toast({ title: "Tree Empty", description: "Cannot delete from an empty tree.", variant: "default" });
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
        const firstStep = newSteps[0];
        setCurrentNodes(firstStep.nodes);
        setCurrentEdges(firstStep.edges);
        setCurrentPath(firstStep.traversalPath || []);
        setCurrentLine(firstStep.currentLine);
        setCurrentProcessingNodeId(firstStep.currentProcessingNodeId ?? null);
        setCurrentMessage(firstStep.message || "Step executed.");

        const finalState = getFinalAVLTreeState(); 
        avlTreeRef.current = finalState; 
        const lastStepMsg = newSteps[newSteps.length - 1]?.message;
        if (lastStepMsg) {
            const opDisplay = operation.charAt(0).toUpperCase() + operation.slice(1);
            toast({ title: `${opDisplay} Info`, description: lastStepMsg, duration: 3000 });
        }
    } else {
      setCurrentNodes([]); setCurrentEdges([]); setCurrentPath([]); setCurrentLine(null); setCurrentProcessingNodeId(null);
      setCurrentMessage("No steps generated. Check inputs or operation.");
    }
  }, [initialValuesInput, operationValueInput, toast, setCurrentNodes, setCurrentEdges, setCurrentPath, setCurrentLine, setCurrentProcessingNodeId, setCurrentMessage, setSteps, setCurrentStepIndex, setIsPlaying, setIsFinished]);

  const handleBuildTree = () => processOperation('build');
  const handleInsertValue = () => processOperation('insert');
  const handleDeleteValue = () => processOperation('delete');

  useEffect(() => {
    handleBuildTree(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initial build on mount


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
    setCurrentMessage("AVL Tree reset. Build a new tree or perform operations.");
    // Defer build until next cycle if setInitialValuesInput triggers it, or call explicitly if not.
    // For this setup, explicitly calling it ensures it runs after state updates.
    processOperation('build'); // Rebuild with default values
  };
  
  const localAlgoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!localAlgoDetails) {
    return ( <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle className="w-16 h-16 text-destructive" /></main><Footer /></div> );
  }

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
            <AVLTreeCodePanel currentLine={currentLine} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls &amp; AVL Tree Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="initialValuesInput" className="text-sm font-medium">Initial Values (for Build Tree)</Label>
                <Input id="initialValuesInput" value={initialValuesInput} onChange={(e) => setInitialValuesInput(e.target.value)} placeholder="e.g., 50,30,70" disabled={isPlaying} />
                 <Button onClick={handleBuildTree} disabled={isPlaying} className="w-full md:w-auto"><Cog className="mr-2 h-4 w-4"/>Build Tree</Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationValueInput">Value for Insert/Delete</Label>
                <Input id="operationValueInput" value={operationValueInput} onChange={(e) => setOperationValueInput(e.target.value)} placeholder="Enter number" type="number" disabled={isPlaying} />
                 <div className="flex gap-2 mt-1">
                    <Button onClick={handleInsertValue} disabled={isPlaying} className="flex-1"><PlusCircle className="mr-2 h-4 w-4"/>Insert</Button>
                    <Button onClick={handleDeleteValue} disabled={isPlaying || avlTreeRef.current.nodes.size === 0} variant="destructive" className="flex-1"><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                 </div>
              </div>
            </div>
            
            <div className="flex items-center justify-start pt-4 border-t">
              <Button onClick={handleResetControls} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Controls &amp; Tree</Button>
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
        <AlgorithmDetailsCard {...localAlgoDetails} />
      </main>
      <Footer />
    </div>
  );
}

```