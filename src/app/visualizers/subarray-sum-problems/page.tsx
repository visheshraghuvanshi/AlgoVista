
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AlgorithmDetailsCard } from './AlgorithmDetailsCard'; // Local import
import type { AlgorithmMetadata, AlgorithmStep, AlgorithmDetailsProps } from './types'; // Local import
import { algorithmMetadata } from './metadata'; // Local import
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge, Sigma } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { VisualizationPanel } from './VisualizationPanel'; // Local import
import { SubarraySumCodePanel } from './SubarraySumCodePanel';
import { generateFindSubarraySumPositiveSteps, generateFindSubarraySumAnySteps, SUBARRAY_SUM_LINE_MAPS } from './subarray-sum-logic';
import type { SubarraySumProblemType } from './subarray-sum-logic';

const SUBARRAY_SUM_CODE_SNIPPETS: Record<SubarraySumProblemType, Record<string, string[]>> = {
  positiveOnly: {
    JavaScript: [
      "function findSubarrayWithSumPositive(arr, targetSum) {", // 1
      "  let currentSum = 0; let start = 0;",                 // 2
      "  for (let end = 0; end < arr.length; end++) {",       // 3
      "    currentSum += arr[end];",                          // 4
      "    while (currentSum > targetSum && start <= end) {", // 5
      "      currentSum -= arr[start];",                      // 6
      "      start++;",                                       // 7
      "    }",
      "    if (currentSum === targetSum && start <= end) {", // 8
      "      return arr.slice(start, end + 1);",             // 9
      "    }",
      "  }",
      "  return null;",                                       // 10
      "}",                                                    // 11
    ],
    Python: [
      "def find_subarray_with_sum_positive(arr, target_sum):",
      "    current_sum = 0",
      "    start = 0",
      "    for end in range(len(arr)):",
      "        current_sum += arr[end]",
      "        while current_sum > target_sum and start <= end:",
      "            current_sum -= arr[start]",
      "            start += 1",
      "        if current_sum == target_sum and start <= end:",
      "            return arr[start : end + 1]",
      "    return None",
    ],
    Java: [
      "import java.util.*;",
      "class Solution {",
      "    public int[] findSubarrayWithSumPositive(int[] arr, int targetSum) {",
      "        int currentSum = 0, start = 0;",
      "        for (int end = 0; end < arr.length; end++) {",
      "            currentSum += arr[end];",
      "            while (currentSum > targetSum && start <= end) {",
      "                currentSum -= arr[start];",
      "                start++;",
      "            }",
      "            if (currentSum == targetSum && start <= end) {",
      "                return Arrays.copyOfRange(arr, start, end + 1);",
      "            }",
      "        }",
      "        return null;",
      "    }",
      "}",
    ],
    "C++": [
      "#include <vector>",
      "#include <numeric> // For std::accumulate, though not used in sliding window",
      "std::vector<int> findSubarrayWithSumPositive(const std::vector<int>& arr, int targetSum) {",
      "    int currentSum = 0, start = 0;",
      "    for (int end = 0; end < arr.size(); ++end) {",
      "        currentSum += arr[end];",
      "        while (currentSum > targetSum && start <= end) {",
      "            currentSum -= arr[start];",
      "            start++;",
      "        }",
      "        if (currentSum == targetSum && start <= end) {",
      "            return std::vector<int>(arr.begin() + start, arr.begin() + end + 1);",
      "        }",
      "    }",
      "    return {}; // Return empty vector if not found",
      "}",
    ],
  },
  anyNumbers: {
    JavaScript: [
      "function findSubarrayWithSumAny(arr, targetSum) {",    // 1
      "  let currentSum = 0; const prefixSums = new Map();", // 2
      "  prefixSums.set(0, -1);",                            // 3
      "  for (let i = 0; i < arr.length; i++) {",             // 4
      "    currentSum += arr[i];",                            // 5
      "    if (prefixSums.has(currentSum - targetSum)) {",   // 6
      "      return arr.slice(prefixSums.get(currentSum - targetSum) + 1, i + 1);", // 7
      "    }",
      "    prefixSums.set(currentSum, i);",                   // 8
      "  }",
      "  return null;",                                       // 9
      "}",                                                    // 10
    ],
    Python: [
      "def find_subarray_with_sum_any(arr, target_sum):",
      "    current_sum = 0",
      "    prefix_sums = {0: -1} # Sum -> index",
      "    for i, num in enumerate(arr):",
      "        current_sum += num",
      "        if current_sum - target_sum in prefix_sums:",
      "            start_index = prefix_sums[current_sum - target_sum] + 1",
      "            return arr[start_index : i + 1]",
      "        prefix_sums[current_sum] = i",
      "    return None",
    ],
    Java: [
      "import java.util.*;",
      "class Solution {",
      "    public int[] findSubarrayWithSumAny(int[] arr, int targetSum) {",
      "        int currentSum = 0;",
      "        Map<Integer, Integer> prefixSums = new HashMap<>();",
      "        prefixSums.put(0, -1);",
      "        for (int i = 0; i < arr.length; i++) {",
      "            currentSum += arr[i];",
      "            if (prefixSums.containsKey(currentSum - targetSum)) {",
      "                int startIndex = prefixSums.get(currentSum - targetSum) + 1;",
      "                return Arrays.copyOfRange(arr, startIndex, i + 1);",
      "            }",
      "            prefixSums.put(currentSum, i);",
      "        }",
      "        return null;",
      "    }",
      "}",
    ],
    "C++": [
      "#include <vector>",
      "#include <unordered_map>",
      "std::vector<int> findSubarrayWithSumAny(const std::vector<int>& arr, int targetSum) {",
      "    long long currentSum = 0; // Use long long for sum to avoid overflow with many numbers",
      "    std::unordered_map<long long, int> prefixSums;",
      "    prefixSums[0] = -1;",
      "    for (int i = 0; i < arr.size(); ++i) {",
      "        currentSum += arr[i];",
      "        if (prefixSums.count(currentSum - targetSum)) {",
      "            int startIndex = prefixSums[currentSum - targetSum] + 1;",
      "            return std::vector<int>(arr.begin() + startIndex, arr.begin() + i + 1);",
      "        }",
      "        prefixSums[currentSum] = i;",
      "    }",
      "    return {}; // Return empty vector if not found",
      "}",
    ],
  },
};

