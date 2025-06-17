
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BinaryTreeVisualizationPanel } from './BinaryTreeVisualizationPanel';
import { BinaryTreeTraversalCodePanel } from './BinaryTreeTraversalCodePanel';
import { BinaryTreeControlsPanel } from './BinaryTreeControlsPanel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, BinaryTreeNodeVisual, BinaryTreeEdgeVisual, TreeAlgorithmStep } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import {
  TRAVERSAL_TYPES,
  TRAVERSAL_LINE_MAPS,
  parseTreeInput,
  buildTreeNodesAndEdges,
  generateTraversalSteps,
  type TraversalType,
} from './binary-tree-traversal-logic';

const TRAVERSAL_CODE_SNIPPETS: Record<TraversalType, string[]> = {
  [TRAVERSAL_TYPES.INORDER]: [
    "function inorder(node) {",
    "  if (node === null) return;",
    "  inorder(node.left);",
    "  visit(node);",
    "  inorder(node.right);",
    "}",
  ],
  [TRAVERSAL_TYPES.PREORDER]: [
    "function preorder(node) {",
    "  if (node === null) return;",
    "  visit(node);",
    "  preorder(node.left);",
    "  preorder(node.right);",
    "}",
  ],
  [TRAVERSAL_TYPES.POSTORDER]: [
    "function postorder(node) {",
    "  if (node === null) return;",
    "  postorder(node.left);",
    "  postorder(node.right);",
    "  visit(node);",
    "}",
  ],
};

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;
const ALGORITHM_SLUG = 'binary-tree-traversal';

export default function BinaryTreeTraversalPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);

  const [treeInputValue, setTreeInputValue] = useState('5,3,8,2,4,6,9,1,null,null,null,null,null,7');
  const [selectedTraversalType, setSelectedTraversalType] = useState<TraversalType>(TRAVERSAL_TYPES.INORDER);
  
  const [steps, setSteps] = useState<TreeAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentNodes, setCurrentNodes] = useState<BinaryTreeNodeVisual[]>([]);
  const [currentEdges, setCurrentEdges] = useState<BinaryTreeEdgeVisual[]>([]);
  const [currentTraversalPath, setCurrentTraversalPath] = useState<(string | number)[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [currentProcessingNodeId, setCurrentProcessingNodeId] = useState<string|null>(null);


  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAlgoImplemented = true;

  useEffect(() => {
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) setAlgorithm(foundAlgorithm);
    else {
      toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
    }
  }, [toast]);

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
      setIsFinished(false);

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
  }, [treeInputValue, selectedTraversalType, toast]);


  useEffect(() => {
    generateAndSetSteps();
  }, [treeInputValue, selectedTraversalType, toast, generateAndSetSteps]); 

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
    if (isFinished || steps.length === 0 || currentStepIndex >= steps.length - 1) {
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
    if (isFinished || steps.length === 0 || currentStepIndex >= steps.length - 1) {
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
  
  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.longDescription || algorithm.description,
    timeComplexities: { best: "O(n)", average: "O(n)", worst: "O(n)" }, // n is number of nodes
    spaceComplexity: "O(h) for recursive stack (h=height), O(n) in worst case (skewed tree). Iterative can be O(w) where w is max width for BFS-like or O(h) for stack-based DFS-like.",
  } : null;


  if (!algorithm || !algoDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
          <p className="text-muted-foreground text-lg">Could not load data for &quot;{ALGORITHM_SLUG}&quot;.</p>
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
            {algorithm.title}
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
              codeSnippets={TRAVERSAL_CODE_SNIPPETS}
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

