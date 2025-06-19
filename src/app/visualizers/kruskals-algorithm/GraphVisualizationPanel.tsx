// src/app/visualizers/kruskals-algorithm/GraphVisualizationPanel.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GraphNode, GraphEdge, GraphAlgorithmStep } from './types'; // Local import

interface GraphVisualizationPanelProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  auxiliaryData?: GraphAlgorithmStep['auxiliaryData'];
}

const SVG_WIDTH = 500;
const SVG_HEIGHT = 300; 
const NODE_RADIUS = 15;

const ACCENT_BACKGROUND_COLOR = "hsl(var(--accent))";
const EDGE_COLOR_DEFAULT = "hsl(var(--muted-foreground))";
const EDGE_COLOR_RELAXED = "hsl(var(--primary))"; 
const EDGE_COLOR_TRANSPOSE = "hsl(var(--purple-500))"; 
const EDGE_COLOR_CONSIDERED = "hsl(var(--accent))";
const EDGE_COLOR_IN_MST = "hsl(var(--primary))"; 


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
              <defs>
                <marker
                    id="arrowhead-default"
                    markerWidth="6" markerHeight="4" refX="5" refY="2"
                    orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,4 L6,2 z" fill={EDGE_COLOR_DEFAULT} />
                </marker>
                <marker
                    id="arrowhead-primary" 
                    markerWidth="6" markerHeight="4" refX="5" refY="2"
                    orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,4 L6,2 z" fill={EDGE_COLOR_RELAXED} />
                </marker>
                <marker
                    id="arrowhead-transpose"
                    markerWidth="6" markerHeight="4" refX="5" refY="2"
                    orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,4 L6,2 z" fill={EDGE_COLOR_TRANSPOSE} /> 
                </marker>
                 <marker
                    id="arrowhead-considered" 
                    markerWidth="6" markerHeight="4" refX="5" refY="2"
                    orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,4 L6,2 z" fill={EDGE_COLOR_CONSIDERED} />
                </marker>
                 <marker
                    id="arrowhead-inMST"
                    markerWidth="6" markerHeight="4" refX="5" refY="2"
                    orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,4 L6,2 z" fill={EDGE_COLOR_IN_MST} />
                </marker>
              </defs>
              <g>
                {edges.map((edge) => {
                  const sourceNode = nodes.find(n => n.id === edge.source);
                  const targetNode = nodes.find(n => n.id === edge.target);
                  if (!sourceNode || !targetNode) return null;

                  const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
                  const adjustedTargetX = targetNode.x - NODE_RADIUS * Math.cos(angle);
                  const adjustedTargetY = targetNode.y - NODE_RADIUS * Math.sin(angle);
                  
                  let markerUrl;
                  const strokeColor = edge.color || EDGE_COLOR_DEFAULT;
                  if (strokeColor === EDGE_COLOR_RELAXED || strokeColor === EDGE_COLOR_IN_MST) markerUrl = "url(#arrowhead-primary)";
                  else if (strokeColor === EDGE_COLOR_TRANSPOSE) markerUrl = "url(#arrowhead-transpose)";
                  else if (strokeColor === EDGE_COLOR_CONSIDERED) markerUrl = "url(#arrowhead-considered)";
                  else markerUrl = "url(#arrowhead-default)";


                  return (
                    <line
                      key={edge.id}
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={edge.isDirected ? adjustedTargetX : targetNode.x}
                      y2={edge.isDirected ? adjustedTargetY : targetNode.y}
                      stroke={strokeColor}
                      strokeWidth="2"
                      markerEnd={edge.isDirected ? markerUrl : undefined}
                    />
                  );
                })}
                {edges.map((edge) => {
                    const sourceNode = nodes.find(n => n.id === edge.source);
                    const targetNode = nodes.find(n => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;
                    
                    if (edge.weight !== undefined) {
                        const midX = (sourceNode.x + targetNode.x) / 2;
                        const midY = (sourceNode.y + targetNode.y) / 2;
                        const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
                        const offsetX = Math.sin(angle) * 8; 
                        const offsetY = -Math.cos(angle) * 8;

                       return ( <text
                        key={`${edge.id}-weight`}
                        x={midX + offsetX}
                        y={midY + offsetY}
                        fontSize="10"
                        fill="hsl(var(--foreground))"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        >
                        {edge.weight}
                        </text>
                       );
                    }
                    return null;
                })}
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
                      fill={ node.color === ACCENT_BACKGROUND_COLOR ? "hsl(var(--accent-foreground))" : "hsl(var(--primary-foreground))"}
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                    {node.distance !== undefined && (
                        <text
                        x="0"
                        y={NODE_RADIUS + 12} 
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
                  {typeof data.values === 'object' && data.values !== null ? 
                    Object.entries(data.values).map(([key, value]) => (
                      <div key={key}>{key}: {value === Infinity ? "\u221E" : String(value)}</div>
                    )) : String(data.values)
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
