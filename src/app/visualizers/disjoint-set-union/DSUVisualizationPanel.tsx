"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DSUStep } from './types'; // Local import
import { Badge } from '@/components/ui/badge';

interface DSUVisualizationPanelProps {
  step: DSUStep | null;
  numElements: number;
}

export function DSUVisualizationPanel({ step, numElements }: DSUVisualizationPanelProps) {
  if (!step) {
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">DSU State</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Initialize DSU or perform an operation.</p></CardContent>
      </Card>
    );
  }

  const { parentArray, rankArray, sizeArray, operation, elementsInvolved, root1, root2, pathCompressedNodes, message, activeIndices } = step;
  const N = numElements > 0 ? numElements : parentArray.length;

  const getElementColor = (index: number) => {
    if (activeIndices?.includes(index)) return "bg-primary text-primary-foreground scale-110";
    if (pathCompressedNodes?.includes(index)) return "bg-yellow-400 text-yellow-900";
    if (elementsInvolved?.includes(index)) {
        if ((operation === 'union' && (index === root1 || index === root2)) || (operation === 'find' && index === elementsInvolved[0])) {
             return "bg-accent text-accent-foreground";
        }
        return "bg-blue-300 text-blue-800 dark:bg-blue-700 dark:text-blue-200";
    }
    return "bg-card text-card-foreground";
  };
  
  const renderForest = () => {
    const nodes: { id: number, parent: number | null, children: number[], x?: number, y?: number }[] = [];
    const roots: number[] = [];
    
    // Initialize nodes and find roots
    for (let i = 0; i < N; i++) {
        nodes[i] = { id: i, parent: parentArray[i] === i ? null : parentArray[i], children: [] };
        if (parentArray[i] === i) {
            roots.push(i);
        }
    }

    // Build children lists (only for non-root nodes)
    for (let i = 0; i < N; i++) {
        if (parentArray[i] !== i && nodes[parentArray[i]]) { // Check if parent exists
            nodes[parentArray[i]].children.push(i);
        }
    }

    const MAX_WIDTH = 550; // SVG width
    const NODE_RADIUS = 12;
    const LEVEL_HEIGHT = 50;
    const SIBLING_SPACING = 30;
    const TREE_SPACING = 60;
    let currentX = NODE_RADIUS + 10;
    let maxY = 0;

    function calculatePositions(nodeId: number, depth: number, xCenter: number): number {
        nodes[nodeId].x = xCenter;
        nodes[nodeId].y = depth * LEVEL_HEIGHT + NODE_RADIUS + 20;
        maxY = Math.max(maxY, nodes[nodeId].y!);

        let childrenWidth = 0;
        if (nodes[nodeId].children.length > 0) {
            childrenWidth = nodes[nodeId].children.reduce((acc, childId, index) => {
                return acc + calculatePositions(childId, depth + 1, 0) + (index > 0 ? SIBLING_SPACING : 0);
            }, 0);
        }
        
        const nodeWidth = Math.max(NODE_RADIUS * 2, childrenWidth);
        let childX = xCenter - childrenWidth / 2;

        for (const childId of nodes[nodeId].children) {
            const childSubtreeWidth = nodes[childId].x!; // This will be nodeWidth of child's subtree
            nodes[childId].x = childX + childSubtreeWidth / 2;
            childX += childSubtreeWidth + SIBLING_SPACING;
        }
        return nodeWidth;
    }
    
    roots.forEach(rootId => {
        const treeWidth = calculatePositions(rootId, 0, currentX + NODE_RADIUS); // Pass initial X for root
        currentX += treeWidth + TREE_SPACING;
    });


    // Adjust all X positions if total width exceeds MAX_WIDTH or to center
    const actualTotalWidth = currentX - TREE_SPACING + NODE_RADIUS;
    let scale = 1;
    let xOffset = 0;
    if (actualTotalWidth > MAX_WIDTH) {
        scale = MAX_WIDTH / actualTotalWidth;
    }
    xOffset = (MAX_WIDTH - actualTotalWidth * scale) / 2;


    return (
        <svg width="100%" height={Math.max(200, maxY + NODE_RADIUS + 20)} viewBox={`0 0 ${MAX_WIDTH} ${Math.max(200, maxY + NODE_RADIUS + 20)}`}>
            {nodes.map(node => {
                if (node.x === undefined || node.y === undefined) return null;
                const parentNode = node.parent !== null ? nodes[node.parent] : null;
                return (
                    <React.Fragment key={`fg-${node.id}`}>
                        {parentNode && parentNode.x !== undefined && parentNode.y !== undefined && (
                            <line
                                x1={parentNode.x * scale + xOffset} y1={parentNode.y}
                                x2={node.x * scale + xOffset} y2={node.y}
                                stroke="hsl(var(--muted-foreground))" strokeWidth="1"
                            />
                        )}
                        <circle cx={node.x * scale + xOffset} cy={node.y} r={NODE_RADIUS} fill={getElementColor(node.id).split(' ')[0].replace('bg-', 'var(--)')} 
                                className={getElementColor(node.id)} // For text color potentially
                                stroke="hsl(var(--border))" strokeWidth="1"/>
                        <text x={node.x * scale + xOffset} y={node.y} dy=".3em" textAnchor="middle" fontSize="10px" 
                              fill={getElementColor(node.id).includes('foreground') ? 'hsl(var(--primary-foreground))' : 'hsl(var(--secondary-foreground))'}
                              className="font-semibold">
                            {node.id}
                        </text>
                    </React.Fragment>
                );
            })}
        </svg>
    );
  };


  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">DSU State Visualization</CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-start bg-muted/10 dark:bg-muted/5 p-4 rounded-b-lg space-y-3 overflow-auto">
        <div className="w-full">
            <p className="text-sm font-semibold mb-1">Parent Array (Index &rarr; Parent):</p>
            <div className="flex flex-wrap gap-1 justify-center">
                {parentArray.map((pVal, index) => (
                    <div key={`parent-${index}`} className={`p-1.5 border rounded-md text-xs min-w-[40px] text-center ${getElementColor(index)}`}>
                        {index}&rarr;{pVal}
                    </div>
                ))}
            </div>
        </div>
        {rankArray && (
            <div className="w-full">
                <p className="text-sm font-semibold mb-1">Rank Array:</p>
                <div className="flex flex-wrap gap-1 justify-center">
                {rankArray.map((rVal, index) => (
                    <div key={`rank-${index}`} className={`p-1.5 border rounded-md text-xs min-w-[40px] text-center ${getElementColor(index)}`}>
                        {index}:{rVal}
                    </div>
                ))}
                </div>
            </div>
        )}
        {sizeArray && (
             <div className="w-full">
                <p className="text-sm font-semibold mb-1">Size Array:</p>
                <div className="flex flex-wrap gap-1 justify-center">
                {sizeArray.map((sVal, index) => (
                    <div key={`size-${index}`} className={`p-1.5 border rounded-md text-xs min-w-[40px] text-center ${getElementColor(index)}`}>
                        {index}:{sVal}
                    </div>
                ))}
                </div>
            </div>
        )}
        <div className="w-full mt-4">
            <p className="text-sm font-semibold mb-1">Set Structure (Forest View):</p>
            <div className="border rounded-md p-2 bg-background min-h-[150px] flex items-center justify-center overflow-x-auto">
                {N > 0 ? renderForest() : <p className="text-muted-foreground text-sm">No elements to display forest.</p>}
            </div>
        </div>

        {(operation === 'union' && root1 !== undefined && root2 !== undefined) && (
            <Badge variant="outline" className="mt-2">Union Roots: {root1} and {root2}</Badge>
        )}
        {(operation === 'find' && elementsInvolved && root1 !== undefined) && (
             <Badge variant="outline" className="mt-2">Find({elementsInvolved[0]}) Result: Root is {root1}</Badge>
        )}

      </CardContent>
    </Card>
  );
}
