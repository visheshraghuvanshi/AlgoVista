
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BinaryTreeVisualizationPanel } from './BinaryTreeVisualizationPanel'; 
import { AVLTreeCodePanel } from './AVLTreeCodePanel';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; 
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, AVLNodeInternal, AlgorithmDetailsProps, AVLOperationType } from './types'; 
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge, Binary, PlusCircle, Search, Trash2, Cog } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DEFAULT_ANIMATION_SPEED = 1200; 
const MIN_SPEED = 200;
const MAX_SPEED = 3000;

export default function AVLTreeVisualizerPage() {
  const { toast } = useToast();
  
  const [initialValuesInput, setInitialValuesInput] = useState('50,30,70,20,40,60,80,15,25,35,45,55,65,75,85');
  const [operationValueInput, setOperationValueInput] = useState('22'); 
  const [selectedOperation, setSelectedOperation] = useState<AVLOperationType>('build');
  
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
  
  const avlTreeRef = useRef<{ rootId: string | null, nodes: Map<string, AVLNodeInternal> }>({ rootId: null, nodes: new Map() });

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setCurrentNodes(currentS.nodes);
      setCurrentEdges(currentS.edges || []); 
      setCurrentPath(currentS.traversalPath || []); 
      setCurrentLine(currentS.currentLine);
      setCurrentProcessingNodeId(currentS.currentProcessingNodeId ?? null);
      setCurrentMessage(currentS.message || "Step executed.");
    }
  }, [steps]);
  
  const handleOperation = useCallback((
    opTypeInput: AVLOperationType,
    primaryValue?: string // For build: initialArrayInput, for insert/search/delete: operationValueInput
  ) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let valuesForBuild: string | undefined = undefined;
    let valueForOp: number | undefined = undefined;

    if (opTypeInput === 'build') {
        valuesForBuild = primaryValue || initialValuesInput;
        const parsedBuildArray = valuesForBuild.split(',').map(s=>s.trim()).filter(s=>s!== '').map(Number).filter(n => !isNaN(n));
         if (parsedBuildArray.length > 15) { 
            toast({ title: "Input Too Large", description: "Max 15 nodes for Build AVL for smoother visualization.", variant: "default" });
        }
        resetAVLTreeState(); // Clear internal state in logic file
        avlTreeRef.current = { rootId: null, nodes: new Map() }; // Reset ref
    } else if (opTypeInput === 'insert' || opTypeInput === 'delete' || opTypeInput === 'search') {
        const opValStr = primaryValue || operationValueInput;
        if (opValStr.trim() === "") {
            toast({ title: "Input Missing", description: "Please enter a value for the operation.", variant: "destructive" });
            return;
        }
        valueForOp = parseInt(opValStr, 10);
        if (isNaN(valueForOp) || valueForOp < -999 || valueForOp > 9999) { // Wider range for AVL
            toast({ title: "Invalid Value", description: "Value for operation must be a number between -999 and 9999.", variant: "destructive" });
            return;
        }
         if (avlTreeRef.current.nodes.size >= 20 && opTypeInput === 'insert') { 
             toast({ title: "Tree Too Large", description: "Max 20 nodes in tree for smoother insert visualization.", variant: "default" });
             return;
        }
        if (avlTreeRef.current.nodes.size === 0 && (opTypeInput === 'delete' || opTypeInput === 'search')) {
            toast({ title: `Tree Empty`, description: `Cannot ${opTypeInput} from an empty tree.`, variant: "default" });
            return;
        }
    } else if (opTypeInput === 'structure') {
        // Display current structure without generating full steps
        const { nodes: vizNodes, edges: vizEdges } = generateAVLSteps('structure', [], avlTreeRef.current.rootId, avlTreeRef.current.nodes)[0] || {nodes:[], edges:[]};
        setCurrentNodes(vizNodes); setCurrentEdges(vizEdges);
        setCurrentPath([]); setCurrentLine(null); setCurrentProcessingNodeId(null);
        setCurrentMessage("Displaying current AVL tree structure. Select an operation.");
        setSteps([]); setIsPlaying(false); setIsFinished(true);
        return;
    }
    
    const newSteps = generateAVLSteps(
      opTypeInput,
      valuesForBuild ? valuesForBuild.split(',').map(Number) : [],
      avlTreeRef.current.rootId, // Pass current rootId
      avlTreeRef.current.nodes, // Pass current nodesMap
      valueForOp
    );
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
        updateStateFromStep(0); // Update UI with the first step
        // Persist the final state of the graph structure to avlTreeRef after operations
        const finalState = getFinalAVLTreeState(); 
        avlTreeRef.current = finalState;

        const lastStepMsg = newSteps[newSteps.length - 1]?.message;
        if (lastStepMsg && opTypeInput !== 'build' && opTypeInput !== 'structure' && newSteps.length > 1) { 
            const opDisplay = opTypeInput.charAt(0).toUpperCase() + opTypeInput.slice(1);
            if (!lastStepMsg.toLowerCase().includes("fixup") && !lastStepMsg.toLowerCase().includes("rotate") && !lastStepMsg.toLowerCase().includes("balance") && !lastStepMsg.toLowerCase().includes("height")) {
                 toast({ title: `${opDisplay} Info`, description: lastStepMsg, duration: 3000 });
            }
        } else if (opTypeInput === 'build' && newSteps.length > 1 && lastStepMsg) {
             toast({ title: "Build AVL Tree", description: lastStepMsg, duration: 2000 });
        }
    } else {
      setCurrentNodes([]); setCurrentEdges([]); setCurrentPath([]); setCurrentLine(null); setCurrentProcessingNodeId(null);
      setCurrentMessage("No steps generated. Check inputs or operation.");
    }
  }, [initialValuesInput, operationValueInput, toast, updateStateFromStep]);

  useEffect(() => {
    handleOperation('build', initialValuesInput);
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
  const handleFullReset = () => { 
    setIsPlaying(false); setIsFinished(true);
    const defaultInitialArray = '50,30,70,20,40,60,80,15,25,35,45,55,65,75,85';
    setInitialValuesInput(defaultInitialArray);
    setOperationValueInput('22');
    setSelectedOperation('build');
    setCurrentMessage("AVL Tree Reset. Building new tree with default values.");
    handleOperation('build', defaultInitialArray); // Rebuild with defaults
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

  const isOperationWithValue = selectedOperation === 'insert' || selectedOperation === 'delete' || selectedOperation === 'search';

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="initialValuesInput" className="text-sm font-medium flex items-center"><Cog className="mr-2 h-4 w-4"/>Initial Values (for Build)</Label>
                <Input id="initialValuesInput" value={initialValuesInput} onChange={(e) => setInitialValuesInput(e.target.value)} placeholder="e.g., 50,30,70" disabled={isPlaying} />
                <Button onClick={() => handleOperation('build', initialValuesInput)} disabled={isPlaying} className="w-full mt-1">Build Tree</Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationSelect">Operation</Label>
                <Select value={selectedOperation} onValueChange={(v) => setSelectedOperation(v as AVLOperationType)} disabled={isPlaying}>
                  <SelectTrigger id="operationSelect"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="structure">Show Structure Only</SelectItem>
                    <SelectItem value="insert">Insert Value</SelectItem>
                    <SelectItem value="delete">Delete Value</SelectItem>
                    <SelectItem value="search">Search Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationValueInput">Value for Operation</Label>
                <Input id="operationValueInput" value={operationValueInput} onChange={(e) => setOperationValueInput(e.target.value)} placeholder="Enter number" type="number" disabled={isPlaying || !isOperationWithValue || selectedOperation === 'structure'} />
                 <Button onClick={() => handleOperation(selectedOperation as 'insert' | 'delete' | 'search', operationValueInput)} disabled={isPlaying || !isOperationWithValue || selectedOperation === 'structure' || selectedOperation === 'build'} className="w-full md:w-auto mt-1">
                    {selectedOperation === 'insert' ? <PlusCircle className="mr-2 h-4 w-4"/> : selectedOperation === 'delete' ? <Trash2 className="mr-2 h-4 w-4"/> : <Search className="mr-2 h-4 w-4"/>}
                    Execute {selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-start pt-4 border-t">
              <Button onClick={handleFullReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset All</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex gap-2">
                {!isPlaying ? <Button onClick={handlePlay} disabled={isFinished || steps.length <=1 || selectedOperation === 'structure'} size="lg"><Play className="mr-2"/>Play</Button> 
                             : <Button onClick={handlePause} size="lg"><Pause className="mr-2"/>Pause</Button>}
                <Button onClick={handleStep} variant="outline" disabled={isFinished || steps.length <=1 || selectedOperation === 'structure'} size="lg"><SkipForward className="mr-2"/>Step</Button>
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
              Note: Delete operation balancing logic is complex and steps are conceptual for fixups. NIL nodes are logical.
            </p>
          </CardContent>
        </Card>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
