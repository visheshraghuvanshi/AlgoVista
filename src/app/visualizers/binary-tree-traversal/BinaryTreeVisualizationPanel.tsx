
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from '@/types';
import { RBT_NODE_COLORS, RBT_TEXT_COLORS } from '@/app/visualizers/red-black-tree/rbt-node-colors'; // Import RBT specific colors

interface BinaryTreeVisualizationPanelProps {
  nodes: BinaryTreeNodeVisual[];
  edges: BinaryTreeEdgeVisual[];
  traversalPath: (string | number)[]; // Can be node IDs or values
  currentProcessingNodeId?: string | null;
}

const SVG_WIDTH = 600; 
const SVG_HEIGHT_BASE = 250; 
const NODE_RADIUS = 18; 
const ACCENT_COLOR_COMPARISON = "hsl(var(--primary))"; // General active node
const PATH_COLOR_TRAVERSAL = "hsl(var(--primary)/0.6)"; // Color for nodes in traversal path

export function BinaryTreeVisualizationPanel({
  nodes,
  edges,
  traversalPath, // Expecting node IDs or values that are part of the current traversal path
  currentProcessingNodeId,
}: BinaryTreeVisualizationPanelProps) {
  
  const maxDepthY = nodes.reduce((max, node) => Math.max(max, node.y), 0);
  const svgHeight = Math.max(SVG_HEIGHT_BASE, maxDepthY + NODE_RADIUS * 2 + 40); 

  const viewBox = `0 0 ${SVG_WIDTH} ${svgHeight}`;

  // Helper to check if a node is part of the current traversal path
  // This assumes traversalPath contains node values. If it contains IDs, adjust accordingly.
  const isNodeInTraversalPath = (nodeValue: string | number | null) => {
    if (nodeValue === null) return false;
    return traversalPath.includes(nodeValue);
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
                  // If both source and target are in traversal path, color edge differently
                  if (isNodeInTraversalPath(sourceNode.value) && isNodeInTraversalPath(targetNode.value) && (sourceNode.id === currentProcessingNodeId || targetNode.id === currentProcessingNodeId )) {
                     // This condition might need refinement based on exact path logic
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
                     textColor = "hsl(var(--primary-foreground))";
                  } else if (fill === RBT_NODE_COLORS.FOUND_HIGHLIGHT) {
                     textColor = RBT_TEXT_COLORS.FOUND_HIGHLIGHT_TEXT;
                  } else if (isNodeInTraversalPath(node.value) && node.id !== currentProcessingNodeId && !node.nodeColor && !node.color?.includes("accent")) {
                     // Don't override RBT/found colors with path color unless explicitly active
                     // fill = PATH_COLOR_TRAVERSAL;
                     // textColor = "hsl(var(--primary-foreground))";
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
                        {node.value}
                      </text>
                       {node.nodeColor && (
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
