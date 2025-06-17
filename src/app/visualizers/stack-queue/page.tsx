
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { Construction, Code2, Layers, AlignStartHorizontal, Play, Pause, SkipForward, RotateCcw, FastForward, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { STACK_QUEUE_CODE_SNIPPETS } from './StackQueueCodeSnippets'; // Adjusted import
import { StackQueueVisualizationPanel } from './StackQueueVisualizationPanel';
import { generateStackSteps, generateQueueSteps, type StackQueueAlgorithmStep, STACK_LINE_MAP } from './stack-queue-logic'; // Assuming Queue logic will be added later

const DEFAULT_ANIMATION_SPEED = 600;
const MIN_SPEED = 100;
const MAX_SPEED = 1500;

type StructureType = 'stack' | 'queue';
type StackOperation = 'push' | 'pop' | 'peek';
type QueueOperation = 'enqueue' | 'dequeue' | 'front';

export default function StackQueueVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [selectedStructure, setSelectedStructure] = useState<StructureType>('stack');
  const [selectedStackOp, setSelectedStackOp] = useState<StackOperation>('push');
  const [selectedQueueOp, setSelectedQueueOp] = useState<QueueOperation>('enqueue');
  
  const [initialValuesInput, setInitialValuesInput] = useState("10,20,30");
  const [operationValueInput, setOperationValueInput] = useState("40");

  const [steps, setSteps] = useState<StackQueueAlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<StackQueueAlgorithmStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Refs to store the actual data structure state
  const stackDataRef = useRef<(string | number)[]>([]);
  const queueDataRef = useRef<(string | number)[]>([]);

  useEffect(() => {
    setIsClient(true);
    // Initial build of stack based on default input
    const initialParsed = parseValues(initialValuesInput);
    stackDataRef.current = initialParsed;
    queueDataRef.current = initialParsed; // Also init queue data for potential switch
    setCurrentStep({
        array: [...initialParsed],
        activeIndices: [], swappingIndices: [], sortedIndices: [],
        currentLine: null, message: "Stack initialized with input values.",
        topIndex: initialParsed.length > 0 ? initialParsed.length - 1 : -1,
        operationType: 'stack'
    });
    setSteps([]); // Clear steps, as this is an initial state, not an operation
    setIsFinished(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parseValues = (input: string): (string|number)[] => {
    if (input.trim() === '') return [];
    return input.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => isNaN(Number(s)) ? s : Number(s));
  };

  const handleInitialValuesChange = (value: string) => {
    setInitialValuesInput(value);
    const parsed = parseValues(value);
    if (selectedStructure === 'stack') {
      stackDataRef.current = parsed;
      setCurrentStep({ array: [...parsed], topIndex: parsed.length > 0 ? parsed.length - 1 : -1, operationType: 'stack', currentLine: null, message: "Stack re-initialized.", activeIndices: [], swappingIndices:[], sortedIndices:[] });
    } else {
      queueDataRef.current = parsed;
       setCurrentStep({ array: [...parsed], frontIndex: 0, rearIndex: parsed.length -1, operationType: 'queue', currentLine: null, message: "Queue re-initialized (Conceptual).", activeIndices: [], swappingIndices:[], sortedIndices:[] });
    }
    setSteps([]);
    setIsFinished(true);
  };
  
  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      setCurrentStep(steps[stepIndex]);
    }
  }, [steps]);

  const handleExecuteOperation = () => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    let newSteps: StackQueueAlgorithmStep[] = [];
    let opValue: string | number | undefined = operationValueInput.trim();
    if (opValue && !isNaN(Number(opValue))) opValue = Number(opValue);
    if (opValue?.toString().trim() === "" && (selectedStackOp === 'push' || selectedQueueOp === 'enqueue')) {
        toast({title: "Input Needed", description: "Please provide a value to push/enqueue.", variant: "destructive"});
        return;
    }


    if (selectedStructure === 'stack') {
      newSteps = generateStackSteps([...stackDataRef.current], selectedStackOp, opValue);
      if (newSteps.length > 0) {
          const finalStackState = newSteps[newSteps.length-1].array;
          stackDataRef.current = [...finalStackState]; // Update ref with final state
      }
    } else { // Queue
      // Placeholder for Queue logic until it's interactively implemented
      newSteps = generateQueueSteps([...queueDataRef.current], selectedQueueOp, opValue);
      toast({ title: "Queue Operations", description: "Interactive queue visualization is under construction. Showing conceptual state.", variant: "default" });
       if (newSteps.length > 0) {
          const finalQueueState = newSteps[newSteps.length-1].array; // Assume similar structure
          queueDataRef.current = [...finalQueueState];
      }
    }
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    if (newSteps.length > 0) updateStateFromStep(0);
  };

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

  const handlePlay = () => { if (!isFinished && steps.length > 1) { setIsPlaying(true); setIsFinished(false); }};
  const handlePause = () => setIsPlaying(false);
  const handleStep = () => {
    if (isFinished || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(false);
    const nextIdx = currentStepIndex + 1; setCurrentStepIndex(nextIdx); updateStateFromStep(nextIdx);
    if (nextIdx === steps.length - 1) setIsFinished(true);
  };
  const handleReset = () => {
    setIsPlaying(false); setIsFinished(true);
    const defaultInitial = "10,20,30";
    setInitialValuesInput(defaultInitial);
    const parsedDefault = parseValues(defaultInitial);
    stackDataRef.current = parsedDefault;
    queueDataRef.current = parsedDefault;
    if(selectedStructure === 'stack') {
        setCurrentStep({ array: [...parsedDefault], topIndex: parsedDefault.length > 0 ? parsedDefault.length - 1 : -1, operationType: 'stack', currentLine: null, message: "Stack reset to default.", activeIndices:[],swappingIndices:[],sortedIndices:[] });
    } else {
        setCurrentStep({ array: [...parsedDefault], frontIndex: 0, rearIndex: parsedDefault.length-1, operationType: 'queue', currentLine: null, message: "Queue reset to default (Conceptual).", activeIndices:[],swappingIndices:[],sortedIndices:[] });
    }
    setSteps([]);
    setOperationValueInput("40");
  };

  const algoDetails: AlgorithmDetailsProps = {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  };

  if (!isClient) { 
    return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Layers className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
             Interactive Stack operations. Queue operations are conceptual for now.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-2/5 xl:w-1/3">
            <StackQueueVisualizationPanel step={currentStep} structureType={selectedStructure} />
          </div>
          <div className="lg:w-3/5 xl:w-2/3">
             <StackQueueCodeSnippets currentLine={currentStep?.currentLine ?? null} structureType={selectedStructure}/>
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Operations</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1">
                <Label htmlFor="initialValues">Initial Values (comma-sep)</Label>
                <Input id="initialValues" value={initialValuesInput} onChange={(e) => handleInitialValuesChange(e.target.value)} disabled={isPlaying}/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="structureType">Structure Type</Label>
                <Select value={selectedStructure} onValueChange={(val) => {
                    setSelectedStructure(val as StructureType);
                    const currentData = val === 'stack' ? stackDataRef.current : queueDataRef.current;
                    setCurrentStep({
                        array: [...currentData], 
                        topIndex: val === 'stack' ? (currentData.length > 0 ? currentData.length - 1 : -1) : undefined,
                        frontIndex: val === 'queue' ? (currentData.length > 0 ? 0 : -1) : undefined,
                        rearIndex: val === 'queue' ? (currentData.length > 0 ? currentData.length -1 : -1) : undefined,
                        operationType: val as StructureType,
                        currentLine: null, 
                        message: `${val.charAt(0).toUpperCase() + val.slice(1)} view selected. Data: [${currentData.join(', ')}]`,
                        activeIndices:[], swappingIndices:[], sortedIndices:[]
                    });
                    setSteps([]); setIsFinished(true);
                }} disabled={isPlaying}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stack">Stack</SelectItem>
                    <SelectItem value="queue">Queue (Conceptual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedStructure === 'stack' && (
                <div className="space-y-1">
                  <Label htmlFor="stackOp">Stack Operation</Label>
                  <Select value={selectedStackOp} onValueChange={(val) => setSelectedStackOp(val as StackOperation)} disabled={isPlaying}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">Push</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="peek">Peek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedStructure === 'queue' && (
                <div className="space-y-1">
                  <Label htmlFor="queueOp">Queue Operation (Conceptual)</Label>
                  <Select value={selectedQueueOp} onValueChange={(val) => setSelectedQueueOp(val as QueueOperation)} disabled={isPlaying || true}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enqueue">Enqueue</SelectItem>
                      <SelectItem value="dequeue">Dequeue</SelectItem>
                      <SelectItem value="front">Front</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            {(selectedStructure === 'stack' && selectedStackOp === 'push') && (
              <div className="space-y-1 max-w-xs">
                <Label htmlFor="opValue">Value to Push</Label>
                <Input id="opValue" value={operationValueInput} onChange={(e) => setOperationValueInput(e.target.value)} disabled={isPlaying} />
              </div>
            )}
             {/* Placeholder for queue value input if needed later
             (selectedStructure === 'queue' && selectedQueueOp === 'enqueue') && ( ... )
             */}
            <Button onClick={handleExecuteOperation} disabled={isPlaying || (selectedStructure === 'queue')}>Execute Stack Operation</Button>
             {selectedStructure === 'queue' && <p className="text-sm text-muted-foreground">Interactive Queue operations are coming soon!</p>}

            <div className="flex items-center justify-start pt-4 border-t">
              <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Controls & Data</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex gap-2">
                {!isPlaying ? <Button onClick={handlePlay} disabled={isFinished || steps.length <=1 || selectedStructure === 'queue'} size="lg"><Play className="mr-2"/>Play</Button> 
                             : <Button onClick={handlePause} size="lg"><Pause className="mr-2"/>Pause</Button>}
                <Button onClick={handleStep} variant="outline" disabled={isFinished || steps.length <=1 || selectedStructure === 'queue'} size="lg"><SkipForward className="mr-2"/>Step</Button>
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

// Adjusted StackQueueCodeSnippets component name for clarity
function StackQueueCodeSnippets({ currentLine, structureType }: { currentLine: number | null, structureType: StructureType }) {
  const { toast } = useToast();
  
  let codeToShow = structureType === 'stack' ? STACK_QUEUE_CODE_SNIPPETS.JavaScript.slice(0, 9) // Stack part
                      : STACK_QUEUE_CODE_SNIPPETS.JavaScript.slice(9); // Queue part
  
  // If showing stack, prepend class definition part as well for context if not already there.
  // This is a simplified way; ideally, the code snippets are better structured per operation.
  if (structureType === 'stack') {
      // codeToShow = [...STACK_QUEUE_CODE_SNIPPETS.JavaScript.slice(0,1), ...codeToShow];
  }


  const handleCopyCode = () => {
    const codeString = STACK_QUEUE_CODE_SNIPPETS.JavaScript.join('\n'); // Copy all for now
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `Stack/Queue Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[300px] md:h-[400px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> {structureType === 'stack' ? "Stack Code" : "Queue Code (Conceptual)"}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy Full
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {STACK_QUEUE_CODE_SNIPPETS.JavaScript.map((line, index) => ( // Show all for now
              <div key={`sq-line-${index}`}
                className={`px-2 py-0.5 rounded whitespace-pre-wrap ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                {line}
              </div>
            ))}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
    