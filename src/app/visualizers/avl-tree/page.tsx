
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BinaryTreeVisualizationPanel } from './BinaryTreeVisualizationPanel'; 
import { AVLTreeCodePanel } from './AVLTreeCodePanel';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; 
import type { TreeAlgorithmStep, BinaryTreeNodeVisual, AlgorithmDetailsProps, AVLOperationType, AVLTreeGraph, AVLNodeInternal } from './types'; 
import { algorithmMetadata } from './metadata'; 
import { useToast } from "@/hooks/use-toast";
import {
  generateAVLSteps,
  createInitialAVLTreeGraph,
} from './avl-tree-logic'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, SkipForward, RotateCcw, FastForward, Cog, PlusCircle, Search, Trash2, Binary } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';


const DEFAULT_ANIMATION_SPEED = 1000; 
const MIN_SPEED = 150;
const MAX_SPEED = 2500;
const MAX_NODES_VISUALIZATION = 12; // For build
const MAX_NODES_OVERALL = 15; // For insert

export default function AVLTreeVisualizerPage() {
  const { toast } = useToast();
  
  const [initialValuesInput, setInitialValuesInput] = useState('10,20,30,5,15,25,35,1,8');
  const [operationValueInput, setOperationValueInput] = useState('22'); 
  const [selectedOperation, setSelectedOperation] = useState<AVLOperationType | 'structure'>('build');
  
  const [steps, setSteps] = useState<TreeAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentNodes, setCurrentNodes] = useState<BinaryTreeNodeVisual[]>([]);
  const [currentEdges, setCurrentEdges] = useState<TreeAlgorithmStep['edges']>([]);
  const [currentPath, setCurrentPath] = useState<(string | number)[]>([]); 
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [currentProcessingNodeId, setCurrentProcessingNodeId] = useState<string|null>(null);
  const [currentMessage, setCurrentMessage] = useState<string>("Initialize tree or select an operation.");
  const [unbalancedNodeId, setUnbalancedNodeId] = useState<string|null>(null);
  const [rotationInfo, setRotationInfo] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const avlTreeRef = useRef<AVLTreeGraph>(createInitialAVLTreeGraph());

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setCurrentNodes(currentS.nodes);
      setCurrentEdges(currentS.edges || []); 
      setCurrentPath(currentS.traversalPath || []); 
      setCurrentLine(currentS.currentLine);
      setCurrentProcessingNodeId(currentS.currentProcessingNodeId ?? null);
      setCurrentMessage(currentS.message || "Step executed.");
      setUnbalancedNodeId(currentS.unbalancedNodeId ?? null);
      if (currentS.rotationType && currentS.rotationType !== 'None') {
        const involved = currentS.nodesInvolvedInRotation?.map(id => avlTreeRef.current.nodesMap.get(id)?.value).filter(Boolean).join(', ');
        setRotationInfo(`Rotation: ${currentS.rotationType}${involved ? ` (around/involving ${involved})` : ''}`);
      } else {
        setRotationInfo(null);
      }
      
      if (currentS.auxiliaryData?.finalGraphState) {
         avlTreeRef.current = currentS.auxiliaryData.finalGraphState as AVLTreeGraph;
      }
    }
  }, [steps]);
  
  const handleOperation = useCallback((
    opTypeInput: AVLOperationType | 'structure', 
    primaryValue?: string 
  ) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let valuesForBuild: string | undefined = undefined;
    let valueForOp: number | undefined = undefined;
    let opType = opTypeInput as AVLOperationType; // Assume it's a valid AVLOpType for logic

    if (opTypeInput === 'build') {
        valuesForBuild = primaryValue || initialValuesInput;
        const parsedBuildArray = valuesForBuild.split(',').map(s=>s.trim()).filter(s=>s!== '').map(Number).filter(n => !isNaN(n));
         if (parsedBuildArray.length > MAX_NODES_VISUALIZATION) { 
            toast({ title: "Input Too Large", description: `Max ${MAX_NODES_VISUALIZATION} nodes for Build AVL for smoother visualization.`, variant: "default" });
        }
        avlTreeRef.current = createInitialAVLTreeGraph(); // Reset tree structure for build
    } else if (opTypeInput === 'insert' || opTypeInput === 'delete' || opTypeInput === 'search') {
        opType = opTypeInput as AVLOperationType;
        const opValStr = primaryValue || operationValueInput;
        if (opValStr.trim() === "") {
            toast({ title: "Input Missing", description: "Please enter a value for the operation.", variant: "destructive" });
            setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentPath([]); setCurrentLine(null); setCurrentProcessingNodeId(null); setCurrentMessage("Error: Input missing for operation."); setIsPlaying(false); setIsFinished(true);
            return;
        }
        valueForOp = parseInt(opValStr, 10);
        if (isNaN(valueForOp) || valueForOp < -999 || valueForOp > 9999) { 
            toast({ title: "Invalid Value", description: "Value must be a number between -999 and 9999.", variant: "destructive" });
             setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentPath([]); setCurrentLine(null); setCurrentProcessingNodeId(null); setCurrentMessage("Error: Invalid value for operation."); setIsPlaying(false); setIsFinished(true);
            return;
        }
        const currentNonNilNodeCount = Array.from(avlTreeRef.current.nodesMap.values()).filter(node => node.value !== null).length;
         if (currentNonNilNodeCount >= MAX_NODES_OVERALL && opType === 'insert') { 
             toast({ title: "Tree Too Large", description: `Max ${MAX_NODES_OVERALL} nodes in tree for smoother insert visualization.`, variant: "default" });
             return;
        }
        if (currentNonNilNodeCount === 0 && (opType === 'delete' || opType === 'search')) {
            toast({ title: `Tree Empty`, description: `Cannot ${opType} from an empty tree.`, variant: "default" });
            return;
        }
    } else if (opTypeInput === 'structure') {
        opType = 'structure'; // For logic function
        const currentVisuals = generateAVLSteps(opType, undefined, undefined, avlTreeRef.current);
        setSteps(currentVisuals);
        setCurrentStepIndex(0);
        if (currentVisuals.length > 0) updateStateFromStep(0);
        else {setCurrentNodes([]); setCurrentEdges([]); setCurrentPath([]); setCurrentLine(null); setCurrentProcessingNodeId(null);setCurrentMessage("Cannot display structure.");}
        setIsPlaying(false); setIsFinished(true);
        return;
    }
    
    const newSteps = generateAVLSteps(
      opType,
      valuesForBuild,
      valueForOp,
      avlTreeRef.current 
    );
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
        updateStateFromStep(0); 
        const lastStepMsg = newSteps[newSteps.length - 1]?.message;
        if (lastStepMsg && opType !== 'build' && opType !== 'structure' && newSteps.length > 1) { 
            const opDisplay = opType.charAt(0).toUpperCase() + opType.slice(1);
            if (!lastStepMsg.toLowerCase().includes("fixup") && !lastStepMsg.toLowerCase().includes("rotate") && !lastStepMsg.toLowerCase().includes("balancing")) {
                 toast({ title: `${opDisplay} Info`, description: lastStepMsg, duration: 3000 });
            }
        } else if (opType === 'build' && newSteps.length > 1 && lastStepMsg) {
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
      toast({ title: "Cannot Play", description: isFinished ? "Operation finished. Reset or new op." : "No steps. Execute an operation first.", variant: "default" });
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
    setIsPlaying(false); setIsFinished(true); // Mark as finished to prevent auto-play
    const defaultInitialArray = '10,20,30,5,15,25,35,1,8';
    setInitialValuesInput(defaultInitialArray);
    setOperationValueInput('22');
    setSelectedOperation('build'); 
    setCurrentMessage("AVL Tree Reset. Building new tree with default values.");
    handleOperation('build', defaultInitialArray);
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

  const isOperationWithValue = selectedOperation === 'insert' || selectedOperation === 'delete' || selectedOperation === 'search';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentMessage}</p>
           {rotationInfo && <p className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400">{rotationInfo}</p>}
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <BinaryTreeVisualizationPanel 
                nodes={currentNodes} 
                edges={currentEdges || []} 
                traversalPath={currentPath} 
                currentProcessingNodeId={currentProcessingNodeId}
                unbalancedNodeId={unbalancedNodeId}
            />
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
                <Label htmlFor="initialValuesInputAVL" className="text-sm font-medium flex items-center"><Cog className="mr-2 h-4 w-4"/>Initial Values (for Build)</Label>
                <Input id="initialValuesInputAVL" value={initialValuesInput} onChange={(e) => setInitialValuesInput(e.target.value)} placeholder="e.g., 10,20,5" disabled={isPlaying} />
                <Button onClick={() => handleOperation('build', initialValuesInput)} disabled={isPlaying} className="w-full md:w-auto"><Binary className="mr-2 h-4 w-4"/>Build Tree</Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationSelectAVL">Operation</Label>
                <Select value={selectedOperation} onValueChange={(v) => setSelectedOperation(v as AVLOperationType | 'structure')} disabled={isPlaying}>
                  <SelectTrigger id="operationSelectAVL"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insert">Insert Value</SelectItem>
                    <SelectItem value="search">Search Value</SelectItem>
                    <SelectItem value="delete">Delete Value</SelectItem>
                     <SelectItem value="structure">Show Structure Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationValueInputAVL">Value for Operation</Label>
                <Input id="operationValueInputAVL" value={operationValueInput} onChange={(e) => setOperationValueInput(e.target.value)} placeholder="Enter number" type="number" disabled={isPlaying || !isOperationWithValue || selectedOperation === 'structure' || selectedOperation === 'build'} />
                 <Button onClick={() => handleOperation(selectedOperation as 'insert' | 'search' | 'delete', operationValueInput)} disabled={isPlaying || !isOperationWithValue || selectedOperation === 'structure' || selectedOperation === 'build'} className="w-full md:w-auto mt-1">
                    {selectedOperation === 'insert' ? <PlusCircle className="mr-2 h-4 w-4"/> : selectedOperation === 'search' ? <Search className="mr-2 h-4 w-4"/> : <Trash2 className="mr-2 h-4 w-4"/>}
                    Execute {selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-start pt-4 border-t">
              <Button onClick={handleResetControls} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Tree &amp; Controls</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex gap-2">
                {!isPlaying ? <Button onClick={handlePlay} disabled={isFinished || steps.length <=1 || selectedOperation === 'structure' } size="lg"><Play className="mr-2"/>Play</Button> 
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
              AVL Tree rotations and balancing are complex. Deletion rebalancing shows the first required rotation and notes that further rebalancing might be needed upwards.
            </p>
          </CardContent>
        </Card>
        <AlgorithmDetailsCard {...localAlgoDetails} />
      </main>
      <Footer />
    </div>
  );
}
```