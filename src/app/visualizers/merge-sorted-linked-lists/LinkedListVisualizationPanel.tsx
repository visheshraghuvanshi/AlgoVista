
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LinkedListNodeVisual, LinkedListType } from './types'; // Local import
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface LinkedListVisualizationPanelProps {
  nodes: LinkedListNodeVisual[];
  listType?: LinkedListType; 
  headId?: string | null;
  auxiliaryPointers?: Record<string, string | null>;
  message?: string;
}

const NODE_WIDTH = 60;
const NODE_HEIGHT = 40;
const NODE_SPACING_X = 80;
const POINTER_OFFSET = 10;
const SVG_PADDING = 20;

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  active: "hsl(var(--primary))",
  highlight: "hsl(var(--accent))",
  head: "hsl(var(--ring))",
};
const TEXT_COLORS = {
  default: "hsl(var(--secondary-foreground))",
  active: "hsl(var(--primary-foreground))",
  highlight: "hsl(var(--accent-foreground))",
  head: "hsl(var(--primary-foreground))",
};

export function LinkedListVisualizationPanel({
  nodes = [], // Default to empty array if undefined
  listType = 'singly',
  headId,
  auxiliaryPointers = {},
  message,
}: LinkedListVisualizationPanelProps) {
    
  // This component will need to render multiple lists for the merge visualizer.
  // The logic in the page will need to combine the nodes from both lists and the merged list into a single `nodes` array with different y positions.
  // The y-position can be used to separate the lists visually.

  const positionedNodes = nodes.map((node, index) => ({
    ...node,
    x: node.x ?? SVG_PADDING + (index % 10) * NODE_SPACING_X, // Simple wrap for now
    y: node.y ?? SVG_PADDING + 50 + Math.floor(index / 10) * 80, 
  }));
  
  const getNodeById = (id: string | null | undefined) => positionedNodes.find(n => n.id === id);


  const svgWidth = Math.max(600, SVG_PADDING * 2 + 10 * NODE_SPACING_X);
  const svgHeight = Math.max(300, positionedNodes.reduce((max, n) => Math.max(max, n.y + NODE_HEIGHT), 0) + SVG_PADDING);
  const viewBox = `0 0 ${svgWidth} ${svgHeight}`;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Linked List Visualization</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-2 space-y-2 overflow-hidden">
        <div className="flex-grow w-full border rounded-md bg-muted/10 dark:bg-muted/5 flex items-center justify-center overflow-auto relative p-2">
          {positionedNodes.length === 0 ? (
            <p className="text-muted-foreground self-center">Lists are empty or not initialized.</p>
          ) : (
            <svg width={svgWidth} height={svgHeight} viewBox={viewBox} preserveAspectRatio="xMinYMin meet">
              <defs>
                <marker
                  id="ll-arrowhead"
                  markerWidth="10" markerHeight="7"
                  refX="2" refY="1.75"
                  orient="auto" markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,3.5 L2.5,1.75 z" fill="hsl(var(--muted-foreground))" />
                </marker>
                 <marker
                  id="ll-arrowhead-active"
                  markerWidth="10" markerHeight="7"
                  refX="2" refY="1.75"
                  orient="auto" markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,3.5 L2.5,1.75 z" fill="hsl(var(--primary))" />
                </marker>
              </defs>

              {positionedNodes.map((node) => {
                const nextNode = getNodeById(node.nextId);
                if (nextNode) {
                  const isNextActive = auxiliaryPointers.l1 === node.id || auxiliaryPointers.l2 === node.id || auxiliaryPointers.tail === node.id;
                  return (
                    <line
                      key={`next-${node.id}`}
                      x1={node.x! + NODE_WIDTH / 2}
                      y1={node.y!}
                      x2={nextNode.x! - NODE_WIDTH / 2 - 5}
                      y2={nextNode.y!}
                      stroke={isNextActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                      strokeWidth="1.5"
                      markerEnd={isNextActive ? "url(#ll-arrowhead-active)" : "url(#ll-arrowhead)"}
                    />
                  );
                }
                return null;
              })}

              {positionedNodes.map((node) => {
                let nodeFill = node.color || NODE_COLORS.default;
                let textFill = TEXT_COLORS.default;

                if (auxiliaryPointers.l1 === node.id) { nodeFill = "hsl(var(--chart-1))"; textFill = "white"; }
                else if (auxiliaryPointers.l2 === node.id) { nodeFill = "hsl(var(--chart-2))"; textFill = "white"; }
                else if (auxiliaryPointers.tail === node.id) { nodeFill = NODE_COLORS.active; textFill = TEXT_COLORS.active; }

                return (
                  <g key={node.id} transform={`translate(${node.x! - NODE_WIDTH / 2}, ${node.y! - NODE_HEIGHT / 2})`}>
                    <rect
                      width={NODE_WIDTH}
                      height={NODE_HEIGHT}
                      fill={nodeFill}
                      stroke="hsl(var(--border))"
                      strokeWidth="1"
                      rx="3"
                    />
                    <text
                      x={NODE_WIDTH / 2}
                      y={NODE_HEIGHT / 2}
                      textAnchor="middle"
                      dy=".3em"
                      fontSize="12"
                      fill={textFill}
                      fontWeight="bold"
                    >
                      {String(node.value)}
                    </text>
                  </g>
                );
              })}
              
              {Object.entries(auxiliaryPointers).map(([key, nodeIdStr]) => {
                if (!nodeIdStr) return null;
                const targetNode = positionedNodes.find(n => n.id === nodeIdStr);
                if (!targetNode) return null;
                
                return (
                  <g key={`aux-${key}-${nodeIdStr}`}>
                    <text
                      x={targetNode.x!}
                      y={targetNode.y! - NODE_HEIGHT / 2 - 10} 
                      textAnchor="middle"
                      fontSize="10"
                      fill="hsl(var(--foreground))"
                      className="font-mono"
                    >
                      {key}
                    </text>
                    <line 
                        x1={targetNode.x!} y1={targetNode.y! - NODE_HEIGHT / 2 - 7}
                        x2={targetNode.x!} y2={targetNode.y! - NODE_HEIGHT / 2 + 2}
                        stroke="hsl(var(--foreground))" strokeWidth="1"
                        markerEnd="url(#ll-arrowhead)"
                    />
                  </g>
                );
              })}
            </svg>
          )}
        </div>
        {message && (
          <div className="flex-shrink-0 p-1 border rounded-md bg-background text-xs text-center mt-2">
            <p className="font-semibold text-muted-foreground">Status:</p>
            <p className="font-code break-all">{message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
