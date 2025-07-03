
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LinkedListVisualizationPanel } from './LinkedListVisualizationPanel';
import { SinglyLinkedListCodePanel } from './SinglyLinkedListCodePanel'; 
import { LinkedListControlsPanel } from './LinkedListControlsPanel';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard';
import type { LinkedListAlgorithmStep, LinkedListNodeVisual, AlgorithmMetadata, AlgorithmDetailsProps, LinkedListOperation } from './types';
import { ALL_OPERATIONS_LOCAL } from './types';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { generateSinglyLinkedListSteps } from './singly-linked-list-logic';
import { algorithmMetadata } from './metadata';

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;
const SLL_AVAILABLE_OPS: LinkedListOperation[] = ['init', 'insertHead', 'insertTail', 'insertAtPosition', 'deleteByValue', 'deleteAtPosition', 'search', 'traverse'];

export default function SinglyLinkedListPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [initialListStr, setInitialListStr] = useState('10,20,30');
  const [inputValue, setInputValue] = useState('5'); 
  const [positionValue, setPositionValue] = useState('1');
  const [selectedOperation, setSelectedOperation] = useState<LinkedListOperation>('init');
  
  const [steps, setSteps] = useState<LinkedListAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [currentStep, setCurrentStep] = useState<LinkedListAlgorithmStep | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true); 
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const listStringForLogicRef = useRef<string>(initialListStr);
  
  useEffect(() => { setIsClient(true); }, []);

  const handleOperationExecution = useCallback((op: LinkedListOperation, val?: string, posOrSecondList?: string | number) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let operationValueToUse: string | number | undefined = val;
    if (val && !isNaN(Number(val))) {
        operationValueToUse = Number(val);
    }
    
    let positionToUse: number | undefined = undefined;
    if (typeof posOrSecondList === 'number') {
        positionToUse = posOrSecondList;
    } else if (typeof posOrSecondList === 'string' && !isNaN(Number(posOrSecondList))) {
        positionToUse = Number(posOrSecondList);
    }

    const currentOpDetails = ALL_OPERATIONS_LOCAL.find(details => details.value === op);
    if (currentOpDetails?.needsValue && (operationValueToUse === undefined || String(operationValueToUse).trim() === '')) {
        toast({ title: "Input Required", description: `Please enter a value for ${op}.`, variant: "destructive" });
        return;
    }
    if (currentOpDetails?.needsPosition && (positionToUse === undefined || String(positionToUse).trim() === '')) {
        toast({ title: "Position Required", description: `Please enter a position for ${op}.`, variant: "destructive" });
        return;
    }

    let listStringToUse = listStringForLogicRef.current;
    if (op === 'init') {
        listStringToUse = initialListStr;
    }

    const newSteps = generateSinglyLinkedListSteps(listStringToUse, op, operationValueToUse, positionToUse);
    setSteps(newSteps);

    if (newSteps.length > 0) {
      const lastStep = newSteps[newSteps.length - 1];
      listStringForLogicRef.current = lastStep.nodes.map(n => n.value).join(',');

       if (lastStep.status === 'failure') {
        toast({ title: "Operation Failed", description: lastStep.message, variant: "destructive" });
      } else if (lastStep.status === 'success' || (lastStep.message && op !== 'init')) { 
        toast({ title: op.charAt(0).toUpperCase() + op.slice(1), description: lastStep.message });
      }
    } else {
      setCurrentStep(null);
    }
  }, [toast, initialListStr]);
  
  const resetToInitialState = useCallback(() => {
    handleOperationExecution('init', initialListStr);
  }, [initialListStr, handleOperationExecution]);

  useEffect(() => { 
    listStringForLogicRef.current = initialListStr;
    resetToInitialState();
  }, [initialListStr, resetToInitialState]);
  
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(steps.length <= 1);
    if (steps.length > 0) {
      setCurrentStep(steps[0]);
    }
  }, [steps]);

  useEffect(() => {
    if (steps[currentStepIndex]) {
      setCurrentStep(steps[currentStepIndex]);
    }
  }, [currentStepIndex, steps]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        setCurrentStepIndex(prevIndex => prevIndex + 1);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps.length, animationSpeed]);

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
    if (nextStepIndex === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => {
    setIsPlaying(false);
    setIsFinished(true); 
    const defaultInitial = '10,20,30';
    setInitialListStr(defaultInitial); 
    listStringForLogicRef.current = defaultInitial;
    setInputValue('5');
    setPositionValue('1');
    setSelectedOperation('init');
  };
  
  useEffect(() => { 
    handleReset(); 
  }, []); 

  if (!algorithmMetadata) {
    return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow container mx-auto p-4 flex justify-center items-center"><AlertTriangle className="w-16 h-16 text-destructive" /></main><Footer /></div>;
  }
  const localAlgoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center"><h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary dark:text-accent">{algorithmMetadata.title}</h1><p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{algorithmMetadata.description}</p></div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3"><LinkedListVisualizationPanel nodes={currentStep?.nodes || []} headId={currentStep?.headId ?? null} auxiliaryPointers={currentStep?.auxiliaryPointers} message={currentStep?.message} listType="singly" /></div>
          <div className="lg:w-2/5 xl:w-1/3"><SinglyLinkedListCodePanel currentLine={currentStep?.currentLine ?? null} currentOperation={selectedOperation} /></div>
        </div>
        <LinkedListControlsPanel
          steps={steps}
          onPlay={handlePlay} onPause={handlePause} onStep={handleStep} onReset={handleReset}
          onOperationChange={(op, val, posOrSecondList) => { handleOperationExecution(op, val, posOrSecondList); }}
          initialListValue={initialListStr} onInitialListValueChange={setInitialListStr}
          inputValue={inputValue} onInputValueChange={setInputValue}
          positionValue={positionValue} onPositionValueChange={setPositionValue}
          selectedOperation={selectedOperation} onSelectedOperationChange={(op) => {
              setSelectedOperation(op);
              if (op === 'init') handleOperationExecution('init', initialListStr);
              else if (op === 'traverse') handleOperationExecution('traverse'); 
              else { setSteps([]); setIsFinished(true); }
          }}
          availableOperations={SLL_AVAILABLE_OPS}
          isPlaying={isPlaying} isFinished={isFinished} currentSpeed={animationSpeed} onSpeedChange={setAnimationSpeed}
          isAlgoImplemented={true} minSpeed={MIN_SPEED} maxSpeed={MAX_SPEED}
        />
        <AlgorithmDetailsCard {...localAlgoDetails} />
      </main>
      <Footer />
    </div>
  );
}

