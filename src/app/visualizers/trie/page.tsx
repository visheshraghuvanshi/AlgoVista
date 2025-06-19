"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, TrieStep, TrieNodeInternal } from './types'; // Local import
import { algorithmMetadata } from './metadata'; // Local import
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, SpellCheck, PlusCircle, SearchIcon, CaseSensitive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from "@/components/ui/slider";
import { TrieVisualizationPanel } from './TrieVisualizationPanel';
import { TrieCodePanel } from './TrieCodePanel';
import { generateTrieSteps, createInitialTrie, TRIE_LINE_MAP } from './trie-logic';
import type { TrieOperationType } from './types'; // Local import

const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 1500;

export default function TrieVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [wordInput, setWordInput] = useState("apple");
  const [selectedOperation, setSelectedOperation] = useState<TrieOperationType>('insert');
  
  const [steps, setSteps] = useState<TrieStep[]>([]);
  const [currentStep, setCurrentStep] = useState<TrieStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const trieRef = useRef<{ rootId: string; nodesMap: Map<string, TrieNodeInternal> }>(createInitialTrie());
  const [insertedWords, setInsertedWords] = useState<string[]>([]);


  useEffect(() => { 
    setIsClient(true); 
    const initialTrieState = createInitialTrie();
    trieRef.current = initialTrieState;
    const initStep = generateTrieSteps(initialTrieState, 'init', '')[0];
    setCurrentStep(initStep);
    setSteps([initStep]);
  }, []);

  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) setCurrentStep(steps[stepIndex]);
  }, [steps, setCurrentStep]);
  
  const handleExecuteOperation = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const word = wordInput.trim().toLowerCase(); 
     if (!/^[a-z]*$/.test(word) && word !== "") {
        toast({title: "Invalid Input", description: "Please enter words containing only lowercase English letters.", variant: "destructive"});
        setSteps([]);setCurrentStep(null);setIsFinished(true);
        return;
    }
    if (!word && selectedOperation !== 'init') {
        toast({title: "Input Needed", description: "Please enter a word for the operation.", variant: "destructive"});
        setSteps([]);setCurrentStep(null);setIsFinished(true);
        return;
    }
    if (word.length > 15) {
      toast({title: "Word Too Long", description: "Max 15 chars for better visualization.", variant: "default"});
    }

    const newSteps = generateTrieSteps(trieRef.current, selectedOperation as 'insert'|'search'|'startsWith', word);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);

    if (newSteps.length > 0) {
        const firstStep = newSteps[0];
        setCurrentStep(firstStep);
        if (newSteps[newSteps.length - 1].nodes && selectedOperation === 'insert') {
            if (!insertedWords.includes(word) && word) { // Add word only if it's not empty
               setInsertedWords(prev => [...prev, word].sort());
            }
        }
        const lastStep = newSteps[newSteps.length-1];
        if (lastStep.operation === 'search' && lastStep.found !== undefined) {
            toast({title: "Search Result", description: `Word "${lastStep.currentWord}" ${lastStep.found ? 'found.' : 'not found.'}`});
        } else if (lastStep.operation === 'startsWith' && lastStep.found !== undefined) {
            toast({title: "StartsWith Result", description: `Prefix "${lastStep.currentWord}" ${lastStep.found ? 'exists.' : 'does not exist.'}`});
        } else if (lastStep.operation === 'insert' && lastStep.message?.includes("complete")) {
            toast({title: "Insert Complete", description: `Word "${word}" inserted.`});
        }

    } else {
        const currentTrieVisuals = generateTrieSteps(trieRef.current, 'init', '')[0];
        setCurrentStep(currentTrieVisuals);
    }
  },[wordInput, selectedOperation, toast, setSteps, setCurrentStep, setCurrentStepIndex, setIsPlaying, setIsFinished, insertedWords, setInsertedWords]);

  useEffect(() => {
    if (selectedOperation === 'init') { // Only re-run handleExecuteOperation for 'init' via op change
        handleExecuteOperation();
    }
  }, [selectedOperation, handleExecuteOperation]);

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
    setIsPlaying(false); setIsFinished(true);
    trieRef.current = createInitialTrie();
    setInsertedWords([]);
    setWordInput("apple");
    setSelectedOperation('insert');
    const initStep = generateTrieSteps(trieRef.current, 'init', '')[0];
    setCurrentStep(initStep);
    setSteps([initStep]);
  };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <SpellCheck className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <TrieVisualizationPanel step={currentStep ? {...currentStep, auxiliaryData: {...currentStep.auxiliaryData, insertedWords: insertedWords}} : null} />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <TrieCodePanel currentLine={currentStep?.currentLine ?? null} selectedOperation={selectedOperation} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1">
                <Label htmlFor="trieOperationSelect">Operation</Label>
                <Select value={selectedOperation} onValueChange={v => setSelectedOperation(v as TrieOperationType)} disabled={isPlaying}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insert">Insert Word</SelectItem>
                    <SelectItem value="search">Search Word</SelectItem>
                    <SelectItem value="startsWith">Starts With Prefix</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="wordInputTrie">Word / Prefix (lowercase, max 15 chars)</Label>
                <Input id="wordInputTrie" value={wordInput} onChange={e => setWordInput(e.target.value.toLowerCase())} maxLength={15} disabled={isPlaying} />
              </div>
               <Button onClick={handleExecuteOperation} disabled={isPlaying} className="w-full md:w-auto self-end">
                {selectedOperation === 'insert' ? <PlusCircle /> : selectedOperation === 'search' ? <SearchIcon /> : <CaseSensitive />}
                Execute {selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)}
              </Button>
            </div>
            
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Trie & Controls</Button>
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

