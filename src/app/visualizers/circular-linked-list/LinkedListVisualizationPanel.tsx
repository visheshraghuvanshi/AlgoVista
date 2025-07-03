
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LinkedListNodeVisual, LinkedListType } from './types'; // Local import
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface LinkedListVisualizationPanelProps {
  nodes: LinkedListNodeVisual[];
  listType?: LinkedListType; 
  headId?: string | null;
  tailId?: string | null; 
  auxiliaryPointers?: Record<string, string | null>;
  message?: string;
  actualCycleNodeId?: string | null; // For cycle detection visualizer, not used here
}

const NODE_WIDTH = 60;
const NODE_HEIGHT = 40;
const POINTER_OFFSET = 10;
const SVG_PADDING = 30;

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  active: "hsl(var(--primary))",
  new: "hsl(var(--accent))",
  head: "hsl(var(--ring))",
  tail: "hsl(var(--ring))", 
};
const TEXT_COLORS = {
  default: "hsl(var(--secondary-foreground))",
  active: "hsl(var(--primary-foreground))",
  new: "hsl(var(--accent-foreground))",
  head: "hsl(var(--primary-foreground))",
  tail: "hsl(var(--primary-foreground))",
};

export function LinkedListVisualizationPanel({
  nodes = [], 
  listType = 'singly',
  headId,
  tailId,
  auxiliaryPointers = {},
  message,
}: LinkedListVisualizationPanelProps) {
    
  const svgWidth = 500;
  const svgHeight = 350;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const radius = Math.min(centerX, centerY) * 0.7;

  const positionedNodes = nodes.map((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI - Math.PI / 2; // Start from top
    return {
      ...node,
      x: node.x ?? centerX + radius * Math.cos(angle),
      y: node.y ?? centerY + radius * Math.sin(angle),
    };
  });

  const getNodeById = (id: string | null | undefined) => positionedNodes.find(n => n.id === id);

  const viewBox = `0 0 ${svgWidth} ${svgHeight}`;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Linked List Visualization</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-2 space-y-2 overflow-hidden">
        <div className="flex-grow w-full border rounded-md bg-muted/10 dark:bg-muted/5 flex items-center justify-center overflow-auto relative p-2">
          {positionedNodes.length === 0 ? (
            <p className="text-muted-foreground self-center">List is empty or not initialized.</p>
          ) : (
            <svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
              <defs>
                <marker
                  id="cll-arrowhead" markerWidth="6" markerHeight="4"
                  refX="5" refY="2" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,4 L6,2 z" fill="hsl(var(--muted-foreground))" />
                </marker>
                 <marker
                  id="cll-arrowhead-active" markerWidth="6" markerHeight="4"
                  refX="5" refY="2" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,4 L6,2 z" fill="hsl(var(--primary))" />
                </marker>
              </defs>

              {/* Render edges */}
              {positionedNodes.map((node) => {
                const nextNode = getNodeById(node.nextId);
                if (!nextNode) return null;

                const isNextActive = auxiliaryPointers?.current === node.id || auxiliaryPointers?.prev === node.id;
                const strokeColor = isNextActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))";
                const marker = isNextActive ? "url(#cll-arrowhead-active)" : "url(#cll-arrowhead)";

                // Draw curved path for tail->head, straight for others
                if (node.id === tailId && nextNode.id === headId) {
                   const dx = nextNode.x! - node.x!;
                   const dy = nextNode.y! - node.y!;
                   // Control point for Bezier curve, pushed "outwards" from center
                   const controlX = centerX + (node.x! + dx/2 - centerX) * 1.5;
                   const controlY = centerY + (node.y! + dy/2 - centerY) * 1.5;

                    return (
                        <path key={`next-${node.id}`}
                            d={`M ${node.x!} ${node.y!} Q ${controlX} ${controlY} ${nextNode.x!} ${nextNode.y!}`}
                            stroke={strokeColor} strokeWidth="1.5" fill="none"
                            markerEnd={marker}
                        />
                    );
                } else {
                    const angle = Math.atan2(nextNode.y! - node.y!, nextNode.x! - node.x!);
                    const startX = node.x! + (NODE_WIDTH/2 - 12) * Math.cos(angle);
                    const startY = node.y! + (NODE_WIDTH/2 - 12) * Math.sin(angle);
                    const endX = nextNode.x! - (NODE_WIDTH/2 - 12) * Math.cos(angle);
                    const endY = nextNode.y! - (NODE_WIDTH/2 - 12) * Math.sin(angle);
                    return (
                        <line key={`next-${node.id}`}
                            x1={startX} y1={startY} x2={endX} y2={endY}
                            stroke={strokeColor} strokeWidth="1.5"
                            markerEnd={marker}
                        />
                    );
                }
              })}
              
              {/* Render nodes */}
              {positionedNodes.map((node) => {
                let nodeFill = node.color || NODE_COLORS.default;
                let textFill = TEXT_COLORS.default;

                const isAuxPointed = Object.values(auxiliaryPointers).some(val => val === node.id);
                if (isAuxPointed) {
                    nodeFill = NODE_COLORS.active; textFill = TEXT_COLORS.active;
                }
                if (node.isHead) { nodeFill = NODE_COLORS.head; textFill = TEXT_COLORS.head; }
                if (node.isTail) { nodeFill = NODE_COLORS.tail; textFill = TEXT_COLORS.tail; } // Tail color will override head if single node
                
                return (
                  <g key={node.id} transform={`translate(${node.x! - NODE_WIDTH / 2}, ${node.y! - NODE_HEIGHT / 2})`}>
                    <rect width={NODE_WIDTH} height={NODE_HEIGHT} fill={nodeFill} stroke="hsl(var(--border))" strokeWidth="1" rx="5"/>
                    <text x={NODE_WIDTH / 2} y={NODE_HEIGHT / 2} textAnchor="middle" dy=".3em" fontSize="12" fill={textFill} fontWeight="bold">
                      {String(node.value)}
                    </text>
                  </g>
                );
              })}
              
              {/* Auxiliary Pointers */}
              {Object.entries(auxiliaryPointers).map(([key, nodeIdStr]) => {
                if (!nodeIdStr) return null;
                const targetNode = positionedNodes.find(n => n.id === nodeIdStr);
                if (!targetNode) return null;

                const angle = Math.atan2(targetNode.y! - centerY, targetNode.x! - centerX);
                const textX = targetNode.x! + (NODE_WIDTH/2 + 10) * Math.cos(angle);
                const textY = targetNode.y! + (NODE_HEIGHT/2 + 10) * Math.sin(angle);

                return (
                  <text key={`aux-${key}`} x={textX} y={textY}
                        textAnchor="middle" fontSize="10" fill="hsl(var(--foreground))"
                        className="font-mono">
                      {key}
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
