
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LinkedListVisualizationPanel } from '@/components/algo-vista/LinkedListVisualizationPanel';
import { CircularLinkedListCodePanel } from './CircularLinkedListCodePanel'; 
import { LinkedListControlsPanel, type LinkedListOperation, ALL_OPERATIONS } from '@/components/algo-vista/LinkedListControlsPanel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, LinkedListAlgorithmStep, LinkedListNodeVisual } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { CIRCULAR_LL_LINE_MAPS, generateCircularLinkedListSteps } from './circular-linked-list-logic';

const ALGORITHM_SLUG = 'circular-linked-list';
const DEFAULT_ANIMATION_SPEED = 900;
const MIN_SPEED = 150;
const MAX_SPEED = 2200;

const CLL_AVAILABLE_OPS: LinkedListOperation[] = ['init', 'insertHead', 'traverse'];


export default function CircularLinkedListPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);

  const [initialListStr, setInitialListStr] = useState('10,20,30');
  const [inputValue, setInputValue] = useState('5');
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
  
  // For CLL, actual list structure is mainly for step generation. Visualization relies on panel props.
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
  
  const handleOperationExecution = useCallback((op: LinkedListOperation, val?: string) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    let numericValue: number | undefined = undefined;
    if (val && op !== 'init') {
        const parsedNum = parseInt(val, 10);
        if (isNaN(parsedNum)) { toast({ title: "Invalid Input", description: "Value must be numeric.", variant: "destructive" }); return; }
        numericValue = parsedNum;
    }
    const listToOperateOn = (op === 'init' || (op === 'insertHead' && !listStateRef.current.headId)) ? initialListStr : 
        steps[currentStepIndex]?.nodes.map(n => n.value).join(',') || initialListStr;

    const newSteps = generateCircularLinkedListSteps(listToOperateOn, op, numericValue ?? val);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
      updateVisualStateFromStep(0);
      const lastStep = newSteps[newSteps.length - 1];
      listStateRef.current.headId = lastStep.headId ?? null;
      const newNodesMap = new Map();
      lastStep.nodes.forEach(node => newNodesMap.set(node.id, { value: node.value, nextId: node.nextId ?? null }));
      listStateRef.current.nodes = newNodesMap;
      if (lastStep.status === 'failure') toast({ title: "Operation Failed", description: lastStep.message, variant: "destructive" });
      else if (lastStep.message) toast({ title: op, description: lastStep.message });
    } else {
      setCurrentNodes([]); setCurrentHeadId(null); setCurrentMessage("Error or no steps.");
    }
  }, [initialListStr, steps, currentStepIndex, toast, updateVisualStateFromStep]);
  
  useEffect(() => { 
    if(selectedOperation === 'init') handleOperationExecution('init', initialListStr);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialListStr, selectedOperation]);

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

  const handlePlay = () => { if (!isFinished && steps.length > 1) { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(false); const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateVisualStateFromStep(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => {
    setIsPlaying(false); setIsFinished(false); setInitialListStr('10,20,30'); setInputValue('5'); setSelectedOperation('init');
    setSteps([]); setCurrentNodes([]); setCurrentHeadId(null); setCurrentMessage("Visualizer Reset."); setCurrentLine(null);
    listStateRef.current = { headId: null, nodes: new Map() };
  };
  
  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.description,
    timeComplexities: MOCK_ALGORITHMS.find(a=>a.slug===ALGORITHM_SLUG)?.longDescription?.match(/Best Case: (O\(.+?\))/i)?.[1] ? {
        best: MOCK_ALGORITHMS.find(a=>a.slug===ALGORITHM_SLUG)!.longDescription!.match(/Best Case: (O\(.+?\))/i)![1],
        average: MOCK_ALGORITHMS.find(a=>a.slug===ALGORITHM_SLUG)!.longDescription!.match(/Average Case: (O\(.+?\))/i)![1],
        worst: MOCK_ALGORITHMS.find(a=>a.slug===ALGORITHM_SLUG)!.longDescription!.match(/Worst Case: (O\(.+?\))/i)![1],
    } : { best: "O(1)/O(n)", average: "O(n)", worst: "O(n)"},
    spaceComplexity: MOCK_ALGORITHMS.find(a=>a.slug===ALGORITHM_SLUG)?.longDescription?.match(/Space Complexity: (O\(.+?\))/i)?.[1] || "O(n)",
  } : null;

  if (!algorithm || !algoDetails) return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle className="w-16 h-16 text-destructive" /></main><Footer /></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center"><h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary dark:text-accent">{algorithm.title}</h1></div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3"><LinkedListVisualizationPanel nodes={currentNodes} headId={currentHeadId} auxiliaryPointers={currentAuxPointers} message={currentMessage} listType="circular" /></div>
          <div className="lg:w-2/5 xl:w-1/3"><CircularLinkedListCodePanel currentLine={currentLine} currentOperation={selectedOperation} /></div>
        </div>
        <LinkedListControlsPanel
          onPlay={handlePlay} onPause={handlePause} onStep={handleStep} onReset={handleReset}
          onOperationChange={handleOperationExecution}
          initialListValue={initialListStr} onInitialListValueChange={setInitialListStr}
          inputValue={inputValue} onInputValueChange={setInputValue}
          selectedOperation={selectedOperation} onSelectedOperationChange={setSelectedOperation}
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
