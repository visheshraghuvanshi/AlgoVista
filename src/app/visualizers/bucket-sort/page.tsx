
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
// import { BucketSortCodePanel } from './BucketSortCodePanel'; // To be created if needed
import { SortingControlsPanel } from '@/components/algo-vista/sorting-controls-panel';
import { AlgorithmDetailsCard, type AlgorithmDetailsProps } from '@/components/algo-vista/AlgorithmDetailsCard';
import type { AlgorithmMetadata } from '@/types';
import { MOCK_ALGORITHMS } from '@/app/visualizers/page';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Construction, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";


// Placeholder for Bucket Sort specific code snippets
const BUCKET_SORT_CODE_SNIPPETS = {
  JavaScript: [
    "// Bucket Sort (JavaScript - Conceptual, using Insertion Sort for buckets)",
    "function insertionSortForBuckets(bucket) {",
    "  for (let i = 1; i < bucket.length; ++i) {",
    "    let key = bucket[i];",
    "    let j = i - 1;",
    "    while (j >= 0 && bucket[j] > key) {",
    "      bucket[j + 1] = bucket[j];",
    "      j = j - 1;",
    "    }",
    "    bucket[j + 1] = key;",
    "  }",
    "  return bucket;",
    "}",
    "",
    "function bucketSort(arr, numBuckets = 5) {",
    "  if (arr.length === 0) return [];",
    "",
    "  // 1) Create empty buckets",
    "  let buckets = new Array(numBuckets);",
    "  for (let i = 0; i < numBuckets; i++) {",
    "    buckets[i] = [];",
    "  }",
    "",
    "  // 2) Put array elements in different buckets",
    "  const maxVal = Math.max(...arr);",
    "  const minVal = Math.min(...arr);",
    "  const range = (maxVal - minVal) / numBuckets;",
    "",
    "  for (let i = 0; i < arr.length; i++) {",
    "    let bucketIndex = Math.floor((arr[i] - minVal) / range);",
    "    // Handle edge case for maxVal",
    "    if (bucketIndex >= numBuckets) bucketIndex = numBuckets - 1;",
    "    buckets[bucketIndex].push(arr[i]);",
    "  }",
    "",
    "  // 3) Sort individual buckets",
    "  for (let i = 0; i < numBuckets; i++) {",
    "    insertionSortForBuckets(buckets[i]);",
    "  }",
    "",
    "  // 4) Concatenate all buckets into arr[]",
    "  let index = 0;",
    "  for (let i = 0; i < numBuckets; i++) {",
    "    for (let j = 0; j < buckets[i].length; j++) {",
    "      arr[index++] = buckets[i][j];",
    "    }",
    "  }",
    "  return arr;",
    "}",
  ],
};

const ALGORITHM_SLUG = 'bucket-sort';

export default function BucketSortVisualizerPage() {
  const { toast } = useToast();
  const [algorithm, setAlgorithm] = useState<AlgorithmMetadata | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const foundAlgorithm = MOCK_ALGORITHMS.find(algo => algo.slug === ALGORITHM_SLUG);
    if (foundAlgorithm) {
      setAlgorithm(foundAlgorithm);
       toast({
            title: "Visualization Under Construction",
            description: `The interactive visualizer for ${foundAlgorithm.title} is not yet fully implemented. Showing details only.`,
            variant: "default",
        });
    } else {
      toast({ title: "Error", description: `Algorithm data for ${ALGORITHM_SLUG} not found.`, variant: "destructive" });
    }
  }, [toast]);

  const algoDetails: AlgorithmDetailsProps | null = algorithm ? {
    title: algorithm.title,
    description: algorithm.description,
    timeComplexities: { best: "O(n+k)", average: "O(n+k)", worst: "O(n²)" }, // k is num buckets, n elements. Worst if all in one bucket.
    spaceComplexity: "O(n+k)",
  } : null;

  if (!isClient) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground">Loading visualizer...</p>
            </main>
            <Footer />
        </div>
    );
  }

  if (!algorithm || !algoDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="font-headline text-3xl font-bold text-destructive mb-2">Algorithm Data Not Loaded</h1>
            <p className="text-muted-foreground text-lg">
              Could not load data for &quot;{ALGORITHM_SLUG}&quot;.
            </p>
            <Button asChild size="lg" className="mt-8">
                <Link href="/visualizers">Back to Visualizers</Link>
            </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-accent">
            {algorithm.title}
          </h1>
        </div>

        <div className="text-center my-10 p-6 border rounded-lg shadow-lg bg-card">
            <Construction className="mx-auto h-16 w-16 text-primary dark:text-accent mb-6" />
            <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Interactive Visualization Coming Soon!
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
                The interactive visualizer for {algorithm.title} is currently under construction.
                A proper visualization requires displaying multiple buckets and their sorting process, which is beyond our current simple bar chart.
                Please check back later! In the meantime, you can review the algorithm details below.
            </p>
        </div>
        
        <div className="lg:w-2/5 xl:w-1/3 mx-auto mb-6">
             <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                    <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
                        <Code2 className="mr-2 h-5 w-5" /> Conceptual Code (JavaScript)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
                    <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
                    <pre className="font-code text-sm p-4">
                        {BUCKET_SORT_CODE_SNIPPETS.JavaScript.map((line, index) => (
                        <div key={`js-line-${index}`} className="px-2 py-0.5 rounded text-foreground">
                            <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">
                            {index + 1}
                            </span>
                            {line}
                        </div>
                        ))}
                    </pre>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>

        <div className="w-full">
          <SortingControlsPanel
            onPlay={() => {}}
            onPause={() => {}}
            onStep={() => {}}
            onReset={() => {}}
            onInputChange={() => {}}
            inputValue={"(Under Construction)"}
            isPlaying={false}
            isFinished={true} // To disable controls
            currentSpeed={500}
            onSpeedChange={() => {}}
            isAlgoImplemented={false} // Disables controls
            minSpeed={100}
            maxSpeed={2000}
          />
        </div>
        <AlgorithmDetailsCard {...algoDetails} />
      </main>
      <Footer />
    </div>
  );
}
