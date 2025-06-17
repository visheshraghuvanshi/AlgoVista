
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from '@/types';
import { RBT_NODE_COLORS, RBT_TEXT_COLORS } from '@/app/visualizers/red-black-tree/rbt-node-colors'; 

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
const PATH_COLOR_TRAVERSAL = "hsl(var(--primary)/0.6)"; 

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
    // If traversalPath contains values, we need to check against node.value
    // If it contains IDs, we check against node.id
    // Assuming traversalPath contains node *values* as per TreeAlgorithmStep type
    return traversalPath.includes(node.value!); 
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
                  let fill = node.color || "hsl(var(--secondary))"; 
                  let textColor = node.textColor || "hsl(var(--primary-foreground))";

                  if (node.nodeColor === 'RED') {
                    fill = RBT_NODE_COLORS.RED;
                    textColor = RBT_TEXT_COLORS.RED_TEXT;
                  } else if (node.nodeColor === 'BLACK') {
                    fill = RBT_NODE_COLORS.BLACK;
                    textColor = RBT_TEXT_COLORS.BLACK_TEXT;
                  }
                  
                  if (node.id === currentProcessingNodeId && fill !== RBT_NODE_COLORS.FOUND_HIGHLIGHT) {
                     fill = ACCENT_COLOR_COMPARISON; 
                     // Ensure text color is readable on primary accent
                     textColor = "hsl(var(--primary-foreground))";
                  } else if (fill === RBT_NODE_COLORS.FOUND_HIGHLIGHT) {
                     textColor = RBT_TEXT_COLORS.FOUND_HIGHLIGHT_TEXT;
                  } else if (isNodeInTraversalPath(node.id) && node.id !== currentProcessingNodeId && !node.nodeColor && node.color !== ACCENT_COLOR_COMPARISON && !node.color?.includes("accent")) {
                     // Using a specific path color for nodes in traversalPath, but don't override active/RBT/found colors
                     // fill = PATH_COLOR_TRAVERSAL;
                     // textColor = "hsl(var(--primary-foreground))";
                     // This part is tricky, as node.color might already be set by the logic
                     // If logic sets a path color explicitly, it will be used.
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
                        {node.value}
                      </text>
                       {node.nodeColor && ( // RBT specific color text
                        <text
                          x="0"
                          y={NODE_RADIUS + 10} 
                          textAnchor="middle"
                          fontSize="8"
                          fill={node.nodeColor === 'RED' ? RBT_NODE_COLORS.RED : RBT_NODE_COLORS.BLACK}
                        >
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          )}
        </div>
        <div className="flex-shrink-0 p-2 border rounded-md bg-background">
            <p className="font-semibold text-muted-foreground text-sm">Traversal/Search Path:</p>
            <p className="font-code text-xs break-all h-10 overflow-y-auto">
                {traversalPath.join(' \u2192 ') || '(Path will appear here)'}
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
