
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrieStep, TrieNodeVisual, TrieEdgeVisual } from '@/types';
import { Badge } from '@/components/ui/badge';

interface TrieVisualizationPanelProps {
  step: TrieStep | null;
}

const NODE_RADIUS = 15;
const SVG_PADDING = 20;
const LEVEL_HEIGHT = 70;

export function TrieVisualizationPanel({ step }: TrieVisualizationPanelProps) {
  if (!step || !step.nodes) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Trie Visualization</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Initialize Trie or perform an operation.</p></CardContent>
      </Card>
    );
  }

  const { nodes, edges, message, currentWord, currentCharIndex, currentNodeId, pathTakenIds, found, auxiliaryData } = step;
  const svgWidth = Math.max(600, nodes.reduce((max, n) => Math.max(max, n.x + NODE_RADIUS), 0) + SVG_PADDING);
  const svgHeight = Math.max(300, nodes.reduce((max, n) => Math.max(max, n.y + NODE_RADIUS), 0) + SVG_PADDING + (auxiliaryData?.insertedWords ? 50 : 0));


  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Trie Visualization</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
        {currentWord && <p className="text-xs text-muted-foreground">Word: "{currentWord}"{currentCharIndex !== undefined && currentCharIndex >= 0 ? ` | Char: '${currentWord[currentCharIndex]}' (idx ${currentCharIndex})` : ''}</p>}
        {found !== undefined && <p className={`text-sm font-semibold ${found ? 'text-green-500' : 'text-red-500'}`}>Result: {found ? 'Found' : 'Not Found'}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-start bg-muted/10 dark:bg-muted/5 p-2 rounded-b-lg overflow-auto space-y-2">
        <div className="w-full h-[300px] md:h-[350px] border rounded-md overflow-auto bg-background">
          {nodes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
                 <p className="text-muted-foreground">Trie is empty. Insert words.</p>
            </div>
           
          ) : (
            <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              <defs>
                <marker id="trie-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,4 L6,2 z" fill="hsl(var(--muted-foreground))" />
                </marker>
                 <marker id="trie-arrow-path" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,4 L6,2 z" fill="hsl(var(--accent))" />
                </marker>
              </defs>
              {edges.map(edge => {
                const sourceNode = nodes.find(n => n.id === edge.sourceId);
                const targetNode = nodes.find(n => n.id === edge.targetId);
                if (!sourceNode || !targetNode) return null;
                
                // Calculate end point of line for arrow
                const dx = targetNode.x - sourceNode.x;
                const dy = targetNode.y - sourceNode.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const endX = targetNode.x - (dx/dist) * NODE_RADIUS;
                const endY = targetNode.y - (dy/dist) * NODE_RADIUS;
                
                const isPathEdge = pathTakenIds?.includes(sourceNode.id) && pathTakenIds?.includes(targetNode.id);

                return (
                  <line
                    key={edge.id}
                    x1={sourceNode.x} y1={sourceNode.y}
                    x2={endX} y2={endY}
                    stroke={isPathEdge ? "hsl(var(--accent))" : (edge.color || "hsl(var(--muted-foreground))")}
                    strokeWidth="1.5"
                    markerEnd={isPathEdge ? "url(#trie-arrow-path)" : "url(#trie-arrow)"}
                  />
                );
              })}
              {nodes.map(node => (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  <circle
                    cx="0" cy="0" r={NODE_RADIUS}
                    fill={node.color}
                    stroke={node.isEndOfWord ? "hsl(var(--ring))" : "hsl(var(--border))"}
                    strokeWidth={node.isEndOfWord ? 2 : 1}
                  />
                  <text
                    x="0" y="0"
                    textAnchor="middle" dy=".3em"
                    fontSize="10px" fill={node.textColor || "hsl(var(--foreground))"}
                    className="font-semibold"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          )}
        </div>
         {auxiliaryData?.insertedWords && auxiliaryData.insertedWords.length > 0 && (
            <div className="w-full p-2 border rounded-md bg-background mt-2">
                <p className="text-xs font-semibold text-muted-foreground">Words in Trie:</p>
                <div className="flex flex-wrap gap-1 text-xs">
                    {auxiliaryData.insertedWords.map((w, i) => <Badge key={i} variant="outline">{w}</Badge>)}
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

