
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LinkedListVisualizationPanel } from '@/components/algo-vista/LinkedListVisualizationPanel';
import { SinglyLinkedListCodePanel } from './SinglyLinkedListCodePanel'; 
import { LinkedListControlsPanel, type LinkedListOperation, ALL_OPERATIONS } from '@/components/algo-vista/LinkedListControlsPanel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, LinkedListAlgorithmStep, LinkedListNodeVisual } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { SINGLY_LL_LINE_MAPS, generateSinglyLinkedListSteps } from './singly-linked-list-logic';

const ALGORITHM_SLUG = 'singly-linked-list';
const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

const SLL_AVAILABLE_OPS: LinkedListOperation[] = ['init', 'insertHead', 'insertTail', 'deleteByValue', 'search', 'traverse'];

export default function SinglyLinkedListPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);

  const [initialListStr, setInitialListStr] = useState('1,2,3');
  const [inputValue, setInputValue] = useState('4'); // For insert/delete/search value
  const [selectedOperation, setSelectedOperation] = useState<LinkedListOperation | null>('init');
  
  const [steps, setSteps] = useState<LinkedListAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [currentNodes, setCurrentNodes] = useState<LinkedListNodeVisual[]>([]);
  const [currentHeadId, setCurrentHeadId] = useState<string | null>(null);
  const [currentAuxPointers, setCurrentAuxPointers] = useState<Record<string, string | null>>({});
  const [currentMessage, setCurrentMessage] = useState<string | undefined>("");
  const [currentLine, setCurrentLine] = useState<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // This ref will store the actual list structure (nodes and their next pointers)
  // It will be modified by the logic generating steps, but the visualizer will re-render based on `currentNodes` from `steps`.
  const listStateRef = useRef<{ headId: string | null, nodes: Map<string, { value: string | number, nextId: string | null }> }>({ headId: null, nodes: new Map() });


  useEffect(() => {
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) setAlgorithm(foundAlgorithm);
    else toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
  }, [toast]);

  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setCurrentNodes(currentS.nodes);
      setCurrentHeadId(currentS.headId ?? null);
      setCurrentAuxPointers(currentS.auxiliaryPointers || {});
      setCurrentMessage(currentS.message);
      setCurrentLine(currentS.currentLine);
    }
  }, [steps]);
  
  const handleOperationExecution = useCallback((op: LinkedListOperation, val?: string, list2Val?: string, pos?: number) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let numericValue: number | undefined = undefined;
    if (val && op !== 'init') { // 'init' takes the full string
        const parsedNum = parseInt(val, 10);
        if (isNaN(parsedNum)) {
            toast({ title: "Invalid Input", description: "Please enter a numeric value.", variant: "destructive" });
            return;
        }
        numericValue = parsedNum;
    }

    // Use initialListStr for 'init' operation, otherwise use the current list state (conceptually)
    const listToOperateOn = (op === 'init' || op === 'insertHead' && !listStateRef.current.headId) ? initialListStr : 
        steps[currentStepIndex]?.nodes.map(n => n.value).join(',') || initialListStr;


    const newSteps = generateSinglyLinkedListSteps(listToOperateOn, op, numericValue ?? val);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
      updateVisualStateFromStep(0);
       // Update listStateRef based on the outcome of the operation (simplified)
      const lastStep = newSteps[newSteps.length - 1];
      listStateRef.current.headId = lastStep.headId ?? null;
      const newNodesMap = new Map<string, { value: string | number, nextId: string | null }>();
      lastStep.nodes.forEach(node => newNodesMap.set(node.id, { value: node.value, nextId: node.nextId ?? null }));
      listStateRef.current.nodes = newNodesMap;

       if (lastStep.status === 'failure') {
        toast({ title: "Operation Failed", description: lastStep.message, variant: "destructive" });
      } else if (lastStep.status === 'success' || lastStep.message) {
        toast({ title: op, description: lastStep.message, variant: "default" });
      }

    } else {
      // Reset visuals if no steps (e.g., error in step generation)
      setCurrentNodes([]); setCurrentHeadId(null); setCurrentAuxPointers({}); setCurrentMessage("Error generating steps or empty operation."); setCurrentLine(null);
    }
  }, [initialListStr, steps, currentStepIndex, toast, updateVisualStateFromStep]);

  useEffect(() => { // Auto-initialize on load or when initial string changes
    if(selectedOperation === 'init') {
        handleOperationExecution('init', initialListStr);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialListStr, selectedOperation]); // Removed handleOperationExecution from deps to avoid loop with selectedOp change

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);
        updateVisualStateFromStep(nextStepIndex);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateVisualStateFromStep]);

  const handlePlay = () => {
    if (isFinished || steps.length === 0 || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Play", description: isFinished ? "Operation finished. Reset or choose new operation." : "No steps generated.", variant: "default" });
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
    updateVisualStateFromStep(nextStepIndex);
    if (nextStepIndex === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => {
    setIsPlaying(false); setIsFinished(false);
    setInitialListStr('1,2,3'); // Reset to default
    setInputValue('4');
    setSelectedOperation('init');
    // handleOperationExecution will be called by useEffect for 'init'
    // For other scenarios, you might need to explicitly call it:
    // if (selectedOperation !== 'init') handleOperationExecution('init', '1,2,3');
    // else setCurrentStepIndex(0); updateVisualStateFromStep(0); // if steps are already for init
    // Simpler:
    setSteps([]); setCurrentNodes([]); setCurrentHeadId(null); setCurrentAuxPointers({}); setCurrentMessage("Visualizer Reset. Initialize a list or select an operation."); setCurrentLine(null);
    listStateRef.current = { headId: null, nodes: new Map() };

  };
  const handleSpeedChange = (speed: number) => setAnimationSpeed(speed);
  
  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.description,
    timeComplexities: MOCK_ALGORITHMS.find(a => a.slug === ALGORITHM_SLUG)?.longDescription?.match(/Best Case: (O\(.+?\))/i)?.[1] ? {
        best: MOCK_ALGORITHMS.find(a => a.slug === ALGORITHM_SLUG)!.longDescription!.match(/Best Case: (O\(.+?\))/i)![1],
        average: MOCK_ALGORITHMS.find(a => a.slug === ALGORITHM_SLUG)!.longDescription!.match(/Average Case: (O\(.+?\))/i)![1],
        worst: MOCK_ALGORITHMS.find(a => a.slug === ALGORITHM_SLUG)!.longDescription!.match(/Worst Case: (O\(.+?\))/i)![1],
    } : { best: "O(1)/O(n)", average: "O(n)", worst: "O(n)" }, // Fallback if regex fails
    spaceComplexity: MOCK_ALGORITHMS.find(a => a.slug === ALGORITHM_SLUG)?.longDescription?.match(/Space Complexity: (O\(.+?\))/i)?.[1] || "O(n)",
  } : null;

  if (!algorithm || !algoDetails) {
    return (
      <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow container mx-auto p-4 flex justify-center items-center"><AlertTriangle className="w-16 h-16 text-destructive" /></main><Footer /></div>
    );
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
            <LinkedListVisualizationPanel nodes={currentNodes} headId={currentHeadId} auxiliaryPointers={currentAuxPointers} message={currentMessage} listType="singly" />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <SinglyLinkedListCodePanel currentLine={currentLine} currentOperation={selectedOperation} />
          </div>
        </div>
        <LinkedListControlsPanel
          onPlay={handlePlay} onPause={handlePause} onStep={handleStep} onReset={handleReset}
          onOperationChange={handleOperationExecution}
          initialListValue={initialListStr} onInitialListValueChange={setInitialListStr}
          inputValue={inputValue} onInputValueChange={setInputValue}
          selectedOperation={selectedOperation} onSelectedOperationChange={setSelectedOperation}
          availableOperations={SLL_AVAILABLE_OPS}
          isPlaying={isPlaying} isFinished={isFinished} currentSpeed={animationSpeed} onSpeedChange={handleSpeedChange}
          isAlgoImplemented={true} minSpeed={MIN_SPEED} maxSpeed={MAX_SPEED}
        />
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
