
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GraphNode, GraphEdge, GraphAlgorithmStep } from '@/types';

interface GraphVisualizationPanelProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  auxiliaryData?: GraphAlgorithmStep['auxiliaryData'];
}

const SVG_WIDTH = 500;
const SVG_HEIGHT = 300; // Reduced height for the graph area
const NODE_RADIUS = 15;

export function GraphVisualizationPanel({
  nodes,
  edges,
  auxiliaryData = [],
}: GraphVisualizationPanelProps) {

  const viewBox = `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Graph Visualization</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-4 space-y-4 overflow-hidden">
        <div className="flex-grow w-full border rounded-md bg-muted/10 dark:bg-muted/5 flex items-center justify-center overflow-auto">
          {nodes.length === 0 ? (
            <p className="text-muted-foreground self-center">Enter graph data to visualize.</p>
          ) : (
            <svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
              <g>
                {edges.map((edge) => (
                  <line
                    key={edge.id}
                    x1={nodes.find(n => n.id === edge.source)?.x || 0}
                    y1={nodes.find(n => n.id === edge.source)?.y || 0}
                    x2={nodes.find(n => n.id === edge.target)?.x || 0}
                    y2={nodes.find(n => n.id === edge.target)?.y || 0}
                    stroke={edge.color || "hsl(var(--muted-foreground))"}
                    strokeWidth="2"
                    markerEnd={edge.isDirected ? "url(#arrowhead)" : undefined}
                  />
                ))}
                {edges.map((edge) => (
                    edge.weight !== undefined && (
                        <text
                        key={`${edge.id}-weight`}
                        x={((nodes.find(n => n.id === edge.source)?.x || 0) + (nodes.find(n => n.id === edge.target)?.x || 0)) / 2 + 5}
                        y={((nodes.find(n => n.id === edge.source)?.y || 0) + (nodes.find(n => n.id === edge.target)?.y || 0)) / 2 - 5}
                        fontSize="10"
                        fill="hsl(var(--foreground))"
                        textAnchor="middle"
                        >
                        {edge.weight}
                        </text>
                    )
                ))}
                {nodes.map((node) => (
                  <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r={NODE_RADIUS}
                      fill={node.color || "hsl(var(--secondary))"}
                      stroke="hsl(var(--border))"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      dy=".3em"
                      fontSize="10"
                      fill={node.isStartNode ? "hsl(var(--accent-foreground))" : "hsl(var(--primary-foreground))"}
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                    {node.distance !== undefined && (
                        <text
                        x="0"
                        y={NODE_RADIUS + 12} // Position distance below the node
                        textAnchor="middle"
                        fontSize="9"
                        fill="hsl(var(--foreground))"
                        >
                        {node.distance === Infinity ? "\u221E" : node.distance.toString()}
                        </text>
                    )}
                  </g>
                ))}
              </g>
              <defs>
                <marker
                    id="arrowhead"
                    markerWidth="6"
                    markerHeight="4"
                    refX="4"
                    refY="2"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M0,0 L0,4 L6,2 z" fill="hsl(var(--muted-foreground))" />
                </marker>
              </defs>
            </svg>
          )}
        </div>
        <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs overflow-y-auto max-h-24">
          {auxiliaryData.map((data, index) => (
            <div key={index} className="p-2 border rounded-md bg-background">
              <p className="font-semibold text-muted-foreground">{data.label}:</p>
              {Array.isArray(data.values) ? (
                 <p className="font-code break-all">{data.values.join(', ') || '(empty)'}</p>
              ) : (
                <div className="font-code">
                  {Object.entries(data.values).map(([key, value]) => (
                    <div key={key}>{key}: {value === Infinity ? "\u221E" : value.toString()}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
