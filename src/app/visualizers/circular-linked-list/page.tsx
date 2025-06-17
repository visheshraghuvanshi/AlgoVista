
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LinkedListVisualizationPanel } from '@/components/algo-vista/LinkedListVisualizationPanel';
import { CircularLinkedListCodePanel } from './CircularLinkedListCodePanel'; 
import { LinkedListControlsPanel, type LinkedListOperation } from '@/components/algo-vista/LinkedListControlsPanel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, LinkedListAlgorithmStep, LinkedListNodeVisual } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { CIRCULAR_LL_LINE_MAPS, generateCircularLinkedListSteps } from './circular-linked-list-logic';
import { algorithmMetadata } from './metadata'; 

const DEFAULT_ANIMATION_SPEED = 900;
const MIN_SPEED = 150;
const MAX_SPEED = 2200;

const CLL_AVAILABLE_OPS: LinkedListOperation[] = ['init', 'insertHead', 'insertAtPosition', 'deleteAtPosition', 'traverse'];


export default function CircularLinkedListPage() {
  const { toast } = useToast();

  const [initialListStr, setInitialListStr] = useState('10,20,30');
  const [inputValue, setInputValue] = useState('5');
  const [positionValue, setPositionValue] = useState('1');
  const [selectedOperation, setSelectedOperation] = useState<LinkedListOperation>('init');
  
  const [steps, setSteps] = useState<LinkedListAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [currentNodes, setCurrentNodes] = useState<LinkedListNodeVisual[]>([]);
  const [currentHeadId, setCurrentHeadId] = useState<string | null>(null);
  const [currentAuxPointers, setCurrentAuxPointers] = useState<Record<string, string | null>>({});
  const [currentMessage, setCurrentMessage] = useState<string | undefined>("");
  const [currentLine, setCurrentLine] = useState<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
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

    const currentOpDetails = CLL_AVAILABLE_OPS.find(details => details === op); // Simplified check
    if ((op === 'insertHead' || op === 'insertAtPosition') && operationValueToUse === undefined) {
        toast({ title: "Input Required", description: `Please enter a value for ${op}.`, variant: "destructive" });
        return;
    }
    if ((op === 'insertAtPosition' || op === 'deleteAtPosition') && positionToUse === undefined) {
        toast({ title: "Position Required", description: `Please enter a position for ${op}.`, variant: "destructive" });
        return;
    }

    let listStringToUse = listStringForLogicRef.current;
    if (op === 'init') {
        listStringToUse = initialListStr;
    }

    const newSteps = generateCircularLinkedListSteps(listStringToUse, op, operationValueToUse, positionToUse);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
      updateVisualStateFromStep(0);
      const lastStep = newSteps[newSteps.length - 1];
      listStringForLogicRef.current = lastStep.nodes.map(n => n.value).join(',');

       if (lastStep.status === 'failure') {
        toast({ title: "Operation Failed", description: lastStep.message, variant: "destructive" });
      } else if (lastStep.status === 'success' || (lastStep.message && op !== 'init')) {
        toast({ title: op.charAt(0).toUpperCase() + op.slice(1), description: lastStep.message });
      }
    } else {
      setCurrentNodes([]); setCurrentHeadId(null); setCurrentAuxPointers({}); setCurrentMessage("Error or no steps generated."); setCurrentLine(null);
    }
  }, [toast, updateVisualStateFromStep, initialListStr]);

  useEffect(() => { 
    listStringForLogicRef.current = initialListStr;
    if (selectedOperation === 'init') {
      handleOperationExecution('init', initialListStr);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialListStr]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateVisualStateFromStep(nextIdx);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false); setIsFinished(true);
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
    setIsPlaying(false); setIsFinished(true);
    const defaultInitial = '10,20,30';
    setInitialListStr(defaultInitial); 
    listStringForLogicRef.current = defaultInitial;
    setInputValue('5');
    setPositionValue('1');
    setSelectedOperation('init');
    const initSteps = generateCircularLinkedListSteps(defaultInitial, 'init');
    setSteps(initSteps);
    setCurrentStepIndex(0);
    if (initSteps.length > 0) updateVisualStateFromStep(0); else setCurrentNodes([]);
    setCurrentMessage("Visualizer Reset. List initialized with default values."); 
    setCurrentLine(null);
  };
  
  useEffect(() => { 
    handleReset(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!algorithmMetadata) return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle className="w-16 h-16 text-destructive" /></main><Footer /></div>;
  
  const algoDetails: AlgorithmDetailsProps = {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center"><h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary dark:text-accent">{algorithmMetadata.title}</h1></div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3"><LinkedListVisualizationPanel nodes={currentNodes} headId={currentHeadId} auxiliaryPointers={currentAuxPointers} message={currentMessage} listType="circular" /></div>
          <div className="lg:w-2/5 xl:w-1/3"><CircularLinkedListCodePanel currentLine={currentLine} currentOperation={selectedOperation} /></div>
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
          selectedOperation={selectedOperation} onSelectedOperationChange={(op) => {
              setSelectedOperation(op);
              if (op === 'init') handleOperationExecution('init', initialListStr);
              else if (op === 'traverse') handleOperationExecution('traverse');
              else { 
                  setSteps([]); 
                  setCurrentStepIndex(0);
                  updateVisualStateFromStep(0); 
                  setIsFinished(true);
              }
          }}
          availableOperations={CLL_AVAILABLE_OPS}
          isPlaying={isPlaying} isFinished={isFinished} currentSpeed={animationSpeed} onSpeedChange={setAnimationSpeed}
          isAlgoImplemented={true} minSpeed={MIN_SPEED} maxSpeed={MAX_SPEED}
        />
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}

