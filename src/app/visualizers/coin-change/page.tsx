
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, DPAlgorithmStep } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CoinChangeVisualizationPanel } from './CoinChangeVisualizationPanel';
import { CoinChangeCodePanel } from './CoinChangeCodePanel';
import { generateCoinChangeSteps } from './coin-change-logic';
import type { CoinChangeProblemType } from './coin-change-logic';

const DEFAULT_ANIMATION_SPEED = 400;
const MIN_SPEED = 50;
const MAX_SPEED = 1500;
const DEFAULT_COINS_INPUT = "1,2,5";
const DEFAULT_AMOUNT_INPUT = "11";

export default function CoinChangeVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [coinsInput, setCoinsInput] = useState(DEFAULT_COINS_INPUT);
  const [amountInput, setAmountInput] = useState(DEFAULT_AMOUNT_INPUT);
  const [problemType, setProblemType] = useState<CoinChangeProblemType>('minCoins');
  
  const [steps, setSteps] = useState<DPAlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<DPAlgorithmStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  const parseCoinsInput = useCallback((input: string): number[] | null => {
    try {
      const coins = input.split(',').map(cStr => parseInt(cStr.trim(), 10));
      if (coins.some(isNaN) || coins.some(c => c <= 0)) {
        throw new Error("Coins must be positive integers.");
      }
      if (coins.length === 0 && input.trim() !== "") throw new Error("No valid coins provided.");
      return coins.sort((a,b) => a - b); // Sort for consistent processing order
    } catch (e: any) {
      toast({ title: "Invalid Coins Format", description: e.message || "Use comma-separated positive integers.", variant: "destructive" });
      return null;
    }
  }, [toast]);

  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) setCurrentStep(steps[stepIndex]);
  }, [steps]);
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const coins = parseCoinsInput(coinsInput);
    const amount = parseInt(amountInput, 10);

    if (!coins || isNaN(amount) || amount < 0) {
      if (!coins) {} // parseCoinsInput already toasting
      else toast({ title: "Invalid Amount", description: "Amount must be a non-negative integer.", variant: "destructive" });
      setSteps([]); setCurrentStep(null); setIsFinished(true);
      return;
    }
    if (coins.length > 15 || amount > 100) { // Limits for visualization performance
        toast({title:"Input too large", description: "Max 15 coins and amount 100 for smooth viz.", variant:"default"});
    }

    const newSteps = generateCoinChangeSteps(coins, amount, problemType);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setCurrentStep(newSteps[0] || null);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

  }, [coinsInput, amountInput, problemType, parseCoinsInput, toast, updateStateFromStep]);
  
  useEffect(() => { handleGenerateSteps(); }, [handleGenerateSteps]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateStateFromStep(nextIdx);
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false); setIsFinished(true);
    }
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateStateFromStep]);

  const handlePlay = () => { if (!isFinished && steps.length > 1) { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(false); const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateStateFromStep(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => { 
    setIsPlaying(false); setIsFinished(false); 
    setCoinsInput(DEFAULT_COINS_INPUT);
    setAmountInput(DEFAULT_AMOUNT_INPUT);
    setProblemType('minCoins');
    // handleGenerateSteps will be called by useEffect on input changes
  };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Coins className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <CoinChangeVisualizationPanel step={currentStep} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <CoinChangeCodePanel currentLine={currentStep?.currentLine ?? null} selectedProblem={problemType} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Problem Setup</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1">
                <Label htmlFor="coinsInputCC">Coin Denominations (comma-sep)</Label>
                <Input id="coinsInputCC" value={coinsInput} onChange={e => setCoinsInput(e.target.value)} disabled={isPlaying} placeholder="e.g., 1,2,5"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="amountInputCC">Target Amount</Label>
                <Input id="amountInputCC" type="number" value={amountInput} onChange={e => setAmountInput(e.target.value)} disabled={isPlaying} placeholder="e.g., 11"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="problemTypeSelectCC">Problem Type</Label>
                <Select value={problemType} onValueChange={v => setProblemType(v as CoinChangeProblemType)} disabled={isPlaying}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minCoins">Minimum Coins</SelectItem>
                    <SelectItem value="numWays">Number of Ways</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full md:w-auto">Solve</Button>
            
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Inputs & Simulation</Button>
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
          </CardContent>
        </Card>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}

    