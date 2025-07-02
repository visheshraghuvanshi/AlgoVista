
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard';
import type { AlgorithmMetadata, SudokuStep } from './types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { SudokuVisualizationPanel } from './SudokuVisualizationPanel';
import { SudokuCodePanel } from './SudokuCodePanel';
import { generateSudokuSteps } from './sudoku-solver-logic';

const DEFAULT_ANIMATION_SPEED = 100;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;
const DEFAULT_SUDOKU_PUZZLE = 
`5,3,0,0,7,0,0,0,0
6,0,0,1,9,5,0,0,0
0,9,8,0,0,0,0,6,0
8,0,0,0,6,0,0,0,3
4,0,0,8,0,3,0,0,1
7,0,0,0,2,0,0,0,6
0,6,0,0,0,0,2,8,0
0,0,0,4,1,9,0,0,5
0,0,0,0,8,0,0,7,9`;

export default function SudokuSolverVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [sudokuInput, setSudokuInput] = useState(DEFAULT_SUDOKU_PUZZLE);
  
  const [steps, setSteps] = useState<SudokuStep[]>([]);
  const [currentStep, setCurrentStep] = useState<SudokuStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  const parseSudokuInput = useCallback((input: string): number[][] | null => {
    try {
      const rows = input.trim().split('\n').map(rowStr => 
        rowStr.split(',').map(cellStr => {
          const val = parseInt(cellStr.trim(), 10);
          if (isNaN(val) || val < 0 || val > 9) {
            throw new Error("Invalid cell value. Must be 0-9.");
          }
          return val;
        })
      );
      if (rows.length !== 9 || rows.some(row => row.length !== 9)) {
        toast({ title: "Invalid Board", description: "Sudoku board must be 9x9.", variant: "destructive"});
        return null;
      }
      return rows;
    } catch (e: any) {
      toast({ title: "Invalid Board Format", description: e.message || "Use numbers 0-9, comma-separated, with each row on a new line.", variant: "destructive"});
      return null;
    }
  }, [toast]);

  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      setCurrentStep(steps[stepIndex]);
    }
  }, [steps]); 
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const boardArray = parseSudokuInput(sudokuInput);
    if (!boardArray) {
      setSteps([]); setCurrentStep(null); setIsFinished(true); return;
    }

    const newSteps = generateSudokuSteps(boardArray);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    
    if (newSteps.length > 0) {
        setCurrentStep(newSteps[0]);
        const lastStep = newSteps[newSteps.length - 1];
        if (lastStep.solutionFound) {
            toast({title: "Sudoku Solved!", description: "A solution has been found."});
        } else if (lastStep.message?.includes("No solution")) {
            toast({title: "No Solution", description: "This Sudoku puzzle has no solution.", variant: "default"});
        }
    } else {
        setCurrentStep(null);
    }
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

  }, [sudokuInput, parseSudokuInput, toast]);
  
  useEffect(() => { handleGenerateSteps(); }, [sudokuInput, handleGenerateSteps]);

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
  const handleReset = () => { setIsPlaying(false); setIsFinished(true); setSudokuInput(DEFAULT_SUDOKU_PUZZLE); };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <BrainCircuit className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3 flex flex-col items-center">
            <SudokuVisualizationPanel step={currentStep} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <SudokuCodePanel currentLine={currentStep?.currentLine ?? null} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Puzzle Input</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"> 
              <div className="space-y-1">
                <Label htmlFor="sudokuPuzzleInput">Sudoku Puzzle (9x9, 0 for empty cells)</Label>
                <Textarea 
                    id="sudokuPuzzleInput" 
                    value={sudokuInput} 
                    onChange={e => setSudokuInput(e.target.value)} 
                    disabled={isPlaying}
                    rows={9}
                    className="font-mono text-sm !leading-tight tracking-wider"
                    placeholder={"Enter comma-separated numbers, new line for each row.\nExample:\n5,3,0,...\n6,0,0,...\n..."} 
                />
              </div>
              <div className="flex flex-col justify-end h-full pt-6"> 
                 <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full mt-auto">Solve / Reset Steps</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset to Default Puzzle</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
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
