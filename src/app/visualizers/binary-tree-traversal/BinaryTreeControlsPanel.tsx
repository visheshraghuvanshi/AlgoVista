"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge, ListTree, Binary } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TraversalType } from './binary-tree-traversal-logic';
import { TRAVERSAL_TYPES } from './binary-tree-traversal-logic';

interface BinaryTreeControlsPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onTreeInputChange: (value: string) => void;
  treeInputValue: string;
  onTraversalTypeChange: (type: TraversalType) => void;
  selectedTraversalType: TraversalType;
  isPlaying: boolean;
  isFinished: boolean;
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  isAlgoImplemented: boolean;
  minSpeed: number;
  maxSpeed: number;
}

export function BinaryTreeControlsPanel({
  onPlay,
  onPause,
  onStep,
  onReset,
  onTreeInputChange,
  treeInputValue,
  onTraversalTypeChange,
  selectedTraversalType,
  isPlaying,
  isFinished,
  currentSpeed,
  onSpeedChange,
  minSpeed,
  maxSpeed,
  isAlgoImplemented,
}: BinaryTreeControlsPanelProps) {
  
  const handleTreeInputChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTreeInputChange(event.target.value);
  };

  const handleSpeedSliderChange = (value: number[]) => {
    onSpeedChange(value[0]);
  };

  const commonPlayDisabled = isFinished || treeInputValue.trim() === '' || !isAlgoImplemented;
  const commonStepDisabled = isPlaying || isFinished || treeInputValue.trim() === '' || !isAlgoImplemented;
  
  return (
    <Card className="shadow-xl rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Tree Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="treeInput" className="text-sm font-medium flex items-center">
              <Binary className="mr-2 h-4 w-4 text-muted-foreground" /> Tree (comma-sep, level-order, use 'null')
            </Label>
            <Input
              id="treeInput"
              type="text"
              value={treeInputValue}
              onChange={handleTreeInputChangeEvent}
              placeholder="e.g., 1,2,3,null,4,null,5"
              className="w-full text-base"
              aria-label="Tree input as comma-separated level-order string"
              disabled={isPlaying || !isAlgoImplemented}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="traversalType" className="text-sm font-medium flex items-center">
              <ListTree className="mr-2 h-4 w-4 text-muted-foreground" /> Traversal Type
            </Label>
            <Select
              value={selectedTraversalType}
              onValueChange={(value) => onTraversalTypeChange(value as TraversalType)}
              disabled={isPlaying || !isAlgoImplemented}
            >
              <SelectTrigger id="traversalType" className="w-full" aria-label="Select traversal type">
                <SelectValue placeholder="Select Traversal" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TRAVERSAL_TYPES).map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center justify-start">
            <Button
                onClick={onReset}
                variant="outline"
                disabled={isPlaying}
                aria-label="Reset algorithm and input"
            >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset Data & Algorithm
            </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {!isPlaying ? (
              <Button
                onClick={onPlay}
                disabled={commonPlayDisabled}
                aria-label="Play algorithm animation"
                className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90"
                size="lg"
              >
                <Play className="mr-2 h-5 w-5" /> Play
              </Button>
            ) : (
              <Button
                onClick={onPause}
                aria-label="Pause algorithm animation"
                className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90"
                size="lg"
                disabled={!isAlgoImplemented}
              >
                <Pause className="mr-2 h-5 w-5" /> Pause
              </Button>
            )}
            <Button
              onClick={onStep}
              variant="outline"
              disabled={commonStepDisabled}
              aria-label="Step forward in algorithm animation"
              size="lg"
            >
              <SkipForward className="mr-2 h-5 w-5" /> Step
            </Button>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
            <Label htmlFor="speedControl" className="text-sm font-medium flex items-center">
              <Gauge className="mr-2 h-4 w-4 text-muted-foreground" /> Animation Speed (Delay)
            </Label>
            <div className="flex items-center gap-2">
              <FastForward className="h-4 w-4 text-muted-foreground transform rotate-180" />
              <Slider
                id="speedControl"
                min={minSpeed}
                max={maxSpeed}
                step={50}
                value={[currentSpeed]}
                onValueChange={handleSpeedSliderChange}
                disabled={isPlaying || !isAlgoImplemented}
                className="flex-grow"
                aria-label="Animation speed control"
              />
              <FastForward className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground text-center">{currentSpeed} ms delay</p>
          </div>
        </div>
         {!isAlgoImplemented && (
          <p className="text-sm text-center text-amber-500 dark:text-amber-400">
            Interactive visualization for this algorithm is not yet implemented. Input and controls are disabled.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
