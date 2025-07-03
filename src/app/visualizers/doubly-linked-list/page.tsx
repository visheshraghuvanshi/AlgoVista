
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LinkedListVisualizationPanel } from './LinkedListVisualizationPanel'; // Local import
import { DoublyLinkedListCodePanel } from './DoublyLinkedListCodePanel'; 
import { LinkedListControlsPanel } from './LinkedListControlsPanel'; // Local import
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, AlgorithmDetailsProps, LinkedListAlgorithmStep, LinkedListNodeVisual, LinkedListOperation, ALL_OPERATIONS_LOCAL } from './types'; // Local import
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { generateDoublyLinkedListSteps } from './doubly-linked-list-logic';
import { algorithmMetadata } from './metadata'; 

const DEFAULT_ANIMATION_SPEED = 900;
const MIN_SPEED = 150;
const MAX_SPEED = 2200;

const DLL_AVAILABLE_OPS: LinkedListOperation[] = ['init', 'insertHead', 'insertTail', 'insertAtPosition', 'deleteByValue', 'deleteAtPosition'];

export default function DoublyLinkedListPage() {
  const { toast } = useToast();

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

    const newSteps = generateDoublyLinkedListSteps(listStringToUse, op, operationValueToUse, positionToUse);
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
  
  useEffect(() => { 
    listStringForLogicRef.current = initialListStr; 
    handleOperationExecution('init', initialListStr);
  }, [initialListStr, handleOperationExecution]); 

  // Effect to reset animation state when steps change
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(steps.length <= 1);
    if (steps.length > 0) {
      setCurrentStep(steps[0]);
    }
  }, [steps]);

  // Effect to update displayed step when index changes
  useEffect(() => {
    if (steps[currentStepIndex]) {
      setCurrentStep(steps[currentStepIndex]);
    }
  }, [currentStepIndex, steps]);

  // Main animation timer effect
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

  const handlePlay = () => { if (!isFinished && steps.length > 1) { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(false); const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => {
    setIsPlaying(false); setIsFinished(true); 
    const defaultInitial = '10,20,30';
    setInitialListStr(defaultInitial); 
    listStringForLogicRef.current = defaultInitial;
    setInputValue('5');
    setPositionValue('1');
    setSelectedOperation('init');
  };
  
  useEffect(() => { 
    handleReset(); 
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!algorithmMetadata) return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow container mx-auto p-4 flex justify-center items-center"><AlertTriangle /></main><Footer /></div>;
  const localAlgoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center"><h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary dark:text-accent">{algorithmMetadata.title}</h1></div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3"><LinkedListVisualizationPanel nodes={currentStep?.nodes || []} headId={currentStep?.headId} tailId={currentStep?.tailId} auxiliaryPointers={currentStep?.auxiliaryPointers} message={currentStep?.message} listType="doubly" /></div>
          <div className="lg:w-2/5 xl:w-1/3"><DoublyLinkedListCodePanel currentLine={currentStep?.currentLine ?? null} currentOperation={selectedOperation} /></div>
        </div>
        <LinkedListControlsPanel
          onPlay={handlePlay} onPause={handlePause} onStep={handleStep} onReset={handleReset}
          onOperationChange={(op, val, posOrSecondList) => {
             setSelectedOperation(op); 
             handleOperationExecution(op, val, posOrSecondList);
          }}
          initialListValue={initialListStr} onInitialListValueChange={setInitialListStr}
          inputValue={inputValue} onInputValueChange={setInputValue}
          positionValue={positionValue} onPositionValueChange={setPositionValue}
          selectedOperation={selectedOperation} onSelectedOperationChange={setSelectedOperation}
          availableOperations={DLL_AVAILABLE_OPS}
          isPlaying={isPlaying} isFinished={isFinished} currentSpeed={animationSpeed} onSpeedChange={setAnimationSpeed}
          isAlgoImplemented={true} minSpeed={MIN_SPEED} maxSpeed={MAX_SPEED}
        />
        <AlgorithmDetailsCard {...localAlgoDetails} />
      </main>
      <Footer />
    </div>
  );
}
