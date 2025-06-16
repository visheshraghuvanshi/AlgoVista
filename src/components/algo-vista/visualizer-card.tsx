
"use client";

import type { AlgorithmMetadata } from '@/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface VisualizerCardProps {
  algorithm: AlgorithmMetadata;
}

export function VisualizerCard({ algorithm }: VisualizerCardProps) {
  // Updated difficultyColors to avoid yellow in light mode for "Medium"
  const difficultyColors: Record<AlgorithmMetadata['difficulty'], string> = {
    Easy: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50",
    Medium: "bg-blue-500/20 text-blue-700 dark:bg-yellow-500/20 dark:text-yellow-400 border-blue-500/50 dark:border-yellow-500/50", // Blue for light, Yellow for dark
    Hard: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50",
  };

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.03] bg-card text-card-foreground border-border rounded-xl overflow-hidden">
      <CardHeader className="pb-3">
        {/* Light: Burgundy Title. Dark: Yellow Title. */}
        <CardTitle className="font-headline text-2xl text-primary dark:text-accent">{algorithm.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex flex-wrap gap-2">
          {/* Category Badge */}
          {/* Light: Burgundy. Dark: Yellow. */}
          <Badge variant="outline" className="border-primary/50 text-primary dark:border-accent/50 dark:text-accent">
            {algorithm.category}
          </Badge>
          {/* Difficulty Badge - uses updated color scheme */}
          <Badge variant="outline" className={`${difficultyColors[algorithm.difficulty]}`}>
            {algorithm.difficulty}
          </Badge>
        </div>
        {/* Description: Inherits card-foreground (Dark text in Light Mode, Light text in Dark Mode) */}
        <CardDescription className="line-clamp-3">{algorithm.description}</CardDescription>
      </CardContent>
      <CardFooter>
        {/* Button */}
        {/* Light: Burgundy button. Dark: Yellow button. */}
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90">
          <Link href={`/visualizers/${algorithm.slug}`}>
            Start Visualizing <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
