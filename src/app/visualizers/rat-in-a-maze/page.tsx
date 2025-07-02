
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, RatInAMazeStep } from './types'; // Corrected import
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, Mouse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { RatInAMazeVisualizationPanel } from './RatInAMazeVisualizationPanel';
import { RatInAMazeCodePanel } from './RatInAMazeCodePanel';
import { generateRatInAMazeSteps } from './rat-in-a-maze-logic'; 

const DEFAULT_ANIMATION_SPEED = 200; 
const MIN_SPEED = 20;
const MAX_SPEED = 1000;
const DEFAULT_MAZE_INPUT = 
`1,0,1,1,1
1,1,1,0,1
0,0,0,1,1
1,1,1,1,0
1,0,0,1,1`; 

const MAX_MAZE_DIM = 15; 

export default function RatInAMazeVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [mazeInput, setMazeInput] = useState(DEFAULT_MAZE_INPUT);
  
  const [steps, setSteps] = useState<RatInAMazeStep[]>([]);
  const [currentStep, setCurrentStep] = useState<RatInAMazeStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [solutionToDisplay, setSolutionToDisplay] = useState<{board: number[][], path: string} | null>(null);
  const [solutionDisplayIndex, setSolutionDisplayIndex] = useState(0);


  useEffect(() => { setIsClient(true); }, []);

  const parseMazeInput = useCallback((input: string): number[][] | null => {
    try {
      const rows = input.trim().split('\n').map(rowStr => 
        rowStr.split(',').map(cellStr => {
          const val = parseInt(cellStr.trim(), 10);
          if (isNaN(val) || (val !== 0 && val !== 1)) {
            throw new Error("Invalid cell value. Must be 0 or 1.");
          }
          return val;
        })
      );
      if (rows.length === 0 || rows[0].length === 0) {
        toast({ title: "Invalid Maze", description: "Maze cannot be empty.", variant: "destructive"});
        return null;
      }
      const M = rows[0].length;
      if (rows.some(row => row.length !== M)) {
        toast({ title: "Invalid Maze", description: "All rows must have the same number of columns.", variant: "destructive"});
        return null;
      }
      if (rows.length > MAX_MAZE_DIM || M > MAX_MAZE_DIM) {
        toast({ title: "Maze Too Large", description: `Max dimensions are ${MAX_MAZE_DIM}x${MAX_MAZE_DIM}.`, variant: "destructive"});
        return null;
      }
      if (rows[0][0] === 0) {
        toast({ title: "Invalid Start", description: "Source (0,0) must be an open path (1).", variant: "destructive"});
        return null;
      }
      if (rows[rows.length-1][M-1] === 0) {
        toast({ title: "Invalid Destination", description: `Destination (${rows.length-1},${M-1}) must be an open path (1).`, variant: "destructive"});
        return null;
      }
      return rows;
    } catch (e: any) {
      toast({ title: "Invalid Board Format", description: e.message || "Use 0s and 1s, comma-separated, rows on new lines.", variant: "destructive"});
      return null;
    }
  }, [toast]);

  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setCurrentStep(currentS);
    }
  }, [steps]); 
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const boardArray = parseMazeInput(mazeInput);
    if (!boardArray) {
      setSteps([]); setCurrentStep(null); setIsFinished(true); return;
    }

    const newSteps = generateRatInAMazeSteps(boardArray);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setSolutionToDisplay(null);
    setSolutionDisplayIndex(0);
    
    if (newSteps.length > 0) {
        setCurrentStep(newSteps[0]);
        const lastStep = newSteps[newSteps.length - 1];
        if (lastStep.foundSolutions && lastStep.foundSolutions.length > 0) {
            toast({title: "Path(s) Found!", description: `Found ${lastStep.foundSolutions.length} solution(s).`});
        } else if (lastStep.message?.includes("No solution")) {
            toast({title: "No Solution", description: "The rat could not find a path.", variant: "default"});
        }
    } else {
        setCurrentStep(null);
    }
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

  }, [mazeInput, parseMazeInput, toast]);
  
  useEffect(() => { handleGenerateSteps(); }, [mazeInput, handleGenerateSteps]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateVisualStateFromStep(nextIdx);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      setIsFinished(true);
      const finalStep = steps[steps.length - 1];
      if (finalStep && finalStep.foundSolutions && finalStep.foundSolutions.length > 0) {
        const board = parseMazeInput(mazeInput)!;
        let r=0, c=0;
        const solutionBoard = board.map(row=>[...row]);
        solutionBoard[0][0] = 2; // Mark start
        for(const move of finalStep.foundSolutions[0]){
            if(move==='D') r++; if(move==='U') r--; if(move==='R') c++; if(move==='L') c--;
            if(r>=0 && c>=0 && r<board.length && c < board[0].length) solutionBoard[r][c] = 2;
        }
        setSolutionToDisplay({board: solutionBoard, path: finalStep.foundSolutions[0]});
      }
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateVisualStateFromStep, mazeInput, parseMazeInput]);

  const handlePlay = () => { if (!isFinished && steps.length > 1) { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(false); const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateVisualStateFromStep(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => { setIsPlaying(false); setIsFinished(false); setMazeInput(DEFAULT_MAZE_INPUT); };
  
  const displaySolution = (index: number) => {
    if (!currentStep?.foundSolutions || currentStep.foundSolutions.length === 0) return;
    const board = parseMazeInput(mazeInput)!;
    const path = currentStep.foundSolutions[index];
    let r=0, c=0;
    const solutionBoard = board.map(row=>[...row]);
    solutionBoard[0][0] = 2;
    for(const move of path){
        if(move==='D') r++; if(move==='U') r--; if(move==='R') c++; if(move==='L') c--;
        if(r>=0 && c>=0 && r<board.length && c < board[0].length) solutionBoard[r][c] = 2;
    }
    setSolutionToDisplay({board: solutionBoard, path});
    setSolutionDisplayIndex(index);
  }

  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Mouse className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3 flex flex-col items-center">
            <RatInAMazeVisualizationPanel step={solutionToDisplay ? {...currentStep!, maze: solutionToDisplay.board, message: `Showing Solution ${solutionDisplayIndex+1}: ${solutionToDisplay.path}` } : currentStep} />
            {isFinished && currentStep?.foundSolutions && currentStep.foundSolutions.length > 1 && (
                <div className="flex items-center gap-2 mt-2">
                    <Button onClick={() => displaySolution((solutionDisplayIndex - 1 + currentStep.foundSolutions!.length) % currentStep.foundSolutions!.length)} variant="outline" size="sm">Prev Solution</Button>
                    <span>Solution {solutionDisplayIndex + 1} of {currentStep.foundSolutions.length}</span>
                    <Button onClick={() => displaySolution((solutionDisplayIndex + 1) % currentStep.foundSolutions!.length)} variant="outline" size="sm">Next Solution</Button>
                </div>
            )}
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <RatInAMazeCodePanel currentLine={currentStep?.currentLine ?? null} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls &amp; Maze Setup</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"> 
              <div className="space-y-1">
                <Label htmlFor="mazeConfigInput">Maze Configuration (0=wall, 1=path, max ${MAX_MAZE_DIM}x${MAX_MAZE_DIM})</Label>
                <Textarea 
                    id="mazeConfigInput" 
                    value={mazeInput} 
                    onChange={e => setMazeInput(e.target.value)} 
                    disabled={isPlaying}
                    rows={5}
                    className="font-mono text-sm !leading-tight tracking-wider"
                    placeholder={"Enter comma-separated numbers, new line for each row.\nExample:\n1,0,1\n1,1,1\n0,0,1"} 
                />
              </div>
              <div className="flex flex-col justify-end h-full pt-6"> 
                 <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full mt-auto">Solve / Reset Steps</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset to Default Maze</Button>
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
             {isFinished && currentStep?.foundSolutions && currentStep.foundSolutions.length > 0 && (
                <p className="text-center text-lg font-semibold text-green-500">Found {currentStep.foundSolutions.length} Solution(s)!</p>
            )}
            {isFinished && (!currentStep?.foundSolutions || currentStep.foundSolutions.length === 0) && currentStep?.message?.includes("No solution") && (
                <p className="text-center text-lg font-semibold text-red-500">No Solution Path Found.</p>
            )}
          </CardContent>
        </Card>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
