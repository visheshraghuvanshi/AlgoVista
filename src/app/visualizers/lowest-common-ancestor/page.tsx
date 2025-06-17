
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata, TreeAlgorithmStep, BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from '@/types';
import { algorithmMetadata } from './metadata';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Play, Pause, SkipForward, RotateCcw, LocateFixed, Binary, FastForward, Gauge } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";

import { BinaryTreeVisualizationPanel } from '@/app/visualizers/binary-tree-traversal/BinaryTreeVisualizationPanel'; // Re-use
import { LowestCommonAncestorCodePanel } from './LowestCommonAncestorCodePanel'; 
import { generateLCASteps, LCA_LINE_MAP } from './lca-logic'; 
import { parseTreeInput, buildTreeNodesAndEdges as initialBuildTreeForDisplay } from '@/app/visualizers/binary-tree-traversal/binary-tree-traversal-logic';

const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 1800;

export default function LCAVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  const [treeInputValue, setTreeInputValue] = useState("5,3,8,1,4,7,9,null,2"); 
  const [nodePValue, setNodePValue] = useState("2"); // Changed default to use node '2'
  const [nodeQValue, setNodeQValue] = useState("7"); // Changed default
  
  const [steps, setSteps] = useState<TreeAlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<TreeAlgorithmStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [lcaResult, setLcaResult] = useState<string | number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [initialDisplayTree, setInitialDisplayTree] = useState<{nodes: BinaryTreeNodeVisual[], edges: BinaryTreeEdgeVisual[]}>({nodes: [], edges: []});


  useEffect(() => { setIsClient(true); }, []);

  const updateVisualStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setCurrentStep(currentS);
      if (stepIndex === steps.length - 1 && currentS.message?.toLowerCase().includes("lca found")) {
         const lcaHighlightId = currentS.auxiliaryData?.lcaHighlightIds?.slice(-1)[0]; // Last one in highlights is LCA
         const lcaNode = currentS.nodes.find(n => n.id === lcaHighlightId);
         setLcaResult(lcaNode?.value ?? "Error");
      } else if (stepIndex === steps.length - 1 && !currentS.message?.toLowerCase().includes("lca found")) {
         setLcaResult(null); // Clear if not found or error
      }
    }
  }, [steps]);

  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const pValStr = nodePValue.trim();
    const qValStr = nodeQValue.trim();
    const pVal = pValStr === "" ? undefined : (isNaN(Number(pValStr)) ? pValStr : Number(pValStr));
    const qVal = qValStr === "" ? undefined : (isNaN(Number(qValStr)) ? qValStr : Number(qValStr));

    if (pVal === undefined || qVal === undefined) {
        toast({title: "Input Missing", description: "Please enter values for both Node P and Node Q.", variant: "destructive"});
        setSteps([]); setCurrentStep(null); setIsFinished(true); setLcaResult(null);
        return;
    }

    const parsedInput = parseTreeInput(treeInputValue);
    if (!parsedInput) {
        toast({title: "Invalid Tree", description: "Please ensure tree input is correct.", variant: "destructive"});
        setSteps([]); setCurrentStep(null); setIsFinished(true); setLcaResult(null);
        setInitialDisplayTree({nodes: [], edges: []});
        return;
    }
    const { nodes: iNodes, edges: iEdges } = initialBuildTreeForDisplay(parsedInput);
    setInitialDisplayTree({nodes: iNodes, edges: iEdges});


    const newSteps = generateLCASteps(treeInputValue, pVal, qVal);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    setLcaResult(null); 

    if (newSteps.length > 0) {
        updateVisualStateFromStep(0);
        const lastStep = newSteps[newSteps.length-1];
        if (lastStep.message?.toLowerCase().includes("lca found")) {
            const lcaHighlightId = lastStep.auxiliaryData?.lcaHighlightIds?.slice(-1)[0];
            const lcaNode = lastStep.nodes.find(n => n.id === lcaHighlightId);
            const finalLcaValue = lcaNode?.value;
            setLcaResult(finalLcaValue ?? "Error");
            if (finalLcaValue !== undefined) {
                toast({ title: "LCA Process Complete", description: `LCA of P='${pVal}' and Q='${qVal}' is ${finalLcaValue}.` });
            }
        } else if (lastStep.message?.toLowerCase().includes("not found") || lastStep.message?.toLowerCase().includes("error")) {
            toast({ title: "LCA Error", description: lastStep.message, variant: "destructive" });
        }
    } else {
        setCurrentStep(null);
    }
  }, [treeInputValue, nodePValue, nodeQValue, toast, updateVisualStateFromStep]);
  
  useEffect(() => { handleGenerateSteps(); }, [handleGenerateSteps]);

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
    setIsPlaying(false); setIsFinished(true); // Reset to initial, non-playing state
    setTreeInputValue("5,3,8,1,4,7,9,null,2"); 
    setNodePValue("2"); setNodeQValue("7");
    setLcaResult(null);
    // handleGenerateSteps will be called by useEffect due to input changes
    // For an immediate visual reset to an empty/default tree, you might need to call something like:
    // const parsed = parseTreeInput("5,3,8,1,4,7,9,null,2");
    // const {nodes, edges} = initialBuildTreeForDisplay(parsed || []);
    // setInitialDisplayTree({nodes, edges});
    // setCurrentStep(null); setSteps([]);
  };
  
  useEffect(() => {
    handleReset(); // Initial setup call
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const algoDetails: AlgorithmDetailsProps | null = algorithmMetadata ? {
    title: algorithmMetadata.title,
    description: algorithmMetadata.longDescription || algorithmMetadata.description,
    timeComplexities: algorithmMetadata.timeComplexities!,
    spaceComplexity: algorithmMetadata.spaceComplexity!,
  } : null;

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>;}
  if (!algoDetails) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4 flex justify-center items-center"><AlertTriangle /></main><Footer /></div>;}
  
  const displayNodes = currentStep?.nodes && currentStep.nodes.length > 0 ? currentStep.nodes : initialDisplayTree.nodes;
  const displayEdges = currentStep?.edges && currentStep.edges.length > 0 ? currentStep.edges : initialDisplayTree.edges;


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <LocateFixed className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithmMetadata.title}
          </h1>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{currentStep?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="lg:w-3/5 xl:w-2/3">
              <BinaryTreeVisualizationPanel 
                nodes={displayNodes} 
                edges={displayEdges} 
                traversalPath={currentStep?.traversalPath || []} 
                currentProcessingNodeId={currentStep?.currentProcessingNodeId}
              />
            </div>
            <div className="lg:w-2/5 xl:w-1/3">
                <LowestCommonAncestorCodePanel currentLine={currentStep?.currentLine ?? null} />
            </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Find LCA</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-1">
                    <Label htmlFor="lcaTreeInput">Tree Input (comma-sep, level-order, 'null' for empty)</Label>
                    <Input id="lcaTreeInput" value={treeInputValue} onChange={e => setTreeInputValue(e.target.value)} placeholder="e.g., 5,3,8,1,4,null,9" disabled={isPlaying}/>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="nodePInput">Node P Value</Label>
                    <Input id="nodePInput" value={nodePValue} onChange={e => setNodePValue(e.target.value)} placeholder="e.g., 1" disabled={isPlaying}/>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="nodeQInput">Node Q Value</Label>
                    <Input id="nodeQInput" value={nodeQValue} onChange={e => setNodeQValue(e.target.value)} placeholder="e.g., 4" disabled={isPlaying}/>
                </div>
            </div>
            <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full md:w-auto"><LocateFixed className="mr-2 h-4 w-4"/>Find LCA & Generate Steps</Button>
            {isFinished && lcaResult !== null && (
                <p className="text-center font-semibold text-lg mt-2">LCA Result: <span className="text-green-500">{lcaResult.toString()}</span></p>
            )}
            {isFinished && lcaResult === null && steps.length > 1 && !steps[steps.length-1].message?.toLowerCase().includes("error") && currentStep?.message && !currentStep.message.toLowerCase().includes("error") &&(
                 <p className="text-center font-semibold text-lg mt-2 text-red-500">LCA could not be determined (or nodes not found).</p>
            )}
            
            <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset All</Button>
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
