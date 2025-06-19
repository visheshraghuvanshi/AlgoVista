
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BinaryTreeVisualizationPanel } from './BinaryTreeVisualizationPanel'; // Local
import { BinaryTreeTraversalCodePanel } from './BinaryTreeTraversalCodePanel'; // Local
import { BinaryTreeControlsPanel } from './BinaryTreeControlsPanel'; // Local
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local
import type { BinaryTreeNodeVisual, BinaryTreeEdgeVisual, TreeAlgorithmStep, TraversalType, AlgorithmDetailsProps, AlgorithmMetadata } from './types'; // Local
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import {
  TRAVERSAL_TYPES,
  TRAVERSAL_LINE_MAPS,
  parseTreeInput,
  buildTreeNodesAndEdges,
  generateTraversalSteps,
} from './binary-tree-traversal-logic'; // Local
import { algorithmMetadata } from './metadata'; // Local import


const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

export default function BinaryTreeTraversalPage() {
  const { toast } = useToast();

  const [treeInputValue, setTreeInputValue] = useState('5,3,8,2,4,6,9,1,null,null,null,null,null,7');
  const [selectedTraversalType, setSelectedTraversalType] = useState<TraversalType>(TRAVERSAL_TYPES.INORDER);
  
  const [steps, setSteps] = useState<TreeAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentNodes, setCurrentNodes] = useState<BinaryTreeNodeVisual[]>([]);
  const [currentEdges, setCurrentEdges] = useState<TreeAlgorithmStep['edges']>([]);
  const [currentTraversalPath, setCurrentTraversalPath] = useState<(string | number)[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [currentProcessingNodeId, setCurrentProcessingNodeId] = useState<string|null>(null);


  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAlgoImplemented = true;

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setCurrentNodes(currentS.nodes);
      setCurrentEdges(currentS.edges);
      setCurrentTraversalPath(currentS.traversalPath);
      setCurrentLine(currentS.currentLine);
      setCurrentProcessingNodeId(currentS.currentProcessingNodeId ?? null);
    }
  }, [steps]);
  
  const generateAndSetSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    try {
      const parsedValues = parseTreeInput(treeInputValue);
      if (!parsedValues) {
        toast({ title: "Invalid Tree Input", description: "Tree input format is incorrect.", variant: "destructive" });
        setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentTraversalPath([]); setCurrentLine(null); setCurrentProcessingNodeId(null); setIsPlaying(false); setIsFinished(false);
        return;
      }
      
      const { nodes: initialNodes, edges: initialEdges, rootId } = buildTreeNodesAndEdges(parsedValues);
      
      if (initialNodes.length === 0 && treeInputValue.trim() !== "") {
          toast({ title: "Empty or Invalid Tree", description: "The provided input results in an empty tree.", variant: "default" });
      }
      
      const newSteps = generateTraversalSteps(initialNodes, initialEdges, rootId, selectedTraversalType);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsFinished(newSteps.length <= 1);

      if (newSteps.length > 0) {
        const firstStep = newSteps[0];
        setCurrentNodes(firstStep.nodes);
        setCurrentEdges(firstStep.edges);
        setCurrentTraversalPath(firstStep.traversalPath);
        setCurrentLine(firstStep.currentLine);
        setCurrentProcessingNodeId(firstStep.currentProcessingNodeId ?? null);
      } else {
        setCurrentNodes(initialNodes); 
        setCurrentEdges(initialEdges);
        setCurrentTraversalPath([]);
        setCurrentLine(null);
        setCurrentProcessingNodeId(null);
      }

    } catch (error: any) {
      toast({ title: "Error Processing Tree", description: error.message || "Could not process tree input.", variant: "destructive" });
      setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentTraversalPath([]); setCurrentLine(null);setCurrentProcessingNodeId(null); setIsPlaying(false); setIsFinished(false);
    }
  }, [treeInputValue, selectedTraversalType, toast, setCurrentNodes, setCurrentEdges, setCurrentTraversalPath, setCurrentLine, setCurrentProcessingNodeId, setSteps, setCurrentStepIndex, setIsPlaying, setIsFinished]);


  useEffect(() => {
    generateAndSetSteps();
  }, [generateAndSetSteps]); 

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);
        updateStateFromStep(nextStepIndex);
        if (nextStepIndex === steps.length - 1) {
          setIsPlaying(false);
          setIsFinished(true);
        }
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateStateFromStep]);

  const handleTreeInputChange = (value: string) => setTreeInputValue(value);
  const handleTraversalTypeChange = (type: TraversalType) => setSelectedTraversalType(type);

  const handlePlay = () => {
    if (isFinished || steps.length <= 1 || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Play", description: isFinished ? "Algorithm finished. Reset to play." : "No steps generated. Check input.", variant: "default" });
      setIsPlaying(false); return;
    }
    setIsPlaying(true); setIsFinished(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
  };

  const handleStep = () => {
    if (isFinished || steps.length <= 1 || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Step", description: isFinished ? "Algorithm finished. Reset to step." : "No steps generated.", variant: "default" });
      return;
    }
    setIsPlaying(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStepIndex(nextStepIndex);
      updateStateFromStep(nextStepIndex);
      if (nextStepIndex === steps.length - 1) setIsFinished(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false); setIsFinished(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    generateAndSetSteps();
  };

  const handleSpeedChange = (speedValue: number) => setAnimationSpeed(speedValue);
  
  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;


  if (!algorithmMetadata || !algoDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
          <p className="text-muted-foreground text-lg">Could not load data for &quot;{algorithmMetadata?.slug || 'Binary Tree Traversals'}&quot;.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <BinaryTreeVisualizationPanel
              nodes={currentNodes}
              edges={currentEdges}
              traversalPath={currentTraversalPath}
              currentProcessingNodeId={currentProcessingNodeId}
            />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <BinaryTreeTraversalCodePanel
              currentLine={currentLine}
              selectedTraversalType={selectedTraversalType}
            />
          </div>
        </div>
        <div className="w-full">
          <BinaryTreeControlsPanel
            onPlay={handlePlay}
            onPause={handlePause}
            onStep={handleStep}
            onReset={handleReset}
            onTreeInputChange={handleTreeInputChange}
            treeInputValue={treeInputValue}
            onTraversalTypeChange={handleTraversalTypeChange}
            selectedTraversalType={selectedTraversalType}
            isPlaying={isPlaying}
            isFinished={isFinished}
            currentSpeed={animationSpeed}
            onSpeedChange={handleSpeedChange}
            isAlgoImplemented={isAlgoImplemented}
            minSpeed={MIN_SPEED}
            maxSpeed={MAX_SPEED}
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}

