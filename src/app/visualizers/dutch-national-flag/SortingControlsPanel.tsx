
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import type { SortingControlsPanelProps } from './types'; // Local import

export function SortingControlsPanel({
  onPlay,
  onPause,
  onStep,
  onReset,
  onInputChange,
  inputValue,
  isPlaying,
  isFinished,
  currentSpeed,
  onSpeedChange,
  isAlgoImplemented,
  minSpeed,
  maxSpeed,
}: SortingControlsPanelProps) {
  const handleInputChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(event.target.value);
  };

  const handleSpeedSliderChange = (value: number[]) => {
    onSpeedChange(value[0]);
  };

  const commonPlayDisabled = isFinished || inputValue.trim() === '' || !isAlgoImplemented;
  const commonStepDisabled = isPlaying || isFinished || inputValue.trim() === '' || !isAlgoImplemented;

  return (
    <Card className="shadow-xl rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2 md:col-span-2"> 
            <Label htmlFor="customInput" className="text-sm font-medium">
              Input Array (comma-separated numbers)
            </Label>
            <Input
              id="customInput"
              type="text"
              value={inputValue}
              onChange={handleInputChangeEvent}
              placeholder="e.g., 0,1,2,0,1,2"
              className="w-full text-base"
              aria-label="Custom input for algorithm data"
              disabled={isPlaying || !isAlgoImplemented}
            />
          </div>
        </div>
         <div className="flex items-center justify-start">
            <Button
                onClick={onReset}
                variant="outline"
                disabled={isPlaying && isAlgoImplemented}
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

