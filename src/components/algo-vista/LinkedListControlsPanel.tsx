
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge, ListPlus, Trash2, SearchCode, Shuffle, GitMerge, LocateFixed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export type LinkedListOperation = 
  | 'init'
  | 'insertHead' | 'insertTail' | 'insertAtPosition' 
  | 'deleteHead' | 'deleteTail' | 'deleteByValue' | 'deleteAtPosition'
  | 'search' 
  | 'reverse'
  | 'detectCycle'
  | 'merge' // For merging two sorted lists
  | 'traverse';

export const ALL_OPERATIONS: { value: LinkedListOperation; label: string; icon?: React.ElementType, needsValue?: boolean, needsSecondList?: boolean, needsPosition?: boolean }[] = [
  { value: 'init', label: 'Initialize/Set List', icon: ListPlus }, // Does not need extra value input here, uses initialListValue
  { value: 'insertHead', label: 'Insert Head', icon: ListPlus, needsValue: true },
  { value: 'insertTail', label: 'Insert Tail', icon: ListPlus, needsValue: true },
  // { value: 'insertAtPosition', label: 'Insert At Position', icon: ListPlus, needsValue: true, needsPosition: true },
  // { value: 'deleteHead', label: 'Delete Head', icon: Trash2 }, // No value needed
  // { value: 'deleteTail', label: 'Delete Tail', icon: Trash2 }, // No value needed
  { value: 'deleteByValue', label: 'Delete by Value', icon: Trash2, needsValue: true },
  // { value: 'deleteAtPosition', label: 'Delete At Position', icon: Trash2, needsPosition: true },
  { value: 'search', label: 'Search Value', icon: SearchCode, needsValue: true },
  { value: 'traverse', label: 'Traverse List', icon: FastForward },
  // The following are more specialized and might be handled by their own visualizers/control panels
  // { value: 'reverse', label: 'Reverse List', icon: Shuffle },
  // { value: 'detectCycle', label: 'Detect Cycle', icon: LocateFixed }, 
  // { value: 'merge', label: 'Merge Two Lists', icon: GitMerge, needsSecondList: true },
];

interface LinkedListControlsPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onOperationChange: (operation: LinkedListOperation, value?: string, secondListValue?: string, position?: number) => void;
  
  initialListValue: string;
  onInitialListValueChange: (value: string) => void;
  
  inputValue: string; // For single value inputs (insert, delete, search)
  onInputValueChange: (value: string) => void;
  
  secondListValue?: string; // For merge operation
  onSecondListValueChange?: (value: string) => void;

  selectedOperation: LinkedListOperation | null;
  onSelectedOperationChange: (operation: LinkedListOperation) => void;
  
  availableOperations?: LinkedListOperation[]; 

  isPlaying: boolean;
  isFinished: boolean;
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  isAlgoImplemented: boolean; 
  minSpeed: number;
  maxSpeed: number;
}

