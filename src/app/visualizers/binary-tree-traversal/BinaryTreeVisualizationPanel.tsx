
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from '@/types';

interface BinaryTreeVisualizationPanelProps {
  nodes: BinaryTreeNodeVisual[];
  edges: BinaryTreeEdgeVisual[];
  traversalPath: (string | number)[];
  currentProcessingNodeId?: string | null;
}

const SVG_WIDTH = 500;
const SVG_HEIGHT_BASE = 200; // Base height, will adjust
const NODE_RADIUS = 15;
const ACCENT_COLOR_COMPARISON = "hsl(var(--primary))"; // For currently visiting node

export function BinaryTreeVisualizationPanel({
  nodes,
  edges,
  traversalPath,
  currentProcessingNodeId,
}: BinaryTreeVisualizationPanelProps) {
  
  const maxDepth = nodes.reduce((max, node) => Math.max(max, node.y), 0);
  const svgHeight = Math.max(SVG_HEIGHT_BASE, maxDepth + NODE_RADIUS * 2 + 20); // Ensure enough height

  const viewBox = `0 0 ${SVG_WIDTH} ${svgHeight}`;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Tree Visualization</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-4 space-y-4 overflow-hidden">
        <div className="flex-grow w-full border rounded-md bg-muted/10 dark:bg-muted/5 flex items-center justify-center overflow-auto relative">
          {nodes.length === 0 ? (
            <p className="text-muted-foreground self-center">Enter tree data to visualize.</p>
          ) : (
            <svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
              <g>
                {edges.map((edge) => {
                  const sourceNode = nodes.find(n => n.id === edge.sourceId);
                  const targetNode = nodes.find(n => n.id === edge.targetId);
                  if (!sourceNode || !targetNode) return null;
                  
                  return (
                    <line
                      key={edge.id}
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={edge.color || "hsl(var(--muted-foreground))"}
                      strokeWidth="1.5"
                    />
                  );
                })}
                {nodes.map((node) => (
                  <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r={NODE_RADIUS}
                      fill={node.id === currentProcessingNodeId ? ACCENT_COLOR_COMPARISON : node.color}
                      stroke="hsl(var(--border))"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      dy=".3em"
                      fontSize="10"
                      fill={node.color === ACCENT_COLOR_COMPARISON || (node.color && node.color.includes("primary")) ? "hsl(var(--primary-foreground))" : "hsl(var(--primary-foreground))"} // Adjust based on actual primary/accent colors
                      fontWeight="bold"
                    >
                      {node.value}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          )}
        </div>
        <div className="flex-shrink-0 p-2 border rounded-md bg-background">
            <p className="font-semibold text-muted-foreground text-sm">Traversal Path:</p>
            <p className="font-code text-xs break-all h-10 overflow-y-auto">
                {traversalPath.join(' \u2192 ') || '(Path will appear here)'}
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
