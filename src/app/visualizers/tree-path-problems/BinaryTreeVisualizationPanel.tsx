
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from './types'; // Local import

interface BinaryTreeVisualizationPanelProps {
  nodes: BinaryTreeNodeVisual[];
  edges: BinaryTreeEdgeVisual[];
  traversalPath: (string | number)[]; 
  currentProcessingNodeId?: string | null;
}

const SVG_WIDTH = 600; 
const SVG_HEIGHT_BASE = 250; 
const NODE_RADIUS = 18; 
const ACCENT_COLOR_COMPARISON = "hsl(var(--primary))"; 

export function BinaryTreeVisualizationPanel({
  nodes,
  edges,
  traversalPath, 
  currentProcessingNodeId,
}: BinaryTreeVisualizationPanelProps) {
  
  const maxDepthY = nodes.reduce((max, node) => Math.max(max, node.y), 0);
  const svgHeight = Math.max(SVG_HEIGHT_BASE, maxDepthY + NODE_RADIUS * 2 + 40); 

  const viewBox = `0 0 ${SVG_WIDTH} ${svgHeight}`;

  const isNodeInTraversalPath = (nodeId: string | null) => {
    if (!nodeId) return false;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return false;
    // For path sum, traversalPath might hold node IDs instead of values, depending on logic
    // If it holds values, this check is fine. If IDs, adjust accordingly.
    return traversalPath.some(p => p === node.id || p === node.value);
  };

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
                  
                  let strokeColor = edge.color || "hsl(var(--muted-foreground))";
                  if (isNodeInTraversalPath(sourceNode.id) && isNodeInTraversalPath(targetNode.id)) {
                    // If both nodes of an edge are in the current path, highlight the edge
                    strokeColor = "hsl(var(--primary)/0.7)";
                  }
                  
                  return (
                    <line
                      key={edge.id}
                      x1={sourceNode.x}
                      y1={sourceNode.y + NODE_RADIUS} 
                      x2={targetNode.x}
                      y2={targetNode.y - NODE_RADIUS} 
                      stroke={strokeColor}
                      strokeWidth="1.5"
                    />
                  );
                })}
                {nodes.map((node) => {
                  let fill = node.color || "hsl(var(--secondary))"; // Default
                  let textColor = node.textColor || "hsl(var(--primary-foreground))";

                  if (isNodeInTraversalPath(node.id) && node.id !== currentProcessingNodeId) {
                    fill = "hsl(var(--primary)/0.6)"; 
                  }
                  if (node.id === currentProcessingNodeId) {
                    fill = ACCENT_COLOR_COMPARISON;
                  }
                   if (node.color === "hsl(var(--success))") { // Specific for found path
                        fill = "hsl(var(--success))";
                        textColor = "hsl(var(--success-foreground))";
                    }


                  return (
                    <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                      <circle
                        cx="0"
                        cy="0"
                        r={NODE_RADIUS}
                        fill={fill}
                        stroke="hsl(var(--border))"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        dy=".3em"
                        fontSize="10"
                        fill={textColor}
                        fontWeight="bold"
                        className="select-none"
                      >
                        {node.value === null ? 'NIL' : String(node.value)}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          )}
        </div>
        <div className="flex-shrink-0 p-2 border rounded-md bg-background">
            <p className="font-semibold text-muted-foreground text-sm">Current Path (Values):</p>
            <p className="font-code text-xs break-all h-10 overflow-y-auto">
                {traversalPath.map(v => String(v)).join(' \u2192 ') || '(Path will appear here)'}
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
