
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LinkedListVisualizationPanel } from '@/components/algo-vista/LinkedListVisualizationPanel';
import { SinglyLinkedListCodePanel } from './SinglyLinkedListCodePanel'; 
import { LinkedListControlsPanel, type LinkedListOperation, ALL_OPERATIONS } from '@/components/algo-vista/LinkedListControlsPanel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, LinkedListAlgorithmStep, LinkedListNodeVisual } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { SINGLY_LL_LINE_MAPS, generateSinglyLinkedListSteps } from './singly-linked-list-logic';
import { algorithmMetadata } from './metadata';

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

const SLL_AVAILABLE_OPS: LinkedListOperation[] = ['init', 'insertHead', 'insertTail', 'deleteByValue', 'search', 'traverse'];

export default function SinglyLinkedListPage() {
  const { toast } = useToast();

  const [initialListStr, setInitialListStr] = useState('10,20,30');
  const [inputValue, setInputValue] = useState('5'); 
  const [selectedOperation, setSelectedOperation] = useState<LinkedListOperation>('init');
  
  const [steps, setSteps] = useState<LinkedListAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [currentNodes, setCurrentNodes] = useState<LinkedListNodeVisual[]>([]);
  const [currentHeadId, setCurrentHeadId] = useState<string | null>(null);
  const [currentAuxPointers, setCurrentAuxPointers] = useState<Record<string, string | null>>({});
  const [currentMessage, setCurrentMessage] = useState<string | undefined>("");
  const [currentLine, setCurrentLine] = useState<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true); // Start as finished until an operation generates steps
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const listStringForLogicRef = useRef<string>(initialListStr);


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
  
  const handleOperationExecution = useCallback((op: LinkedListOperation, val?: string) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let operationValueToUse: string | number | undefined = val;
    if (val && !isNaN(Number(val))) {
        operationValueToUse = Number(val);
    }
    if (val === undefined && (op === 'insertHead' || op === 'insertTail' || op === 'deleteByValue' || op === 'search')) {
        toast({ title: "Input Required", description: `Please enter a value for ${op}.`, variant: "destructive" });
        return;
    }

    // For init or if the list is empty for insertHead, use initialListStr
    // Otherwise, use the current state of the list derived from currentNodes for subsequent operations
    let listStringToUse = listStringForLogicRef.current;
    if (op === 'init') {
        listStringToUse = initialListStr;
    }


    const newSteps = generateSinglyLinkedListSteps(listStringToUse, op, operationValueToUse);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
      updateVisualStateFromStep(0);
      const lastStep = newSteps[newSteps.length - 1];
      // Update the ref with the string representation of the list after the operation
      listStringForLogicRef.current = lastStep.nodes.map(n => n.value).join(',');

       if (lastStep.status === 'failure') {
        toast({ title: "Operation Failed", description: lastStep.message, variant: "destructive" });
      } else if (lastStep.status === 'success' || (lastStep.message && op !== 'init')) { // Don't toast for init message
        toast({ title: op.charAt(0).toUpperCase() + op.slice(1), description: lastStep.message });
      }
    } else {
      setCurrentNodes([]); setCurrentHeadId(null); setCurrentAuxPointers({}); setCurrentMessage("Error or no steps generated."); setCurrentLine(null);
    }
  }, [toast, updateVisualStateFromStep, initialListStr]);

  // Initial setup of the list or when initialListStr changes for 'init'
  useEffect(() => { 
    listStringForLogicRef.current = initialListStr; // Update ref when input string changes
    if (selectedOperation === 'init') {
      handleOperationExecution('init', initialListStr);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialListStr]); // Only depends on initialListStr for 'init' case


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
    if (isFinished || steps.length <= 1) {
      toast({ title: "Cannot Play", description: isFinished ? "Operation finished." : "No steps to play.", variant: "default" });
      setIsPlaying(false); return;
    }
    setIsPlaying(true); setIsFinished(false);
  };
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) {
       toast({ title: "Cannot Step", description: "Already at the end or no steps.", variant: "default" });
      return;
    }
    setIsPlaying(false);
    const nextStepIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextStepIndex);
    updateVisualStateFromStep(nextStepIndex);
    if (nextStepIndex === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => {
    setIsPlaying(false); setIsFinished(true); // True because reset shows initial state
    const defaultInitial = '10,20,30';
    setInitialListStr(defaultInitial); 
    listStringForLogicRef.current = defaultInitial;
    setInputValue('5');
    setSelectedOperation('init');
    const initSteps = generateSinglyLinkedListSteps(defaultInitial, 'init');
    setSteps(initSteps);
    setCurrentStepIndex(0);
    if (initSteps.length > 0) updateVisualStateFromStep(0); else setCurrentNodes([]);
    setCurrentMessage("Visualizer Reset. List initialized with default values."); 
    setCurrentLine(null);
  };
  
  useEffect(() => { // Effect to handle initial display when component mounts or `initialListStr` changes
    handleReset(); // Call reset to set up initial state
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (!algorithmMetadata) {
    return (
      <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow container mx-auto p-4 flex justify-center items-center"><AlertTriangle className="w-16 h-16 text-destructive" /></main><Footer /></div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{algorithmMetadata.description}</p>
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
          onOperationChange={(op, val) => {
             setSelectedOperation(op); // Set the operation type for code panel and logic
             handleOperationExecution(op, val);
          }}
          initialListValue={initialListStr} onInitialListValueChange={setInitialListStr}
          inputValue={inputValue} onInputValueChange={setInputValue}
          selectedOperation={selectedOperation} onSelectedOperationChange={(op) => {
              setSelectedOperation(op);
              // Optionally, trigger an 'init' or clear steps if op changes to one not needing immediate execution
              if (op === 'init') handleOperationExecution('init', initialListStr);
              else if (op === 'traverse') handleOperationExecution('traverse'); // Auto-execute traverse
              else { 
                  setSteps([]); // Clear steps for other ops until "Execute"
                  setCurrentStepIndex(0);
                  updateVisualStateFromStep(0); // Update visual to current list from ref
                  setIsFinished(true);
              }
          }}
          availableOperations={SLL_AVAILABLE_OPS}
          isPlaying={isPlaying} isFinished={isFinished} currentSpeed={animationSpeed} onSpeedChange={setAnimationSpeed}
          isAlgoImplemented={true} minSpeed={MIN_SPEED} maxSpeed={MAX_SPEED}
        />
        <AlgorithmDetailsCard 
            title={algorithmMetadata.title}
            description={algorithmMetadata.longDescription || algorithmMetadata.description}
            timeComplexities={algorithmMetadata.timeComplexities!}
            spaceComplexity={algorithmMetadata.spaceComplexity!}
        />
      </main>
      <Footer />
    </div>
  );
}

