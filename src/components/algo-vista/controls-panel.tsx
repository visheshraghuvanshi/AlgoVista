"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ControlsPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onInputChange: (value: string) => void;
  inputValue: string;
  isPlaying: boolean;
  isFinished: boolean;
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
    <Card className="shadow-lg rounded-lg mt-4">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Controls & Input</CardTitle>
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
              className="w-full"
              aria-label="Custom input for algorithm data"
              disabled={isPlaying}
            />
          </div>
          <Button onClick={onReset} variant="outline" disabled={isPlaying} aria-label="Reset algorithm and input">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {!isPlaying ? (
            <Button onClick={onPlay} disabled={isFinished || inputValue.trim() === ''} aria-label="Play algorithm animation" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Play className="mr-2 h-4 w-4" /> Play
            </Button>
          ) : (
            <Button onClick={onPause} aria-label="Pause algorithm animation" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Pause className="mr-2 h-4 w-4" /> Pause
            </Button>
          )}
          <Button onClick={onStep} variant="outline" disabled={isPlaying || isFinished || inputValue.trim() === ''} aria-label="Step forward in algorithm animation">
            <SkipForward className="mr-2 h-4 w-4" /> Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
