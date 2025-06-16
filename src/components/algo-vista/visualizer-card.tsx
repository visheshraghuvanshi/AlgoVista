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
  const difficultyColors: Record<AlgorithmMetadata['difficulty'], string> = {
    Easy: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50",
    Medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50",
    Hard: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50",
  };

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.03] bg-primary text-accent dark:bg-accent dark:text-accent-foreground border-border rounded-xl overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="font-headline text-2xl text-primary-foreground dark:text-accent-foreground">{algorithm.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-accent/50 text-accent dark:border-primary/50 dark:text-primary">
            {algorithm.category}
          </Badge>
          <Badge variant="outline" className={`${difficultyColors[algorithm.difficulty]}`}>
            {algorithm.difficulty}
          </Badge>
        </div>
        {/* Description inherits text color from Card component: text-accent in light, dark:text-accent-foreground in dark */}
        <CardDescription className="line-clamp-3">{algorithm.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90">
          <Link href={`/visualizers/${algorithm.slug}`}>
            Start Visualizing <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