const DEFAULT_ANIMATION_SPEED = 700;
const MIN_SPEED = 100;
const MAX_SPEED = 2000;

export default function SubarraySumProblemsVisualizerPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [inputValue, setInputValue] = useState('1,4,20,3,10,5');
  const [targetSumValue, setTargetSumValue] = useState('33');
  const [problemType, setProblemType] = useState<SubarraySumProblemType>('positiveOnly');

  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [displayedData, setDisplayedData] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [processingSubArrayRange, setProcessingSubArrayRange] = useState<[number, number] | null>(null);
  const [auxiliaryData, setAuxiliaryData] = useState<AlgorithmStep['auxiliaryData']>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  const parseInputArray = useCallback((value: string): number[] | null => {
    if (value.trim() === '') return [];
    const parsed = value.split(',').map(s => parseInt(s.trim(), 10));
    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Array Input", description: "Please enter comma-separated numbers.", variant: "destructive" });
      return null;
    }
    if (problemType === 'positiveOnly' && parsed.some(n => n < 0)) {
      toast({ title: "Invalid Array for Positive Only", description: "This variant expects non-negative numbers. Switch to 'Any Numbers' variant or remove negatives.", variant: "destructive" });
      return null;
    }
    return parsed;
  }, [toast, problemType]);
  
  const parseTargetSum = useCallback((value: string): number | null => {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      toast({ title: "Invalid Target Sum", description: "Target sum must be a number.", variant: "destructive" });
      return null;
    }
    return num;
  }, [toast]);


  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setDisplayedData(currentS.array);
      setActiveIndices(currentS.activeIndices);
      setSortedIndices(currentS.sortedIndices);
      setCurrentLine(currentS.currentLine);
      setProcessingSubArrayRange(currentS.processingSubArrayRange || null);
      setAuxiliaryData(currentS.auxiliaryData || null);
    }
  }, [steps]);
  
  const handleGenerateSteps = useCallback(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    const arr = parseInputArray(inputValue);
    const target = parseTargetSum(targetSumValue);

    if (!arr || target === null) {
      setSteps([]); setDisplayedData(arr || []); setIsFinished(true); return;
    }

    let newSteps: AlgorithmStep[] = [];
    if (problemType === 'positiveOnly') {
      newSteps = generateFindSubarraySumPositiveSteps(arr, target);
    } else if (problemType === 'anyNumbers') {
      newSteps = generateFindSubarraySumAnySteps(arr, target);
    }
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsFinished(newSteps.length <= 1);
    if (newSteps.length > 0) updateStateFromStep(0);
    else { setDisplayedData(arr); setActiveIndices([]); setCurrentLine(null); setAuxiliaryData(null); }

  }, [inputValue, targetSumValue, problemType, parseInputArray, parseTargetSum, toast, updateStateFromStep]);
  
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
  const handleReset = () => { setIsPlaying(false); setIsFinished(false); handleGenerateSteps(); };
  
  const algoDetails: AlgorithmDetailsProps = { ...algorithmMetadata };

  if (!isClient) { return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow p-4"><p>Loading...</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Sigma className="mx-auto h-16 w-16 text-primary dark:text-accent mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">{algorithmMetadata.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">{steps[currentStepIndex]?.message || algorithmMetadata.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <VisualizationPanel data={displayedData} activeIndices={activeIndices} sortedIndices={sortedIndices} processingSubArrayRange={processingSubArrayRange} />
            {auxiliaryData && (
                <Card className="mt-4">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-center">Current State</CardTitle></CardHeader>
                    <CardContent className="text-sm flex flex-wrap justify-around gap-2">
                        {Object.entries(auxiliaryData).map(([key, value]) => {
                             if (key === 'prefixSums') {
                                const mapEntries = Object.entries(value as Record<string,number>);
                                return <p key={key}><strong>Prefix Sums Map:</strong> {mapEntries.length > 0 ? mapEntries.map(([s,i]) => `${s}:${i}`).join(', ') : '(empty)'}</p>;
                            }
                            return <p key={key}><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value?.toString()}</p>;
                        })}
                    </CardContent>
                </Card>
            )}
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <SubarraySumCodePanel codeSnippets={SUBARRAY_SUM_CODE_SNIPPETS} currentLine={currentLine} selectedProblem={problemType} />
          </div>
        </div>
        
        <Card className="shadow-xl rounded-xl mb-6">
          <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Problem Setup</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="arrayInput">Input Array</Label>
                <Input id="arrayInput" value={inputValue} onChange={e => setInputValue(e.target.value)} disabled={isPlaying} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetSumInputSub">Target Sum</Label>
                <Input id="targetSumInputSub" type="number" value={targetSumValue} onChange={e => setTargetSumValue(e.target.value)} disabled={isPlaying}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="problemTypeSelectSub">Problem Variant</Label>
                <Select value={problemType} onValueChange={v => setProblemType(v as SubarraySumProblemType)} disabled={isPlaying}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positiveOnly">Given Sum (Positive Nums Only)</SelectItem>
                    <SelectItem value="anyNumbers">Given Sum (Any Numbers)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleGenerateSteps} disabled={isPlaying} className="w-full md:w-auto">Run Algorithm</Button>
             <div className="flex items-center justify-start pt-4 border-t">
                <Button onClick={handleReset} variant="outline" disabled={isPlaying}><RotateCcw className="mr-2 h-4 w-4" /> Reset Problem</Button>
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

