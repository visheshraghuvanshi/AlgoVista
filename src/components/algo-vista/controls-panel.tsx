
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, SkipForward, RotateCcw, Shuffle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Slider } from "@/components/ui/slider"; // For speed control later

interface ControlsPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onInputChange: (value: string) => void;
  // onSpeedChange: (speed: number) => void; // For later
  // onRandomize: () => void; // For later
  inputValue: string;
  isPlaying: boolean;
  isFinished: boolean;
  // currentSpeed: number; // For later
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
}: ControlsPanelProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(event.target.value);
  };

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
              onChange={handleInputChange}
              placeholder="e.g., 5,2,8,1,9"
              className="w-full text-base"
              aria-label="Custom input for algorithm data"
              disabled={isPlaying}
            />
          </div>
          {/* <Button onClick={onRandomize} variant="outline" disabled={isPlaying} aria-label="Randomize input">
            <Shuffle className="mr-2 h-4 w-4" /> Randomize
          </Button> */}
          <Button onClick={onReset} variant="outline" disabled={isPlaying} aria-label="Reset algorithm and input">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {!isPlaying ? (
                <Button 
                    onClick={onPlay} 
                    disabled={isFinished || inputValue.trim() === ''} 
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
                >
                <Pause className="mr-2 h-5 w-5" /> Pause
                </Button>
            )}
            <Button 
                onClick={onStep} 
                variant="outline" 
                disabled={isPlaying || isFinished || inputValue.trim() === ''} 
                aria-label="Step forward in algorithm animation"
                size="lg"
            >
                <SkipForward className="mr-2 h-5 w-5" /> Step
            </Button>
            </div>
            {/* Speed Slider - Placeholder for future implementation
            <div className="w-full sm:w-1/3 space-y-2">
                <Label htmlFor="speedControl" className="text-sm font-medium">Animation Speed</Label>
                <Slider
                id="speedControl"
                defaultValue={[1]}
                max={3}
                step={0.5}
                min={0.5}
                onValueChange={(value) => onSpeedChange(value[0])}
                disabled={isPlaying}
                />
            </div>
            */}
        </div>
      </CardContent>
    </Card>
  );
}

