
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BinaryTreeNodeVisual, BinaryTreeEdgeVisual } from './types'; // Local import
import { NODE_COLORS_AVL } from './avl-tree-logic'; 

interface BinaryTreeVisualizationPanelProps {
  nodes: BinaryTreeNodeVisual[];
  edges: BinaryTreeEdgeVisual[];
  traversalPath: (string | number)[]; 
  currentProcessingNodeId?: string | null;
  unbalancedNodeId?: string | null; // For highlighting the unbalanced node itself
}

const SVG_WIDTH = 600; 
const SVG_HEIGHT_BASE = 300; 
const NODE_RADIUS = 24; // Increased slightly for more space

export function BinaryTreeVisualizationPanel({
  nodes,
  edges,
  traversalPath, 
  currentProcessingNodeId,
  unbalancedNodeId,
}: BinaryTreeVisualizationPanelProps) {
  
  const maxDepthY = nodes.reduce((max, node) => Math.max(max, node.y), 0);
  const svgHeight = Math.max(SVG_HEIGHT_BASE, maxDepthY + NODE_RADIUS * 2 + 70); // Increased buffer for labels

  const viewBox = `0 0 ${SVG_WIDTH} ${svgHeight}`;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">AVL Tree Visualization</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-4 space-y-4 overflow-hidden">
        <div className="flex-grow w-full border rounded-md bg-muted/10 dark:bg-muted/5 flex items-center justify-center overflow-auto relative">
          {nodes.length === 0 ? (
            <p className="text-muted-foreground self-center">Tree is empty. Build or insert values.</p>
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
                      y1={sourceNode.y + NODE_RADIUS} 
                      x2={targetNode.x}
                      y2={targetNode.y - NODE_RADIUS} 
                      stroke={edge.color || "hsl(var(--muted-foreground))"}
                      strokeWidth="1.5"
                    />
                  );
                })}
                {nodes.map((node) => {
                  let fill = node.color || NODE_COLORS_AVL.DEFAULT;
                  let textColor = node.textColor || "hsl(var(--primary-foreground))"; // Default for light text

                  // Adjust text color based on fill for better contrast (conceptual)
                  if (fill === NODE_COLORS_AVL.NEWLY_INSERTED || 
                      fill === NODE_COLORS_AVL.ROTATION_PIVOT_YELLOW || 
                      fill === NODE_COLORS_AVL.SLIGHTLY_UNBALANCED_YELLOW) {
                     textColor = "hsl(var(--accent-foreground))"; // Dark text for light/yellow backgrounds
                  } else if (fill === NODE_COLORS_AVL.UNBALANCED_NODE_RED || 
                             fill === NODE_COLORS_AVL.TO_BE_DELETED) {
                     textColor = "hsl(var(--destructive-foreground))"; // Light text for red
                  } else if (fill === NODE_COLORS_AVL.BALANCED_GREEN || 
                             fill === NODE_COLORS_AVL.ACTIVE_COMPARISON || 
                             fill === NODE_COLORS_AVL.PATH_TRAVERSED || 
                             fill === NODE_COLORS_AVL.INORDER_SUCCESSOR) {
                     textColor = "hsl(var(--primary-foreground))"; // Light text for these darker/primary fills
                  }
                  
                  return (
                    <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                      <circle
                        cx="0"
                        cy="0"
                        r={NODE_RADIUS}
                        fill={fill}
                        stroke="hsl(var(--border))"
                        strokeWidth="1.5" 
                      />
                      <text
                        x="0"
                        y="-2" // Shift value slightly up to make space for H/BF
                        textAnchor="middle"
                        dy=".3em"
                        fontSize="10px" 
                        fill={textColor}
                        fontWeight="bold"
                        className="select-none font-code"
                      >
                        {node.value}
                      </text>
                      <text
                        x="0"
                        y={NODE_RADIUS - 6} // Position H/BF below the value
                        textAnchor="middle"
                        fontSize="7px"
                        fill={textColor}
                        className="select-none font-code opacity-80"
                      >
                        (H:{node.height},BF:{node.balanceFactor})
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          )}
        </div>
        <div className="flex-shrink-0 p-2 border rounded-md bg-background">
            <p className="font-semibold text-muted-foreground text-sm">Operation Path/Log:</p>
            <p className="font-code text-xs break-all h-10 overflow-y-auto">
                {traversalPath.map(val => String(val)).join(' \u2192 ') || '(Path/info will appear here)'}
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
