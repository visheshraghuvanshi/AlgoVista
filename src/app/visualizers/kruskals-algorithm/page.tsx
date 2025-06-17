
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, GraphNode, GraphEdge, GraphAlgorithmStep } from '@/types';
import { algorithmMetadata } from './metadata';
import { GraphControlsPanel } from '@/components/algo-vista/GraphControlsPanel';
import { GraphVisualizationPanel } from '@/components/algo-vista/GraphVisualizationPanel';
import { KruskalsAlgorithmCodePanel } from './KruskalsAlgorithmCodePanel';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Workflow } from 'lucide-react'; // Using Workflow for MST
import { generateKruskalsSteps, parseKruskalInput } from './kruskals-algorithm-logic';

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;
const DEFAULT_NUM_VERTICES = "5";
const DEFAULT_EDGE_LIST = "0-1(2);0-3(6);1-2(3);1-3(8);1-4(5);2-4(7);3-4(9)"; // Example for 5 vertices

export default function KruskalsVisualizerPage() {
  const { toast } = useToast();
  
  const [numVerticesInput, setNumVerticesInput] = useState(DEFAULT_NUM_VERTICES);
  const [edgeListInputValue, setEdgeListInputValue] = useState(DEFAULT_EDGE_LIST);
  
  const [steps, setSteps] = useState<GraphAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentNodes, setCurrentNodes] = useState<GraphNode[]>([]);
  const [currentEdges, setCurrentEdges] = useState<GraphEdge[]>([]);
  const [currentAuxiliaryData, setCurrentAuxiliaryData] = useState<GraphAlgorithmStep['auxiliaryData']>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [currentMessage, setCurrentMessage] = useState<string | undefined>(algorithmMetadata.description);

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
      setCurrentAuxiliaryData(currentS.auxiliaryData || []);
      setCurrentLine(currentS.currentLine);
      setCurrentMessage(currentS.message);
    }
  }, [steps]);
  
  const generateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const parsedData = parseKruskalInput(numVerticesInput, edgeListInputValue);
    if (!parsedData) {
      toast({ title: "Invalid Graph Input", description: "Format: u-v(weight);... Check num vertices and edge indices.", variant: "destructive" });
      setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
      return;
    }
    if (parsedData.numVertices === 0 && edgeListInputValue.trim() !== "") {
        toast({ title: "Invalid Input", description: "Number of vertices must be > 0 if edges are provided.", variant: "destructive" });
        return;
    }


    const newSteps = generateKruskalsSteps(parsedData.numVertices, parsedData.edges, parsedData.initialNodes);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
      updateStateFromStep(0);
    } else {
      setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null);
    }
  }, [numVerticesInput, edgeListInputValue, toast, updateStateFromStep]);


  useEffect(() => {
    generateSteps();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numVerticesInput, edgeListInputValue]); // Re-generate if graph input changes

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

  const handleNumVerticesChange = (value: string) => setNumVerticesInput(value);
  const handleEdgeListInputChange = (value: string) => setEdgeListInputValue(value);

  const handlePlay = () => {
    if (isFinished || steps.length <= 1 || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Play", description: isFinished ? "Algorithm finished. Reset to play." : "No steps. Generate first.", variant: "default" });
      setIsPlaying(false); return;
    }
    setIsPlaying(true); setIsFinished(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
  };

  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Step", description: isFinished ? "Algorithm finished." : "No steps.", variant: "default" });
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
    setNumVerticesInput(DEFAULT_NUM_VERTICES);
    setEdgeListInputValue(DEFAULT_EDGE_LIST);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    // generateSteps will be called by useEffect due to input changes
  };

  const handleSpeedChange = (speedValue: number) => setAnimationSpeed(speedValue);

  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!algoDetails) { 
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
          <p className="text-muted-foreground text-lg">Could not load data for Kruskal's Algorithm.</p>
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
          <Workflow className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentMessage}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <GraphVisualizationPanel
              nodes={currentNodes}
              edges={currentEdges}
              auxiliaryData={currentAuxiliaryData}
            />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <KruskalsAlgorithmCodePanel
              currentLine={currentLine}
            />
          </div>
        </div>
        <div className="w-full">
          <GraphControlsPanel
            onPlay={handlePlay}
            onPause={handlePause}
            onStep={handleStep}
            onReset={handleReset}
            onGraphInputChange={handleEdgeListInputChange}
            graphInputValue={edgeListInputValue}
            showStartNodeInput={false} // Not needed for Kruskal's
            onNumVerticesChange={handleNumVerticesChange}
            numVerticesValue={numVerticesInput}
            showNumVerticesInput={true}
            isPlaying={isPlaying}
            isFinished={isFinished}
            currentSpeed={animationSpeed}
            onSpeedChange={handleSpeedChange}
            isAlgoImplemented={isAlgoImplemented}
            minSpeed={MIN_SPEED}
            maxSpeed={MAX_SPEED}
            graphInputPlaceholder="Edges: 0-1(wt);1-2(wt);..."
            onExecute={generateSteps} // Add execute button for Kruskal's
            executeButtonText="Find MST"
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}

