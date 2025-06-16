
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, SkipForward, RotateCcw, FastForward, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider"; 

interface ControlsPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onInputChange: (value: string) => void;
  inputValue: string;
  isPlaying: boolean;
  isFinished: boolean;
  currentSpeed: number; 
  onSpeedChange: (speed: number) => void;
  isAlgoImplemented: boolean;
  minSpeed: number;
  maxSpeed: number;
}

export function ControlsPanel({
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
}: ControlsPanelProps) {
  const handleInputChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(event.target.value);
  };

  const handleSpeedSliderChange = (value: number[]) => {
    onSpeedChange(value[0]);
  };

  // Convert speed (delay ms) to a slider value (e.g. 0-100 or a descriptive range)
  // Higher slider value means slower animation (longer delay)
  // Let's make slider value directly represent the delay in ms for simplicity with Shadcn slider
  // The Shadcn slider gives an array, so we take value[0]

  return (
    <Card className="shadow-xl rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Controls & Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-grow space-y-2">
            <Label htmlFor="customInput" className="text-sm font-medium">
              Custom Input (comma-separated numbers, e.g., 5,2,8,1,9)
            </Label>
            <Input
              id="customInput"
              type="text"
              value={inputValue}
              onChange={handleInputChangeEvent}
              placeholder="e.g., 5,2,8,1,9"
              className="w-full text-base"
              aria-label="Custom input for algorithm data"
              disabled={isPlaying || !isAlgoImplemented}
            />
          </div>
          <Button onClick={onReset} variant="outline" disabled={isPlaying && isAlgoImplemented} aria-label="Reset algorithm and input">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {!isPlaying ? (
                <Button 
                    onClick={onPlay} 
                    disabled={isFinished || inputValue.trim() === '' || !isAlgoImplemented} 
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
                disabled={isPlaying || isFinished || inputValue.trim() === '' || !isAlgoImplemented} 
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
                        step={50} // Adjust step for finer control if needed
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
