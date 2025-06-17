
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import type { AlgorithmMetadata } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { Construction } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

const ALGORITHM_SLUG = 'stack-queue';

export default function StackQueueVisualizerPage() {
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    setAlgorithm(foundAlgorithm || null);
    if (foundAlgorithm) {
        toast({ title: "Coming Soon!", description: `The visualizer for ${foundAlgorithm.title} is under construction.`, variant: "default" });
    }
  }, [toast]);

  if (!algorithm) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
          <p className="text-muted-foreground">Loading algorithm details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <Construction className="mx-auto h-16 w-16 text-primary dark:text-accent mb-6" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {algorithm.title} Visualizer
          </h1>
          <p className="mt-6 text-xl text-muted-foreground mb-8">
            The interactive visualizer for {algorithm.title} is currently under construction.
            We're working hard to bring this feature to you soon!
          </p>
          <p className="mt-2 text-lg text-muted-foreground">{algorithm.description}</p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90">
            <Link href="/visualizers">
              Back to All Visualizers
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