export function LinkedListControlsPanel({
  onPlay, onPause, onStep, onReset, onOperationChange,
  initialListValue, onInitialListValueChange,
  inputValue, onInputValueChange,
  secondListValue, onSecondListValueChange,
  selectedOperation, onSelectedOperationChange,
  availableOperations,
  isPlaying, isFinished, currentSpeed, onSpeedChange,
  isAlgoImplemented, minSpeed, maxSpeed,
}: LinkedListControlsPanelProps) {

  const currentOpDetails = ALL_OPERATIONS.find(op => op.value === selectedOperation);
  const showValueInput = currentOpDetails?.needsValue;
  const showSecondListInput = currentOpDetails?.needsSecondList;

  const handleExecuteOperation = () => {
    if (selectedOperation) {
      onOperationChange(selectedOperation, showValueInput ? inputValue : undefined, showSecondListInput ? secondListValue : undefined);
    }
  };

  const opsToDisplay = availableOperations 
    ? ALL_OPERATIONS.filter(op => availableOperations.includes(op.value))
    : ALL_OPERATIONS;

  // Disable execute if operation doesn't need value OR if it does and value is empty
  const isExecuteDisabled = isPlaying || !isAlgoImplemented || !selectedOperation ||
    (showValueInput && inputValue.trim() === '') ||
    (showSecondListInput && (!secondListValue || secondListValue.trim() === '')) ||
    (selectedOperation === 'init'); // 'init' is handled by initialListValue change

  const isValueInputRelevant = showValueInput && selectedOperation !== 'init';

  return (
    <Card className="shadow-xl rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & List Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="initialListInput" className="text-sm font-medium">
              Current/Initial List (comma-separated, e.g., 1,2,3)
            </Label>
            <Input
              id="initialListInput"
              type="text"
              value={initialListValue}
              onChange={(e) => onInitialListValueChange(e.target.value)}
              placeholder="e.g., 1,2,3,4,5"
              className="w-full text-base"
              disabled={isPlaying || !isAlgoImplemented}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="operationSelect" className="text-sm font-medium">Select Operation</Label>
            <Select 
              value={selectedOperation || ""} 
              onValueChange={(val) => onSelectedOperationChange(val as LinkedListOperation)}
              disabled={isPlaying || !isAlgoImplemented}
            >
              <SelectTrigger id="operationSelect">
                <SelectValue placeholder="Choose an operation" />
              </SelectTrigger>
              <SelectContent>
                {opsToDisplay.map(op => (
                  <SelectItem key={op.value} value={op.value}>
                    <div className="flex items-center">
                      {op.icon && <op.icon className="mr-2 h-4 w-4" />}
                      {op.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isValueInputRelevant && (
            <div className="space-y-2">
              <Label htmlFor="valueInput" className="text-sm font-medium">Value</Label>
              <Input
                id="valueInput" type="text" value={inputValue}
                onChange={(e) => onInputValueChange(e.target.value)}
                placeholder="Enter value"
                disabled={isPlaying || !isAlgoImplemented || !showValueInput}
              />
            </div>
          )}
          {showSecondListInput && onSecondListValueChange && (
             <div className="space-y-2 md:col-span-2"> {/* Span to take full width if only this extra input */}
                <Label htmlFor="secondListInput" className="text-sm font-medium">Second List (for Merge)</Label>
                <Input
                    id="secondListInput" type="text" value={secondListValue}
                    onChange={(e) => onSecondListValueChange(e.target.value)}
                    placeholder="e.g., 6,7,8"
                    disabled={isPlaying || !isAlgoImplemented}
                />
             </div>
          )}
        </div>
        
        <Button onClick={handleExecuteOperation} disabled={isExecuteDisabled} className="w-full md:w-auto">
          Execute {selectedOperation ? ALL_OPERATIONS.find(op=>op.value===selectedOperation)?.label : ''}
        </Button>
        
        <div className="flex items-center justify-start pt-4 border-t">
            <Button onClick={onReset} variant="outline" disabled={isPlaying && isAlgoImplemented} aria-label="Reset full visualization and inputs">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset All
            </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {!isPlaying ? (
              <Button onClick={onPlay} disabled={isFinished || !isAlgoImplemented || !selectedOperation || steps.length <=1} className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90" size="lg">
                <Play className="mr-2 h-5 w-5" /> Play Steps
              </Button>
            ) : (
              <Button onClick={onPause} disabled={!isAlgoImplemented} className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90" size="lg">
                <Pause className="mr-2 h-5 w-5" /> Pause
              </Button>
            )}
            <Button onClick={onStep} variant="outline" disabled={isPlaying || isFinished || !isAlgoImplemented || !selectedOperation || steps.length <=1} size="lg">
              <SkipForward className="mr-2 h-5 w-5" /> Step
            </Button>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
            <Label htmlFor="speedControl" className="text-sm font-medium flex items-center">
              <Gauge className="mr-2 h-4 w-4 text-muted-foreground" /> Animation Speed
            </Label>
            <div className="flex items-center gap-2">
              <FastForward className="h-4 w-4 text-muted-foreground transform rotate-180" />
              <Slider
                id="speedControl" min={minSpeed} max={maxSpeed} step={50}
                value={[currentSpeed]} onValueChange={(val) => onSpeedChange(val[0])}
                disabled={isPlaying || !isAlgoImplemented} className="flex-grow"
              />
              <FastForward className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground text-center">{currentSpeed} ms delay</p>
          </div>
        </div>
        {!isAlgoImplemented && (
          <p className="text-sm text-center text-amber-500 dark:text-amber-400">
            Interactive visualization for this specific list type/operation is under construction.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

