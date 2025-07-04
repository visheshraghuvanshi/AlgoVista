
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LinkedListNodeVisual, LinkedListType } from '@/types';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface LinkedListVisualizationPanelProps {
  nodes: LinkedListNodeVisual[];
  listType?: LinkedListType; // To handle specifics like circular or doubly
  headId?: string | null;
  auxiliaryPointers?: Record<string, string | null>;
  message?: string;
}

const NODE_WIDTH = 60;
const NODE_HEIGHT = 40;
const NODE_SPACING_X = 80; // Horizontal spacing between nodes
const NODE_SPACING_Y = 60; // Vertical spacing (not used much for linear lists)
const POINTER_OFFSET = 10;
const SVG_PADDING = 20;

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  active: "hsl(var(--primary))",
  highlight: "hsl(var(--accent))", // For special pointers like slow/fast
  head: "hsl(var(--ring))", // A distinct color for head
};
const TEXT_COLORS = {
  default: "hsl(var(--secondary-foreground))",
  active: "hsl(var(--primary-foreground))",
  highlight: "hsl(var(--accent-foreground))",
  head: "hsl(var(--primary-foreground))",
}

export function LinkedListVisualizationPanel({
  nodes,
  listType = 'singly',
  headId,
  auxiliaryPointers = {},
  message,
}: LinkedListVisualizationPanelProps) {
  if (!nodes) {
    nodes = []; // Ensure nodes is an array
  }
    
  const getNodeById = (id: string | null | undefined) => nodes.find(n => n.id === id);

  // Calculate positions if not provided (simple horizontal layout)
  const positionedNodes = nodes.map((node, index) => ({
    ...node,
    x: node.x ?? SVG_PADDING + index * NODE_SPACING_X,
    y: node.y ?? SVG_PADDING + NODE_HEIGHT, // Center vertically for now
  }));

  const svgWidth = Math.max(300, SVG_PADDING * 2 + nodes.length * NODE_SPACING_X - (nodes.length > 0 ? (NODE_SPACING_X - NODE_WIDTH) : 0));
  const svgHeight = Math.max(150, SVG_PADDING * 2 + NODE_HEIGHT * 2 + Object.keys(auxiliaryPointers).length * 20 + (message ? 30: 0) );


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
                  id="ll-arrowhead"
                  markerWidth="10" markerHeight="7"
                  refX="2" refY="1.75" // Adjusted refX for better connection
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

              {/* Render edges/pointers */}
              {positionedNodes.map((node) => {
                const nextNode = getNodeById(node.nextId);
                if (nextNode) {
                  const isNextActive = auxiliaryPointers.current === node.id || auxiliaryPointers.prev === node.id || node.color === NODE_COLORS.active;
                  return (
                    <line
                      key={`next-${node.id}`}
                      x1={node.x! + NODE_WIDTH / 2}
                      y1={node.y!}
                      x2={nextNode.x! - NODE_WIDTH / 2 - 5} // -5 for arrowhead space
                      y2={nextNode.y!}
                      stroke={isNextActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                      strokeWidth="1.5"
                      markerEnd={isNextActive ? "url(#ll-arrowhead-active)" : "url(#ll-arrowhead)"}
                    />
                  );
                }
                // Circular list: last node points to head
                if (listType === 'circular' && node.nextId === headId && headId) {
                  const headNodeObj = getNodeById(headId);
                  if(headNodeObj) {
                    // Simple curved path for circular link (conceptual)
                    return (
                       <path key={`circ-${node.id}`}
                          d={`M ${node.x! + NODE_WIDTH/2},${node.y!} 
                              Q ${node.x! + NODE_WIDTH/2 + 20},${node.y! - NODE_HEIGHT*0.75} 
                                ${headNodeObj.x! - NODE_WIDTH/2 - 5},${headNodeObj.y! - NODE_HEIGHT*0.3}`} // curve towards top of head
                          stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" fill="none"
                          markerEnd="url(#ll-arrowhead)"
                        />
                    );
                  }
                }
                return null;
              })}

              {listType === 'doubly' && positionedNodes.map((node) => {
                const prevNode = getNodeById(node.prevId);
                if (prevNode) {
                   const isPrevActive = auxiliaryPointers.current === node.id || node.color === NODE_COLORS.active;
                  return (
                    <line
                      key={`prev-${node.id}`}
                      x1={node.x! - NODE_WIDTH / 2}
                      y1={node.y! + POINTER_OFFSET*0.7} // Slightly below 'next' pointer
                      x2={prevNode.x! + NODE_WIDTH / 2 + 5}
                      y2={prevNode.y! + POINTER_OFFSET*0.7}
                      stroke={isPrevActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                      strokeWidth="1.5"
                      markerEnd={isPrevActive ? "url(#ll-arrowhead-active)" : "url(#ll-arrowhead)"} // Arrow points from current to prev
                    />
                  );
                }
                return null;
              })}

              {/* Render nodes */}
              {positionedNodes.map((node) => {
                let nodeFill = node.color || NODE_COLORS.default;
                let textFill = TEXT_COLORS.default;
                if (node.isHead) { nodeFill = NODE_COLORS.head; textFill = TEXT_COLORS.head; }
                if (node.isSlow || node.isFast) { nodeFill = NODE_COLORS.highlight; textFill = TEXT_COLORS.highlight; }
                // Check if node ID is ANY of the values in auxiliaryPointers for general activity
                const isAuxPointed = Object.values(auxiliaryPointers).some(val => val === node.id);
                if (isAuxPointed && !node.isHead && !node.isSlow && !node.isFast) { // Avoid re-coloring head/slow/fast if also aux
                    nodeFill = NODE_COLORS.active; textFill = TEXT_COLORS.active;
                }


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
                    {node.isSlow && <text x={NODE_WIDTH/2} y={NODE_HEIGHT + 12} fontSize="10" textAnchor="middle" fill={TEXT_COLORS.highlight}>S</text>}
                    {node.isFast && <text x={NODE_WIDTH/2} y={NODE_HEIGHT + (node.isSlow ? 24 : 12)} fontSize="10" textAnchor="middle" fill={TEXT_COLORS.highlight}>F</text>}
                  </g>
                );
              })}
              
              {/* Auxiliary Pointers (general rendering for those not covered by isSlow/isFast) */}
              {Object.entries(auxiliaryPointers).map(([key, nodeIdStr], index) => {
                if (!nodeIdStr || key === 'slow' || key === 'fast') return null; // Skip handled ones
                const targetNode = positionedNodes.find(n => n.id === nodeIdStr);
                if (!targetNode) return null;

                // Avoid rendering "current" if it's already covered by slow/fast or head highlighting logic
                if (key === 'current' && (targetNode.isSlow || targetNode.isFast || targetNode.isHead)) return null;

                return (
                  <g key={`aux-${key}-${nodeIdStr}`}>
                    <text
                      x={targetNode.x!}
                      y={targetNode.y! - NODE_HEIGHT / 2 - 5 - (Object.keys(auxiliaryPointers).indexOf(key) * 10) % 20} 
                      textAnchor="middle"
                      fontSize="10"
                      fill="hsl(var(--foreground))"
                      className="font-mono"
                    >
                      {key} ({auxiliaryPointers[key+'_val'] || targetNode.value})
                    </text>
                    <line 
                        x1={targetNode.x!} 
                        y1={targetNode.y! - NODE_HEIGHT / 2 - 2 - (Object.keys(auxiliaryPointers).indexOf(key) * 10) % 20} 
                        x2={targetNode.x!}
                        y2={targetNode.y! - NODE_HEIGHT / 2 + 2}
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
