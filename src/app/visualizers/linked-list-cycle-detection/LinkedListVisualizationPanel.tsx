
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LinkedListNodeVisual, LinkedListAlgorithmStep } from './types';

interface LinkedListVisualizationPanelProps {
  step: LinkedListAlgorithmStep | null;
}

const NODE_WIDTH = 60;
const NODE_HEIGHT = 40;
const NODE_SPACING_X = 90;
const POINTER_OFFSET_Y = 22;
const SVG_PADDING = 30;

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  head: "hsl(var(--ring))",
  slow: "hsl(var(--accent))",
  fast: "hsl(var(--destructive))",
  meet: "bg-green-500", 
};
const TEXT_COLORS = {
  default: "hsl(var(--secondary-foreground))",
  head: "hsl(var(--primary-foreground))",
  slow: "hsl(var(--accent-foreground))",
  fast: "hsl(var(--destructive-foreground))",
  meet: "hsl(var(--primary-foreground))",
};


export function LinkedListVisualizationPanel({ step }: LinkedListVisualizationPanelProps) {
  if (!step) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Linked List</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">List not initialized.</p></CardContent>
      </Card>
    );
  }

  const { nodes, headId, auxiliaryPointers, message, actualCycleNodeId } = step;
  
  const positionedNodes = nodes.map((node, index) => ({
    ...node,
    x: node.x ?? SVG_PADDING + index * NODE_SPACING_X,
    y: node.y ?? SVG_PADDING + NODE_HEIGHT + 40,
  }));

  const getNodeById = (id: string | null | undefined) => positionedNodes.find(n => n.id === id);

  const svgWidth = Math.max(300, SVG_PADDING * 2 + positionedNodes.length * NODE_SPACING_X);
  const svgHeight = Math.max(200, SVG_PADDING * 2 + NODE_HEIGHT * 3 + (message ? 20 : 0));
  const viewBox = `0 0 ${svgWidth} ${svgHeight}`;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Linked List Visualization</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-2 space-y-2 overflow-hidden">
        <div className="flex-grow w-full border rounded-md bg-muted/10 dark:bg-muted/5 flex items-center justify-center overflow-auto relative p-2">
          {positionedNodes.length === 0 ? (
            <p className="text-muted-foreground self-center">List is empty.</p>
          ) : (
            <svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
              <defs>
                <marker id="llcd-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,4 L6,2 z" fill="hsl(var(--muted-foreground))" />
                </marker>
                <marker id="llcd-arrow-cycle" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,4 L6,2 z" fill="hsl(var(--destructive))" />
                </marker>
              </defs>

              {positionedNodes.map((node) => {
                const nextNode = getNodeById(node.nextId);
                const isCycleEdge = node.nextId === actualCycleNodeId && actualCycleNodeId;
                if (nextNode && !isCycleEdge) {
                  return (
                    <line
                      key={`next-${node.id}`}
                      x1={node.x! + NODE_WIDTH / 2} y1={node.y!}
                      x2={nextNode.x! - NODE_WIDTH / 2 - 5} y2={nextNode.y!}
                      stroke="hsl(var(--muted-foreground))" strokeWidth="1.5"
                      markerEnd="url(#llcd-arrow)"
                    />
                  );
                }
                if (isCycleEdge) {
                  const cycleTargetNode = getNodeById(actualCycleNodeId);
                  if (cycleTargetNode) {
                    const arcYOffset = 60;
                    return (
                      <path
                        key={`cycle-${node.id}`}
                        d={`M ${node.x!},${node.y! + NODE_HEIGHT / 2} Q ${(node.x! + cycleTargetNode.x!) / 2},${node.y! + arcYOffset} ${cycleTargetNode.x!},${cycleTargetNode.y! + NODE_HEIGHT / 2}`}
                        stroke="hsl(var(--destructive))" strokeWidth="1.5" fill="none"
                        markerEnd="url(#llcd-arrow-cycle)"
                      />
                    );
                  }
                }
                return null;
              })}

              {positionedNodes.map((node) => {
                let nodeFill = NODE_COLORS.default;
                let textFill = TEXT_COLORS.default;
                if (node.isHead) { nodeFill = NODE_COLORS.head; textFill = TEXT_COLORS.head; }
                
                const isSlow = auxiliaryPointers.slow === node.id;
                const isFast = auxiliaryPointers.fast === node.id;

                if (isSlow && isFast) { nodeFill = NODE_COLORS.meet; textFill = TEXT_COLORS.meet; }
                else if (isFast) { nodeFill = NODE_COLORS.fast; textFill = TEXT_COLORS.fast; }
                else if (isSlow) { nodeFill = NODE_COLORS.slow; textFill = TEXT_COLORS.slow; }
                
                return (
                  <g key={`g-${node.id}`} transform={`translate(${node.x! - NODE_WIDTH / 2}, ${node.y! - NODE_HEIGHT / 2})`}>
                    <rect width={NODE_WIDTH} height={NODE_HEIGHT} fill={nodeFill} stroke="hsl(var(--border))" strokeWidth={isSlow && isFast ? "2" : "1"} className={isSlow && isFast ? "ring-4 ring-green-500 animate-pulse" : ""} rx="3"/>
                    <text x={NODE_WIDTH / 2} y={NODE_HEIGHT / 2} textAnchor="middle" dy=".3em" fontSize="12" fill={textFill} fontWeight="bold">
                      {String(node.value)}
                    </text>
                  </g>
                );
              })}

              {/* Auxiliary Pointer Labels */}
              {Object.entries(auxiliaryPointers).map(([key, nodeIdStr]) => {
                if (!nodeIdStr) return null;
                const targetNode = positionedNodes.find(n => n.id === nodeIdStr);
                if (!targetNode) return null;

                const isBoth = auxiliaryPointers.slow === nodeIdStr && auxiliaryPointers.fast === nodeIdStr;
                let labelText = key.toUpperCase();
                let yOffset = POINTER_OFFSET_Y;
                if (isBoth) labelText = "S/F";
                else if (key === 'fast') yOffset += 12;

                return (
                  <text key={`aux-${key}`} x={targetNode.x!} y={targetNode.y! + NODE_HEIGHT / 2 + yOffset}
                        textAnchor="middle" fontSize="10"
                        fill={isBoth ? NODE_COLORS.meet : (key === 'slow' ? NODE_COLORS.slow : NODE_COLORS.fast)}
                        className="font-mono font-bold">
                    {labelText}
                  </text>
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
