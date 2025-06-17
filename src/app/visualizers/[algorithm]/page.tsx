
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VisualizationPanel } from '@/components/algo-vista/visualization-panel';
import { CodePanel } from '@/components/algo-vista/code-panel';
import { ControlsPanel } from '@/components/algo-vista/controls-panel';
import type { AlgorithmMetadata } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';

// Line Maps
const BUBBLE_SORT_LINE_MAP = { 
  functionDeclaration: 1, getN: 2, declareSwappedVar: 3, doWhileStart: 4, setSwappedFalse: 5, forLoopStart: 6, compareComment: 7,  ifCondition: 8, swapComment: 9,  tempAssignment: 10, firstSwapAssign: 11, secondSwapAssign: 12, setSwappedTrue: 13, ifEnd: 14, forLoopEnd: 15, decrementN: 16, doWhileEndCondition: 17, returnArr: 18, functionEnd: 19,
};
const INSERTION_SORT_LINE_MAP = { 
  functionDeclaration: 1, getN: 2, outerLoopStart: 3, keyAssignment: 4,  jAssignment: 5, whileLoopComment1: 6, whileLoopComment2: 7,  whileCondition: 8, shiftElement: 9, decrementJ: 10, whileLoopEnd: 11, placeKey: 12, outerLoopEnd: 13, returnArr: 14, functionEnd: 15,
};

const MERGE_SORT_LINE_MAP = {
  mergeSortBase: 1, // function mergeSort(arr, low, high) {
  baseCaseReturn: 2, //   if (low >= high) return;
  calculateMiddle: 3, // const middle = Math.floor(low + (high - low) / 2);
  recursiveCallLeft: 4, // mergeSort(arr, low, middle);
  recursiveCallRight: 5, // mergeSort(arr, middle + 1, high);
  callMerge: 6, // merge(arr, low, middle, high);
  mergeSortEnd: 7, // }
  mergeFunction: 8, // function merge(arr, low, mid, high) {
  calcLeftSize: 9, // const leftSize = mid - low + 1;
  calcRightSize: 10, // const rightSize = high - mid;
  createLeftArray: 11, // const L = new Array(leftSize);
  createRightArray: 12, // const R = new Array(rightSize);
  copyToLeftArray: 13, // for (let i = 0; i < leftSize; i++) L[i] = arr[low + i];
  copyToRightArray: 14, // for (let j = 0; j < rightSize; j++) R[j] = arr[mid + 1 + j];
  initMergePointers: 15, // let i = 0, j = 0, k = low;
  mergeLoopStart: 16, // while (i < leftSize && j < rightSize) {
  compareLvsR: 17, // if (L[i] <= R[j]) {
  copyFromL: 18, // arr[k] = L[i]; i++;
  elseBlock: 19, // } else {
  copyFromR: 20, // arr[k] = R[j]; j++;
  endIfElse: 21, // }
  incrementK: 22, // k++;
  mergeLoopEnd: 23, // }
  copyRemainingL: 24, // while (i < leftSize) arr[k++] = L[i++];
  copyRemainingR: 25, // while (j < rightSize) arr[k++] = R[j++];
  mergeFunctionEnd: 26, // }
  initialCallComment: 27, // // Initial call: mergeSort(arr, 0, arr.length - 1);
};

const QUICK_SORT_LINE_MAP = {
  quickSortBase: 1, // function quickSort(arr, low, high) {
  quickSortCondition: 2, // if (low < high) {
  callPartition: 3, // let pi = partition(arr, low, high);
  recursiveCallLeft: 4, // quickSort(arr, low, pi - 1);
  recursiveCallRight: 5, // quickSort(arr, pi + 1, high);
  quickSortConditionEnd: 6, // }
  quickSortEnd: 7, // }
  partitionBase: 8, // function partition(arr, low, high) {
  setPivot: 9, // let pivot = arr[high];
  setI: 10, // let i = low - 1;
  partitionLoopStart: 11, // for (let j = low; j < high; j++) {
  compareElementWithPivot: 12, // if (arr[j] < pivot) {
  incrementI: 13, // i++;
  swapIJ: 14, // [arr[i], arr[j]] = [arr[j], arr[i]];
  compareElementEnd: 15, // }
  partitionLoopEnd: 16, // }
  swapPivotToMiddle: 17, // [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  returnPI: 18, // return i + 1;
  partitionEnd: 19, // }
  initialCallComment: 20, // // Initial call: quickSort(arr, 0, arr.length - 1);
};


