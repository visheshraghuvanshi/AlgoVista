
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HuffmanStep, HuffmanFrequencyItem, HuffmanNodeForPQ, HuffmanCodeItem, BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from '@/types';
import { BinaryTreeVisualizationPanel } from '@/app/visualizers/binary-tree-traversal/BinaryTreeVisualizationPanel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface HuffmanCodingVisualizationPanelProps {
  step: HuffmanStep | null;
}

export function HuffmanCodingVisualizationPanel({ step }: HuffmanCodingVisualizationPanelProps) {
  if (!step) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Huffman Coding Visualization</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter text and start.</p></CardContent>
      </Card>
    );
  }

  const { phase, frequencies, priorityQueueState, huffmanCodes, nodes, edges, message, currentProcessingNodeId, activeNodeIds, mergedNodeId, currentPathForCode } = step;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Huffman Coding: {phase.replace('_', ' ').toUpperCase()}</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-3 p-2 md:p-4 bg-muted/10 dark:bg-muted/5 rounded-b-lg overflow-auto">
        
        {/* Frequency Display */}
        {frequencies && frequencies.length > 0 && (
          <div className="p-2 border rounded-md bg-background shadow">
            <h3 className="text-sm font-semibold mb-1">Frequencies:</h3>
            <div className="flex flex-wrap gap-2">
              {frequencies.map(f => (
                <Badge key={f.id} variant="secondary" className="font-code">'{f.char}': {f.freq}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Priority Queue Display */}
        {priorityQueueState && priorityQueueState.length > 0 && (
          <div className="p-2 border rounded-md bg-background shadow">
            <h3 className="text-sm font-semibold mb-1">Priority Queue (Conceptual - Min Freq First):</h3>
            <ScrollArea className="h-20">
              <div className="flex flex-col gap-1">
                {priorityQueueState.map(item => (
                  <Badge 
                    key={item.id} 
                    variant={activeNodeIds?.includes(item.id) || mergedNodeId === item.id ? 'default' : 'outline'}
                    className={`font-code text-xs ${activeNodeIds?.includes(item.id) ? 'bg-primary/80 text-primary-foreground' : ''} ${mergedNodeId === item.id ? 'bg-green-500/80 text-white' : ''}`}
                  >
                    {item.char ? `'${item.char}'` : 'Σ'}:{item.freq} (ID: ${item.id.split('-').pop()})
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Huffman Tree Display */}
        {(nodes && nodes.length > 0) && (
          <div className="p-2 border rounded-md bg-background shadow flex-1 min-h-[200px]">
            <h3 className="text-sm font-semibold mb-1">Huffman Tree:</h3>
            <BinaryTreeVisualizationPanel 
              nodes={nodes} 
              edges={edges || []} 
              traversalPath={currentPathForCode ? currentPathForCode.split('') : []} 
              currentProcessingNodeId={currentProcessingNodeId}
            />
          </div>
        )}

        {/* Generated Codes Display */}
        {huffmanCodes && huffmanCodes.length > 0 && (
          <div className="p-2 border rounded-md bg-background shadow">
            <h3 className="text-sm font-semibold mb-1">Generated Huffman Codes:</h3>
            <ScrollArea className="h-24">
              {huffmanCodes.map(code => (
                <div key={code.char} className="font-code text-xs">'{code.char}': {code.code}</div>
              ))}
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
