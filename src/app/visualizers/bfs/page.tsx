"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { GraphVisualizationPanel } from '@/components/algo-vista/GraphVisualizationPanel';
import { BfsCodePanel, BFS_CODE_SNIPPETS_ALL_LANG } from './BfsCodePanel'; 
import { GraphControlsPanel } from '@/components/algo-vista/GraphControlsPanel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard'; // Ensure this path is correct
import type { GraphNode, GraphEdge, GraphAlgorithmStep } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';
import { BFS_LINE_MAP, generateBfsSteps, parseGraphInput } from './bfs-logic';
import { algorithmMetadata } from './metadata'; 

const DEFAULT_ANIMATION_SPEED = 800;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

export default function BfsVisualizerPage() {
  const { toast } = useToast();

  const [graphInputValue, setGraphInputValue] = useState('0:1,2;1:0,3;2:0,4;3:1;4:2'); 
  const [startNodeValue, setStartNodeValue] = useState('0');
  
  const [steps, setSteps] = useState<GraphAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentNodes, setCurrentNodes] = useState<GraphNode[]>([]);
  const [currentEdges, setCurrentEdges] = useState<GraphEdge[]>([]);
  const [currentAuxiliaryData, setCurrentAuxiliaryData] = useState<GraphAlgorithmStep['auxiliaryData']>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);

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
    }
  }, [steps]);
  
  const generateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const parsedData = parseGraphInput(graphInputValue);
    if (!parsedData) {
      toast({ title: "Invalid Graph Input", description: "Graph format is incorrect. Use 'node:neighbor1,neighbor2;...'", variant: "destructive" });
      setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
      return;
    }
    if(parsedData.nodes.length === 0 && graphInputValue.trim() !== ""){
        toast({ title: "Invalid Graph Input", description: "Graph appears to be malformed or empty despite input.", variant: "destructive" });
        setSteps([]); setCurrentNodes([]); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
        return;
    }


    if (startNodeValue.trim() === '') {
      toast({ title: "Missing Start Node", description: "Please enter a start node ID.", variant: "destructive" });
       setSteps([]); setCurrentNodes(parseGraphInput(graphInputValue)?.nodes.map(n => ({...n, x:0,y:0,color:'gray'})) || []); setCurrentEdges([]); setCurrentAuxiliaryData([]); setCurrentLine(null); setIsPlaying(false); setIsFinished(false);
      return;
    }

    const newSteps = generateBfsSteps(parsedData, startNodeValue);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1); // Finished if only one step (e.g. error message)

    if (newSteps.length > 0) {
      updateStateFromStep(0);
       if (newSteps[0].message && (newSteps[0].message.includes("not found") || newSteps[0].message.includes("empty")) ){
           toast({ title: "Graph Error", description: newSteps[0].message, variant: "destructive" });
      }
    } else {
      setCurrentNodes(parsedData.nodes.map(n=>({...n, x:0, y:0, color:'grey'}))); 
      setCurrentEdges([]);
      setCurrentAuxiliaryData([]);
      setCurrentLine(null);
    }
  }, [graphInputValue, startNodeValue, toast, updateStateFromStep]);


  useEffect(() => {
    generateSteps();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphInputValue, startNodeValue]); 

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

  const handleGraphInputChange = (value: string) => setGraphInputValue(value);
  const handleStartNodeChange = (value: string) => setStartNodeValue(value);

  const handlePlay = () => {
    if (isFinished || steps.length <= 1 || currentStepIndex >= steps.length - 1) {
      toast({ title: "Cannot Play", description: isFinished ? "Algorithm finished. Reset to play." : "No steps generated or already at end. Check input.", variant: "default" });
      setIsPlaying(false); return;
    }
    setIsPlaying(true); setIsFinished(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
  };

  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) { // Check currentStepIndex to prevent overshooting
      toast({ title: "Cannot Step", description: isFinished ? "Algorithm finished. Reset to step." : "No steps generated or already at end.", variant: "default" });
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
    generateSteps();
  };

  const handleSpeedChange = (speedValue: number) => setAnimationSpeed(speedValue);

  if (!algorithmMetadata) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
          <p className="text-muted-foreground text-lg">Could not load data for BFS.</p>
        </main>
        <Footer />
      </div>
    );
  }

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
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {steps[currentStepIndex]?.message || algorithmMetadata.description}
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
            <BfsCodePanel
              codeSnippets={BFS_CODE_SNIPPETS_ALL_LANG}
              currentLine={currentLine}
              defaultLanguage="JavaScript"
            />
          </div>
        </div>
        <div className="w-full">
          <GraphControlsPanel
            onPlay={handlePlay}
            onPause={handlePause}
            onStep={handleStep}
            onReset={handleReset}
            onGraphInputChange={handleGraphInputChange}
            graphInputValue={graphInputValue}
            onStartNodeChange={handleStartNodeChange}
            startNodeValue={startNodeValue}
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
