
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, NQueensStep } from './types'; // Local import
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, SquareAsterisk } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { NQueensVisualizationPanel } from './NQueensVisualizationPanel';
import { NQueensCodePanel, N_QUEENS_CODE_SNIPPETS } from './NQueensCodePanel'; // Import snippets
import { generateNQueensSteps, N_QUEENS_LINE_MAP } from './n-queens-logic'; 

const DEFAULT_ANIMATION_SPEED = 300; 
const MIN_SPEED = 20;
const MAX_SPEED = 1000;
const DEFAULT_N_VALUE = 4;
const MAX_N_VALUE = 8; 

export default function NQueensProblemVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [boardSizeN, setBoardSizeN] = useState(DEFAULT_N_VALUE);
  
  const [steps, setSteps] = useState<NQueensStep[]>([]);
  const [currentStep, setCurrentStep] = useState<NQueensStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [displayedSolutionIndex, setDisplayedSolutionIndex] = useState(0);

  useEffect(() => { setIsClient(true); }, []);

  const parseMazeInput = useCallback((input: string): number[][] | null => {
    // This function seems to be a leftover from RatInAMaze, N-Queens doesn't parse a maze input
    // It just needs N. For now, I'll keep it and assume it's unused or will be removed.
    // If it were used, it would need to be specific to N-Queens (e.g. parsing initial board if we allowed that).
    return []; // Placeholder
  }, []);

  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setCurrentStep(currentS);
      if (stepIndex === steps.length - 1 && currentS.foundSolutions && currentS.foundSolutions!.length > 0) {
        setDisplayedSolutionIndex(0); 
         setCurrentStep(prevStep => ({
            ...prevStep!,
            board: currentS.foundSolutions![0]
        }));
      }
    }
  }, [steps]); // Depends on steps
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    if (boardSizeN < 1 || boardSizeN > MAX_N_VALUE) {
      toast({ title: "Invalid Board Size", description: `N must be between 1 and ${MAX_N_VALUE} for visualization. N=${boardSizeN} can be very slow.`, variant: "destructive" });
      setSteps([]); setCurrentStep(null); setIsFinished(true);
      return;
    }
    if (boardSizeN > 6) {
        toast({ title: "Large N Warning", description: `N=${boardSizeN} may result in a very long animation. Consider N <= 6 for quicker visualization.`, variant: "default", duration: 5000});
    }

    const newSteps = generateNQueensSteps(boardSizeN);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    // Directly set the first step's state
    if (newSteps.length > 0) {
        setCurrentStep(newSteps[0]);
        const lastStep = newSteps[newSteps.length - 1];
        if (lastStep.foundSolutions && lastStep.foundSolutions.length > 0) {
            toast({title: "N-Queens Solution(s)", description: `Found ${lastStep.foundSolutions.length} solution(s). Last animation step will show one.`});
             setDisplayedSolutionIndex(0); // Reset solution index
             // Ensure the board displayed for the last step IS a solution board
            if (currentStepIndex === newSteps.length - 1) { // If it's the last step after generation
                setCurrentStep(prev => ({...prev!, board: lastStep.foundSolutions![0]}));
            }
        } else if (lastStep.message?.includes("No solutions")) {
            toast({title: "No Solution", description: "No solutions found for N=" + boardSizeN, variant: "default"});
        }
    } else {
        setCurrentStep(null);
    }
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    setDisplayedSolutionIndex(0);


  }, [boardSizeN, toast, setCurrentStep, setSteps, setCurrentStepIndex, setIsPlaying, setIsFinished, setDisplayedSolutionIndex]); // Added setCurrentStep, etc.
  
  useEffect(() => { handleGenerateSteps(); }, [boardSizeN, handleGenerateSteps]);

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
    setIsPlaying(false); setIsFinished(false); 
    setBoardSizeN(DEFAULT_N_VALUE); 
  };

  const showNextSolution = () => {
    if (currentStep && currentStep.foundSolutions && currentStep.foundSolutions.length > 0) {
        const nextSolIdx = (displayedSolutionIndex + 1) % currentStep.foundSolutions.length;
        setDisplayedSolutionIndex(nextSolIdx);
        setCurrentStep(prev => ({...prev!, board: currentStep.foundSolutions![nextSolIdx]}));
    }
  };
   const showPrevSolution = () => {
    if (currentStep && currentStep.foundSolutions && currentStep.foundSolutions.length > 0) {
        const prevSolIdx = (displayedSolutionIndex - 1 + currentStep.foundSolutions.length) % currentStep.foundSolutions.length;
        setDisplayedSolutionIndex(prevSolIdx);
        setCurrentStep(prev => ({...prev!, board: currentStep.foundSolutions![prevSolIdx]}));
    }
  };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <SquareAsterisk className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3 flex flex-col items-center">
            <NQueensVisualizationPanel step={currentStep} boardSize={boardSizeN} />
            {isFinished && currentStep?.foundSolutions && currentStep.foundSolutions.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                    <Button onClick={showPrevSolution} variant="outline" size="sm" disabled={currentStep.foundSolutions.length <= 1}>Prev Solution</Button>
                    <span>Solution {displayedSolutionIndex + 1} of {currentStep.foundSolutions.length}</span>
                    <Button onClick={showNextSolution} variant="outline" size="sm" disabled={currentStep.foundSolutions.length <= 1}>Next Solution</Button>
                </div>
            )}
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <NQueensCodePanel currentLine={currentStep?.currentLine ?? null} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls &amp; Setup</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="space-y-1">
                    <Label htmlFor="boardSizeNInput">Board Size (N x N, 1-{MAX_N_VALUE})</Label>
                    <Input 
                        id="boardSizeNInput" 
                        type="number" 
                        value={boardSizeN} 
                        onChange={(e) => setBoardSizeN(Math.min(MAX_N_VALUE, Math.max(1, parseInt(e.target.value) || 1)))} 
                        min="1" max={MAX_N_VALUE.toString()} 
                        disabled={isPlaying} />
                </div>
                 <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full md:w-auto self-end">Start / Reset Simulation</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4 border-t">
              <div className="flex gap-2">
                {!isPlaying ? <Button onClick={handlePlay} disabled={isFinished || steps.length <=1} size="lg"><Play className="mr-2"/>Play</Button> 
                             : <Button onClick={handlePause} size="lg"><Pause className="mr-2"/>Pause</Button>}
                <Button onClick={handleStep} variant="outline" disabled={isFinished || steps.length <=1} size="lg"><SkipForward className="mr-2"/>Step</Button>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
                <Label htmlFor="speedControl">Animation Speed</Label>
                <Slider id="speedControl" min={MIN_SPEED} max={MAX_SPEED} step={50} value={[animationSpeed]} onValueChange={(v) => setAnimationSpeed(v[0])} disabled={isPlaying} />
                <p className="text-xs text-muted-foreground text-center">{animationSpeed} ms delay</p>
              </div>
            </div>
             {isFinished && currentStep?.solutionFound && (
                <p className="text-center text-lg font-semibold text-green-500">Sudoku Solved!</p>
            )}
            {isFinished && !currentStep?.solutionFound && currentStep?.message?.includes("No solution") && (
                <p className="text-center text-lg font-semibold text-red-500">No Solution Exists.</p>
            )}
          </CardContent>
        </Card>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}

