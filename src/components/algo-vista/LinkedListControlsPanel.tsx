
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge, ListPlus, Trash2, SearchCode, Shuffle, GitMerge, LocateFixed, ListOrdered, CornerDownLeft, CornerUpRight, Milestone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export type LinkedListOperation = 
  | 'init'
  | 'insertHead' | 'insertTail' | 'insertAtPosition' 
  | 'deleteHead' | 'deleteTail' | 'deleteByValue' | 'deleteAtPosition'
  | 'search' 
  | 'reverse'
  | 'detectCycle'
  | 'merge' 
  | 'traverse';

export const ALL_OPERATIONS: { value: LinkedListOperation; label: string; icon?: React.ElementType, needsValue?: boolean, needsSecondList?: boolean, needsPosition?: boolean }[] = [
  { value: 'init', label: 'Initialize/Set List', icon: ListPlus },
  { value: 'insertHead', label: 'Insert Head', icon: CornerUpRight, needsValue: true },
  { value: 'insertTail', label: 'Insert Tail', icon: CornerDownLeft, needsValue: true },
  { value: 'insertAtPosition', label: 'Insert At Position', icon: Milestone, needsValue: true, needsPosition: true },
  // { value: 'deleteHead', label: 'Delete Head', icon: Trash2 }, 
  // { value: 'deleteTail', label: 'Delete Tail', icon: Trash2 },
  { value: 'deleteByValue', label: 'Delete by Value', icon: Trash2, needsValue: true },
  { value: 'deleteAtPosition', label: 'Delete At Position', icon: Trash2, needsPosition: true },
  { value: 'search', label: 'Search Value', icon: SearchCode, needsValue: true },
  { value: 'traverse', label: 'Traverse List', icon: FastForward },
  // { value: 'reverse', label: 'Reverse List', icon: Shuffle }, // Example for future
  // { value: 'detectCycle', label: 'Detect Cycle', icon: LocateFixed },  // Example for future
  // { value: 'merge', label: 'Merge Two Lists', icon: GitMerge, needsSecondList: true }, // Example for future
];

interface LinkedListControlsPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onOperationChange: (operation: LinkedListOperation, value?: string, positionOrSecondList?: string | number) => void;
  
  initialListValue: string;
  onInitialListValueChange: (value: string) => void;
  
  inputValue: string; 
  onInputValueChange: (value: string) => void;

  positionValue?: string; // For insert/delete at position
  onPositionValueChange?: (value: string) => void;
  
  secondListValue?: string; 
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
  positionValue, onPositionValueChange,
  secondListValue, onSecondListValueChange,
  selectedOperation, onSelectedOperationChange,
  availableOperations,
  isPlaying, isFinished, currentSpeed, onSpeedChange,
  isAlgoImplemented, minSpeed, maxSpeed,
}: LinkedListControlsPanelProps) {

  const currentOpDetails = ALL_OPERATIONS.find(op => op.value === selectedOperation);
  const showValueInput = currentOpDetails?.needsValue;
  const showPositionInput = currentOpDetails?.needsPosition;
  const showSecondListInput = currentOpDetails?.needsSecondList;

  const handleExecuteOperation = () => {
    if (selectedOperation) {
      let secondaryArg: string | number | undefined = undefined;
      if (showPositionInput && positionValue !== undefined) {
        const pos = parseInt(positionValue, 10);
        if (isNaN(pos)) {
          alert("Position must be a number."); // Replace with toast if available
          return;
        }
        secondaryArg = pos;
      } else if (showSecondListInput) {
        secondaryArg = secondListValue;
      }
      onOperationChange(selectedOperation, showValueInput ? inputValue : undefined, secondaryArg);
    }
  };

  const opsToDisplay = availableOperations 
    ? ALL_OPERATIONS.filter(op => availableOperations.includes(op.value))
    : ALL_OPERATIONS;

  const isExecuteDisabled = isPlaying || !isAlgoImplemented || !selectedOperation ||
    (showValueInput && inputValue.trim() === '') ||
    (showPositionInput && (!positionValue || positionValue.trim() === '' || isNaN(parseInt(positionValue, 10)) )) ||
    (showSecondListInput && (!secondListValue || secondListValue.trim() === '')) ||
    (selectedOperation === 'init');

  const isValueInputRelevant = showValueInput && selectedOperation !== 'init';
  const isPositionInputRelevant = showPositionInput && selectedOperation !== 'init';

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
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
          {isPositionInputRelevant && onPositionValueChange && (
             <div className="space-y-2">
                <Label htmlFor="positionInput" className="text-sm font-medium">Position (0-indexed)</Label>
                <Input
                    id="positionInput" type="number" value={positionValue}
                    onChange={(e) => onPositionValueChange(e.target.value)}
                    placeholder="Enter index"
                    min="0"
                    disabled={isPlaying || !isAlgoImplemented || !showPositionInput}
                />
             </div>
          )}
          {showSecondListInput && onSecondListValueChange && (
             <div className="space-y-2 md:col-span-full lg:col-span-1">
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