type AlgorithmStep = {
  array: number[];
  activeIndices: number[]; 
  swappingIndices: number[]; 
  sortedIndices: number[]; 
  currentLine: number | null;
  message?: string; 
  processingSubArrayRange?: [number, number] | null; 
  pivotActualIndex?: number | null;
};

const DEFAULT_ANIMATION_SPEED = 700; 
const MIN_SPEED = 100; 
const MAX_SPEED = 2000; 

export default function AlgorithmVisualizerPage() {
  const params = useParams();
  const { toast } = useToast();
  const algorithmSlug = typeof params.algorithm === 'string' ? params.algorithm : '';
  
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);
  
  const [inputValue, setInputValue] = useState('5,1,9,3,7,4,6,2,8');
  const [initialData, setInitialData] = useState<number[]>([]);

  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [displayedData, setDisplayedData] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [processingSubArrayRange, setProcessingSubArrayRange] = useState<[number, number] | null>(null);
  const [pivotActualIndex, setPivotActualIndex] = useState<number | null>(null);


  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isAlgoImplemented = useMemo(() => {
    return ['bubble-sort', 'insertion-sort', 'merge-sort', 'quick-sort'].includes(algorithm?.slug || '');
  }, [algorithm]);


  useEffect(() => {
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === algorithmSlug);
    if (foundAlgorithm) {
      setAlgorithm(foundAlgorithm);
      if (!['bubble-sort', 'insertion-sort', 'merge-sort', 'quick-sort'].includes(foundAlgorithm.slug)) {
        toast({ title: "Visualizer Not Implemented", description: `The visualizer for ${foundAlgorithm.title} is coming soon!`, variant: "default" });
      }
    } else {
      console.error("Algorithm not found:", algorithmSlug);
    }
  }, [algorithmSlug, toast]);

  const parseInput = useCallback((value: string): number[] | null => {
    if (value.trim() === '') return [];
    const parsed = value.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => parseInt(s, 10));

    if (parsed.some(isNaN)) {
      toast({ title: "Invalid Input", description: "Please enter comma-separated numbers only.", variant: "destructive" });
      return null;
    }
    if (parsed.some(n => n > 999 || n < -999)) {
       toast({ title: "Input out of range", description: "Please enter numbers between -999 and 999.", variant: "destructive" });
      return null;
    }
    return parsed;
  }, [toast]);

  // Step Generators (BubbleSort, InsertionSort are existing)

  const generateBubbleSortSteps = useCallback((arrToSort: number[]): AlgorithmStep[] => {
    const localSteps: AlgorithmStep[] = [];
    if (!arrToSort || arrToSort.length === 0) return localSteps;
    const arr = [...arrToSort];
    let n = arr.length;
    let swapped;
    const localSortedIndices: number[] = [];
    const lm = BUBBLE_SORT_LINE_MAP;

    const addStep = (line: number, active: number[] = [], swapping: number[] = [], currentArrState = [...arr], processingRange: [number,number] | null = null, pivotIdx: number | null = null) => {
      localSteps.push({
        array: currentArrState,
        activeIndices: [...active],
        swappingIndices: [...swapping],
        sortedIndices: [...localSortedIndices].sort((a,b)=>a-b),
        currentLine: line,
        processingSubArrayRange: processingRange,
        pivotActualIndex: pivotIdx
      });
    };

    addStep(lm.functionDeclaration); 
    if (n === 0) { 
      addStep(lm.returnArr); 
      addStep(lm.functionEnd); 
      return localSteps;
    }
    
    addStep(lm.getN); 
    addStep(lm.declareSwappedVar);

    do {
      addStep(lm.doWhileStart); 
      swapped = false;
      addStep(lm.setSwappedFalse); 

      for (let i = 0; i < n - 1; i++) {
        addStep(lm.forLoopStart, [i, i + 1]); 
        addStep(lm.compareComment, [i, i + 1]); 
        addStep(lm.ifCondition, [i, i + 1]); 
        if (arr[i] > arr[i + 1]) {
          addStep(lm.swapComment, [i, i + 1], [i, i + 1]); 
          addStep(lm.tempAssignment, [i, i + 1], [i, i + 1]); 
          let temp = arr[i];
          arr[i] = arr[i + 1];
          addStep(lm.firstSwapAssign, [i, i + 1], [i, i + 1]); 
          arr[i + 1] = temp;
          addStep(lm.secondSwapAssign, [i, i + 1], [i, i + 1]); 
          swapped = true;
          addStep(lm.setSwappedTrue); 
        }
        addStep(lm.ifEnd); 
      }
      addStep(lm.forLoopEnd); 

      if (n - 1 >= 0 && n -1 < arr.length) { 
        localSortedIndices.push(n - 1);
      }
      
      n--;
      addStep(lm.decrementN); 
    } while (swapped && n > 0); 
    addStep(lm.doWhileEndCondition); 

    const remainingUnsortedCount = arr.length - localSortedIndices.length;
    for(let k = 0; k < remainingUnsortedCount; k++) { 
        if(!localSortedIndices.includes(k)) localSortedIndices.push(k);
    }
    localSortedIndices.sort((a,b) => a-b);

    addStep(lm.returnArr, [], [], [...arr], null, null); 
    addStep(lm.functionEnd, [], [], [...arr], null, null); 
    
    return localSteps;
  }, []);

  const generateInsertionSortSteps = useCallback((arrToSort: number[]): AlgorithmStep[] => {
    const localSteps: AlgorithmStep[] = [];
    if (!arrToSort || arrToSort.length === 0) return localSteps;
    const arr = [...arrToSort];
    const n = arr.length;
    const lm = INSERTION_SORT_LINE_MAP;
    let localSortedIndices: number[] = [];

    const addStep = (line: number, active: number[] = [], swapping: number[] = [], message?: string, currentArrState = [...arr], processingRange:[number,number]|null = null, pivotIdx: number|null = null) => {
      localSteps.push({
        array: currentArrState,
        activeIndices: [...active],
        swappingIndices: [...swapping],
        sortedIndices: [...localSortedIndices].sort((a,b)=>a-b),
        currentLine: line,
        message,
        processingSubArrayRange: processingRange,
        pivotActualIndex: pivotIdx
      });
    };
    
    addStep(lm.functionDeclaration, [], [], "Start Insertion Sort");
    if (n === 0) {
      addStep(lm.returnArr); addStep(lm.functionEnd); return localSteps;
    }
    addStep(lm.getN);
    if (n > 0) localSortedIndices.push(0);

    for (let i = 1; i < n; i++) {
      addStep(lm.outerLoopStart, [i], [], `Iterating for element at index ${i}`);
      let key = arr[i];
      addStep(lm.keyAssignment, [i], [i], `key = arr[${i}] (value: ${key})`);
      let j = i - 1;
      addStep(lm.jAssignment, [i, j], [i], `j = ${j}`);
      addStep(lm.whileLoopComment1, [i,j], [i]); 
      addStep(lm.whileLoopComment2, [i,j], [i]);
      while (j >= 0 && arr[j] > key) {
        addStep(lm.whileCondition, [j, i], [i], `Comparing arr[${j}] (${arr[j]}) > key (${key})`);
        arr[j + 1] = arr[j];
        addStep(lm.shiftElement, [j, i], [j, j + 1], `Shift arr[${j}] (${arr[j]}) to arr[${j + 1}]`);
        j = j - 1;
        addStep(lm.decrementJ, [j < 0 ? i : j, i], [i], `Decrement j to ${j}`);
      }
      addStep(lm.whileLoopEnd, [j+1, i], [i], `End of while. Insert position for key (${key}) is index ${j+1}`);
      arr[j + 1] = key;
      addStep(lm.placeKey, [], [i, j + 1], `Place key (${key}) at arr[${j + 1}]`);
      localSortedIndices = Array.from({length: i + 1}, (_, k) => k);
      addStep(lm.outerLoopEnd, [], [], `Element at index ${i} sorted. Sorted: 0-${i}`);
    }
    localSortedIndices = arr.map((_, idx) => idx);
    addStep(lm.returnArr, [], [], "Array is sorted");
    addStep(lm.functionEnd, [], [], "Algorithm finished");
    return localSteps;
  }, []);

  const generateMergeSortSteps = useCallback((arrToSort: number[]): AlgorithmStep[] => {
    const localSteps: AlgorithmStep[] = [];
    if (!arrToSort || arrToSort.length === 0) {
      localSteps.push({ array: [], activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Empty array" });
      return localSteps;
    }
    
    const arr = [...arrToSort];
    const lm = MERGE_SORT_LINE_MAP;

    function addStep(
        line: number,
        currentArrState: number[],
        active: number[] = [],
        swapping: number[] = [],
        sorted: number[] = [],
        message: string = "",
        processingRange: [number, number] | null = null,
    ) {
        localSteps.push({
            array: [...currentArrState],
            activeIndices: active,
            swappingIndices: swapping,
            sortedIndices: sorted,
            currentLine: line,
            message,
            processingSubArrayRange: processingRange,
        });
    }

    function merge(currentArr: number[], low: number, mid: number, high: number, currentSortedGlobal: number[]) {
        addStep(lm.mergeFunction, currentArr, [], [], [...currentSortedGlobal], `Merging subarray [${low}..${high}]`, [low, high]);
        
        const leftSize = mid - low + 1;
        addStep(lm.calcLeftSize, currentArr, [], [], [...currentSortedGlobal], `Left half size: ${leftSize}`, [low, high]);
        const rightSize = high - mid;
        addStep(lm.calcRightSize, currentArr, [], [], [...currentSortedGlobal], `Right half size: ${rightSize}`, [low, high]);

        const L = new Array(leftSize);
        const R = new Array(rightSize);
        addStep(lm.createLeftArray, currentArr, [], [], [...currentSortedGlobal], `Creating temp left array`, [low, high]);
        addStep(lm.createRightArray, currentArr, [], [], [...currentSortedGlobal], `Creating temp right array`, [low, high]);

        for (let i = 0; i < leftSize; i++) L[i] = currentArr[low + i];
        addStep(lm.copyToLeftArray, currentArr, Array.from({length: leftSize}, (_,k)=>low+k), [], [...currentSortedGlobal], `Copying to temp left array`, [low, high]);
        
        for (let j = 0; j < rightSize; j++) R[j] = currentArr[mid + 1 + j];
        addStep(lm.copyToRightArray, currentArr, Array.from({length: rightSize}, (_,k)=>mid+1+k), [], [...currentSortedGlobal], `Copying to temp right array`, [low, high]);

        let i = 0, j = 0, k = low;
        addStep(lm.initMergePointers, currentArr, [low+i, mid+1+j], [], [...currentSortedGlobal], `Initializing merge pointers i=${i}, j=${j}, k=${k}`, [low, high]);

        while (i < leftSize && j < rightSize) {
            addStep(lm.mergeLoopStart, currentArr, [low + i, mid + 1 + j], [], [...currentSortedGlobal], `Comparing L[${i}] (${L[i]}) and R[${j}] (${R[j]})`, [low, high]);
            addStep(lm.compareLvsR, currentArr, [low+i, mid+1+j], [], [...currentSortedGlobal], `Is L[${i}] (${L[i]}) <= R[${j}] (${R[j]})?`, [low,high]);
            if (L[i] <= R[j]) {
                currentArr[k] = L[i];
                addStep(lm.copyFromL, currentArr, [low+i], [k], [...currentSortedGlobal], `Copying L[${i}] (${L[i]}) to arr[${k}]`, [low, high]);
                i++;
            } else {
                addStep(lm.elseBlock, currentArr, [low+i, mid+1+j], [], [...currentSortedGlobal], `No, L[${i}] > R[${j}]`, [low,high]);
                currentArr[k] = R[j];
                addStep(lm.copyFromR, currentArr, [mid+1+j], [k], [...currentSortedGlobal], `Copying R[${j}] (${R[j]}) to arr[${k}]`, [low, high]);
                j++;
            }
            addStep(lm.endIfElse, currentArr, [], [k], [...currentSortedGlobal], `arr[${k}] is now ${currentArr[k]}`, [low,high]);
            k++;
            addStep(lm.incrementK, currentArr, [], [], [...currentSortedGlobal], `Increment k to ${k}`, [low, high]);
        }
        addStep(lm.mergeLoopEnd, currentArr, [], [], [...currentSortedGlobal], `Merge loop finished`, [low, high]);

        while (i < leftSize) {
            currentArr[k] = L[i];
            addStep(lm.copyRemainingL, currentArr, [low+i], [k], [...currentSortedGlobal], `Copying remaining L[${i}] (${L[i]}) to arr[${k}]`, [low, high]);
            i++; k++;
        }
        while (j < rightSize) {
            currentArr[k] = R[j];
            addStep(lm.copyRemainingR, currentArr, [mid+1+j], [k], [...currentSortedGlobal], `Copying remaining R[${j}] (${R[j]}) to arr[${k}]`, [low, high]);
            j++; k++;
        }
        
        for(let l_idx = low; l_idx <= high; l_idx++) {
            if (!currentSortedGlobal.includes(l_idx)) currentSortedGlobal.push(l_idx);
        }
        currentSortedGlobal.sort((a,b)=>a-b);
        addStep(lm.mergeFunctionEnd, currentArr, [], [], [...currentSortedGlobal], `Subarray [${low}..${high}] merged and sorted`, [low, high]);
    }

    function mergeSortRecursive(currentArr: number[], low: number, high: number, currentSortedGlobal: number[]) {
        addStep(lm.mergeSortBase, currentArr, [], [], [...currentSortedGlobal], `mergeSort(arr, ${low}, ${high})`, [low, high]);
        if (low >= high) {
            addStep(lm.baseCaseReturn, currentArr, [], [], [...currentSortedGlobal], `Base case: low (${low}) >= high (${high}). Return.`, [low, high]);
            if(low === high && !currentSortedGlobal.includes(low)) currentSortedGlobal.push(low); // Single element is sorted
            return;
        }
        const middle = Math.floor(low + (high - low) / 2);
        addStep(lm.calculateMiddle, currentArr, [], [], [...currentSortedGlobal], `Middle calculated: ${middle}`, [low, high]);
        
        addStep(lm.recursiveCallLeft, currentArr, [], [], [...currentSortedGlobal], `Recursive call for left half: [${low}..${middle}]`, [low, high]);
        mergeSortRecursive(currentArr, low, middle, currentSortedGlobal);
        
        addStep(lm.recursiveCallRight, currentArr, [], [], [...currentSortedGlobal], `Recursive call for right half: [${middle + 1}..${high}]`, [low, high]);
        mergeSortRecursive(currentArr, middle + 1, high, currentSortedGlobal);
        
        addStep(lm.callMerge, currentArr, [], [], [...currentSortedGlobal], `Call merge for [${low}..${high}]`, [low, high]);
        merge(currentArr, low, middle, high, currentSortedGlobal);
        addStep(lm.mergeSortEnd, currentArr, [], [], [...currentSortedGlobal], `Finished mergeSort for [${low}..${high}]`, [low,high]);
    }
    
    const globalSortedIndices: number[] = [];
    addStep(lm.initialCallComment, arr, [], [], [], "Initial call to Merge Sort for the whole array", [0, arr.length - 1]);
    mergeSortRecursive(arr, 0, arr.length - 1, globalSortedIndices);
    addStep(lm.mergeFunctionEnd, arr, [], [], arr.map((_, i) => i), "Array is sorted", null); // Final sorted state
    return localSteps;
  }, []);

  const generateQuickSortSteps = useCallback((arrToSort: number[]): AlgorithmStep[] => {
    const localSteps: AlgorithmStep[] = [];
    if (!arrToSort || arrToSort.length === 0) {
      localSteps.push({ array: [], activeIndices: [], swappingIndices: [], sortedIndices: [], currentLine: null, message: "Empty array" });
      return localSteps;
    }

    const arr = [...arrToSort];
    const lm = QUICK_SORT_LINE_MAP;
    const currentGlobalSortedIndices: number[] = [];

    function addStep(
        line: number,
        currentArrState: number[],
        active: number[] = [],
        swapping: number[] = [],
        message: string = "",
        processingRange: [number, number] | null = null,
        pivotIdx: number | null = null
    ) {
        localSteps.push({
            array: [...currentArrState],
            activeIndices: active,
            swappingIndices: swapping,
            sortedIndices: [...currentGlobalSortedIndices].sort((a,b)=>a-b),
            currentLine: line,
            message,
            processingSubArrayRange: processingRange,
            pivotActualIndex: pivotIdx,
        });
    }

    function partition(currentArr: number[], low: number, high: number) {
        addStep(lm.partitionBase, currentArr, [], [], `Partitioning subarray [${low}..${high}]`, [low, high]);
        const pivotValue = currentArr[high];
        addStep(lm.setPivot, currentArr, [high], [], `Pivot selected: arr[${high}] = ${pivotValue}`, [low, high], high);
        
        let i = low - 1;
        addStep(lm.setI, currentArr, [high], [], `i initialized to ${i}`, [low, high], high);

        for (let j = low; j < high; j++) {
            addStep(lm.partitionLoopStart, currentArr, [j, high], [], `Comparing arr[${j}] (${currentArr[j]}) with pivot (${pivotValue})`, [low, high], high);
            addStep(lm.compareElementWithPivot, currentArr, [j, high], [], `Is arr[${j}] (${currentArr[j]}) < pivot (${pivotValue})?`, [low,high], high);
            if (currentArr[j] < pivotValue) {
                i++;
                addStep(lm.incrementI, currentArr, [j, high], [], `Yes. Increment i to ${i}`, [low, high], high);
                
                addStep(lm.swapIJ, currentArr, [i,j,high], [i,j], `Swap arr[${i}] (${currentArr[i]}) and arr[${j}] (${currentArr[j]})`, [low, high], high);
                [currentArr[i], currentArr[j]] = [currentArr[j], currentArr[i]];
                addStep(lm.swapIJ, currentArr, [i,j,high], [i,j], `Swapped. Array: [${currentArr.slice(low, high+1).join(',')}]`, [low, high], high); // Show result of swap
            } else {
                 addStep(lm.compareElementWithPivot, currentArr, [j, high], [], `No. arr[${j}] (${currentArr[j]}) not < pivot.`, [low, high], high);
            }
            addStep(lm.compareElementEnd, currentArr, [j,high], [], `End of comparison for j=${j}`, [low,high],high);
        }
        addStep(lm.partitionLoopEnd, currentArr, [high], [], `Partition loop finished. i = ${i}`, [low, high], high);

        addStep(lm.swapPivotToMiddle, currentArr, [i+1, high], [i+1, high], `Swap pivot arr[${high}] (${currentArr[high]}) with arr[${i+1}] (${currentArr[i+1]})`, [low, high], high);
        [currentArr[i + 1], currentArr[high]] = [currentArr[high], currentArr[i + 1]];
        const partitionIndex = i + 1;
        addStep(lm.swapPivotToMiddle, currentArr, [partitionIndex], [partitionIndex], `Pivot swapped. Partition index pi = ${partitionIndex}. Array: [${currentArr.slice(low,high+1).join(',')}]`, [low, high], partitionIndex);
        
        if (!currentGlobalSortedIndices.includes(partitionIndex)) currentGlobalSortedIndices.push(partitionIndex);
        addStep(lm.returnPI, currentArr, [], [], `Pivot at ${partitionIndex} is in sorted position.`, [low, high], partitionIndex);
        addStep(lm.partitionEnd, currentArr, [], [], `End partition for [${low}..${high}]`, [low,high], partitionIndex);
        return partitionIndex;
    }

    function quickSortRecursive(currentArr: number[], low: number, high: number) {
        addStep(lm.quickSortBase, currentArr, [], [], `quickSort(arr, ${low}, ${high})`, [low, high]);
        if (low < high) {
            addStep(lm.quickSortCondition, currentArr, [], [], `low (${low}) < high (${high}). Proceed.`, [low, high]);
            
            const pi = partition(currentArr, low, high);
            addStep(lm.callPartition, currentArr, [], [], `Partition index pi = ${pi}`, [low, high], pi);

            addStep(lm.recursiveCallLeft, currentArr, [], [], `Recursive call for left part: [${low}..${pi-1}]`, [low, pi-1], null);
            quickSortRecursive(currentArr, low, pi - 1);
            
            addStep(lm.recursiveCallRight, currentArr, [], [], `Recursive call for right part: [${pi+1}..${high}]`, [pi+1, high], null);
            quickSortRecursive(currentArr, pi + 1, high);
        } else {
            addStep(lm.quickSortCondition, currentArr, [], [], `Base case: low (${low}) not < high (${high}). Return.`, [low, high]);
             // Mark elements in this base case range as sorted if not already
            for (let k_idx = low; k_idx <= high; k_idx++) {
                if (k_idx >=0 && k_idx < currentArr.length && !currentGlobalSortedIndices.includes(k_idx)) {
                    currentGlobalSortedIndices.push(k_idx);
                }
            }
        }
        addStep(lm.quickSortEnd, currentArr, [], [], `Finished quickSort for [${low}..${high}]`, [low, high]);
    }
    
    addStep(lm.initialCallComment, arr, [], [], "Initial call to Quick Sort for the whole array", [0, arr.length - 1]);
    quickSortRecursive(arr, 0, arr.length - 1);
    
    // Ensure all indices are marked sorted at the end
    for(let k=0; k < arr.length; k++) {
        if(!currentGlobalSortedIndices.includes(k)) currentGlobalSortedIndices.push(k);
    }
    currentGlobalSortedIndices.sort((a,b)=>a-b);
    addStep(lm.quickSortEnd, arr, [], [], "Array is sorted", null, null);
    return localSteps;
  }, []);

  
  const updateStateFromStep = useCallback((stepIndex: number) => {
    if (steps[stepIndex]) {
      const currentS = steps[stepIndex];
      setDisplayedData(currentS.array);
      setActiveIndices(currentS.activeIndices);
      setSwappingIndices(currentS.swappingIndices);
      setSortedIndices(currentS.sortedIndices);
      setCurrentLine(currentS.currentLine);
      setProcessingSubArrayRange(currentS.processingSubArrayRange || null);
      setPivotActualIndex(currentS.pivotActualIndex || null);
    }
  }, [steps]);

  useEffect(() => {
    const parsedData = parseInput(inputValue);
    if (parsedData !== null) {
      setInitialData(parsedData);
      let newSteps: AlgorithmStep[] = [];

      if (algorithm?.slug === 'bubble-sort') {
        newSteps = generateBubbleSortSteps(parsedData);
      } else if (algorithm?.slug === 'insertion-sort') {
        newSteps = generateInsertionSortSteps(parsedData);
      } else if (algorithm?.slug === 'merge-sort') {
        newSteps = generateMergeSortSteps(parsedData);
      } else if (algorithm?.slug === 'quick-sort') {
        newSteps = generateQuickSortSteps(parsedData);
      }
       else {
        setDisplayedData(parsedData);
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null);
        setSteps([]); 
      }
      
      if (isAlgoImplemented && newSteps.length > 0) {
        setSteps(newSteps);
        setCurrentStepIndex(0);
        updateStateFromStep(0);
      } else if (!isAlgoImplemented) {
         setDisplayedData(parsedData); 
      } else { 
        setSteps([]);
        setDisplayedData(parsedData);
        setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null);
      }
      setIsPlaying(false);
      setIsFinished(false);
    }
     if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, parseInput, generateBubbleSortSteps, generateInsertionSortSteps, generateMergeSortSteps, generateQuickSortSteps, algorithm, isAlgoImplemented]); 


  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length -1 && isAlgoImplemented) {
      animationTimeoutRef.current = setTimeout(() => {
        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);
        updateStateFromStep(nextStepIndex);
        if (nextStepIndex === steps.length - 1) {
          setIsPlaying(false);
          setIsFinished(true);
        }
      }, animationSpeed);
    } else if (isPlaying && currentStepIndex >= steps.length -1) {
        setIsPlaying(false);
        setIsFinished(true);
    }
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps, animationSpeed, updateStateFromStep, isAlgoImplemented]);


  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handlePlay = () => {
    if (isFinished || steps.length === 0 || currentStepIndex >= steps.length -1) {
      toast({ title: "Cannot Play", description: isFinished ? "Algorithm finished. Reset to play again." : "No data or steps to visualize.", variant: "default" });
      setIsPlaying(false);
      return;
    }
    if (!isAlgoImplemented) {
      toast({ title: "Visualizer Not Active", description: "This algorithm's interactive visualizer is not implemented yet.", variant: "default" });
      return;
    }
    setIsPlaying(true);
    setIsFinished(false); 
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  };

  const handleStep = () => {
    if (isFinished || steps.length === 0 || currentStepIndex >= steps.length -1) {
       toast({ title: "Cannot Step", description: isFinished ? "Algorithm finished. Reset to step again." : "No data or steps to visualize.", variant: "default" });
      return;
    }
     if (!isAlgoImplemented) {
      toast({ title: "Visualizer Not Active", description: "This algorithm's interactive visualizer is not implemented yet.", variant: "default" });
      return;
    }

    setIsPlaying(false); 
     if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStepIndex(nextStepIndex);
      updateStateFromStep(nextStepIndex);
      if (nextStepIndex === steps.length - 1) {
        setIsFinished(true);
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsFinished(false);
    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
    }

    const parsedData = parseInput(inputValue) || initialData; 
    let newSteps: AlgorithmStep[] = [];

    if (algorithm?.slug === 'bubble-sort') newSteps = generateBubbleSortSteps(parsedData);
    else if (algorithm?.slug === 'insertion-sort') newSteps = generateInsertionSortSteps(parsedData);
    else if (algorithm?.slug === 'merge-sort') newSteps = generateMergeSortSteps(parsedData);
    else if (algorithm?.slug === 'quick-sort') newSteps = generateQuickSortSteps(parsedData);

    if (isAlgoImplemented && newSteps.length > 0) {
        setSteps(newSteps);
        setCurrentStepIndex(0);
        updateStateFromStep(0);
    } else if (!isAlgoImplemented) {
        setDisplayedData(parsedData); setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null); setSteps([]);
    } else { 
        setDisplayedData(parsedData); setActiveIndices([]); setSwappingIndices([]); setSortedIndices([]); setCurrentLine(null);
        setProcessingSubArrayRange(null); setPivotActualIndex(null); setSteps([]);
    }
  };
  
  const handleSpeedChange = (speedValue: number) => {
    setAnimationSpeed(speedValue);
  };


  if (!algorithm) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Not Found</h1>
            <p className="text-muted-foreground text-lg">
              The visualizer for &quot;{algorithmSlug}&quot; could not be found.
            </p>
            <p className="text-muted-foreground mt-1">
              Please check the URL or navigate back to the visualizers page.
            </p>
        </main>
        <Footer />
      </div>
    );
  }

  const codeSnippetsToDisplay = algorithm.codeSnippets || { "Info": ["// Code snippets not available for this algorithm yet."] };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithm.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {algorithm.description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-3/5 xl:w-2/3">
            <VisualizationPanel 
              data={displayedData} 
              activeIndices={activeIndices}
              swappingIndices={swappingIndices}
              sortedIndices={sortedIndices}
              processingSubArrayRange={processingSubArrayRange}
              pivotActualIndex={pivotActualIndex}
            />
          </div>
          <div className="lg:w-2/5 xl:w-1/3">
            <CodePanel 
              codeSnippets={codeSnippetsToDisplay} 
              currentLine={currentLine}
              defaultLanguage={isAlgoImplemented ? "JavaScript" : undefined}
            />
          </div>
        </div>
        
        <div className="w-full">
          <ControlsPanel
            onPlay={handlePlay}
            onPause={handlePause}
            onStep={handleStep}
            onReset={handleReset}
            onInputChange={handleInputChange}
            inputValue={inputValue}
            isPlaying={isPlaying}
            isFinished={isFinished}
            currentSpeed={animationSpeed}
            onSpeedChange={handleSpeedChange}
            isAlgoImplemented={isAlgoImplemented}
            minSpeed={MIN_SPEED}
            maxSpeed={MAX_SPEED}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

    