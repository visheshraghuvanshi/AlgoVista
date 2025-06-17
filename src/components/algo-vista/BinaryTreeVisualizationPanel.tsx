
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from '@/types';
import { RBT_NODE_COLORS, RBT_TEXT_COLORS } from '@/app/visualizers/red-black-tree/rbt-node-colors'; // Import RBT specific colors

interface BinaryTreeVisualizationPanelProps {
  nodes: BinaryTreeNodeVisual[];
  edges: BinaryTreeEdgeVisual[];
  traversalPath: (string | number)[];
  currentProcessingNodeId?: string | null;
}

const SVG_WIDTH = 600; // Increased width slightly
const SVG_HEIGHT_BASE = 250; // Base height, will adjust
const NODE_RADIUS = 18; // Slightly larger nodes
const ACCENT_COLOR_COMPARISON = "hsl(var(--primary))";

export function BinaryTreeVisualizationPanel({
  nodes,
  edges,
  traversalPath,
  currentProcessingNodeId,
}: BinaryTreeVisualizationPanelProps) {
  
  const maxDepth = nodes.reduce((max, node) => Math.max(max, node.y), 0);
  const svgHeight = Math.max(SVG_HEIGHT_BASE, maxDepth + NODE_RADIUS * 2 + 40); // Ensure enough height + buffer for labels

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
                      y1={sourceNode.y + NODE_RADIUS} // Start from bottom of parent
                      x2={targetNode.x}
                      y2={targetNode.y - NODE_RADIUS} // End at top of child
                      stroke={edge.color || "hsl(var(--muted-foreground))"}
                      strokeWidth="1.5"
                    />
                  );
                })}
                {nodes.map((node) => {
                  // Determine fill and text color based on RBT color or general highlight
                  let fill = node.color; // Default to general highlight/state color
                  let textColor = "hsl(var(--primary-foreground))"; // Default for general highlights

                  if (node.nodeColor === 'RED') {
                    fill = RBT_NODE_COLORS.RED;
                    textColor = RBT_TEXT_COLORS.RED_TEXT;
                  } else if (node.nodeColor === 'BLACK') {
                    fill = RBT_NODE_COLORS.BLACK;
                    textColor = RBT_TEXT_COLORS.BLACK_TEXT;
                  }
                  
                  // Override with active processing highlight if applicable
                  if (node.id === currentProcessingNodeId && node.color !== RBT_NODE_COLORS.FOUND_HIGHLIGHT) {
                     fill = ACCENT_COLOR_COMPARISON; // Generic active processing
                     textColor = "hsl(var(--primary-foreground))";
                  } else if (node.color === RBT_NODE_COLORS.FOUND_HIGHLIGHT) {
                     fill = RBT_NODE_COLORS.FOUND_HIGHLIGHT;
                     textColor = RBT_TEXT_COLORS.FOUND_HIGHLIGHT_TEXT;
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
                      >
                        {/* For RBT, value might be formatted to include height/balance factor */}
                        {/* This assumes node.value is already formatted by the logic file if needed */}
                        {node.value}
                      </text>
                      {/* Optional: Display color explicitly for RBT if not clear from fill */}
                       {node.nodeColor && (
                        <text
                          x="0"
                          y={NODE_RADIUS + 10} // Position below the node
                          textAnchor="middle"
                          fontSize="8"
                          fill={node.nodeColor === 'RED' ? RBT_NODE_COLORS.RED : RBT_NODE_COLORS.BLACK}
                        >
                          {/* {node.nodeColor} */}
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
