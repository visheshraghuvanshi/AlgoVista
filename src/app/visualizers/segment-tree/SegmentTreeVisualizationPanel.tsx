"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VisualizationPanelProps } from './types'; // Local import

const ELEMENT_BOX_SIZE = 35; 
const ELEMENT_MARGIN = 4;
const LEVEL_MARGIN = 60; 
const SVG_PADDING_X = 20;
const SVG_PADDING_Y = 30;

const NODE_COLORS = {
  leaf: "bg-green-500/30 text-green-800 dark:text-green-300 border-green-500/50",
  internal: "bg-blue-500/30 text-blue-800 dark:text-blue-300 border-blue-500/50",
  highlighted: "bg-yellow-400/40 text-yellow-900 dark:text-yellow-300 border-yellow-500/50",
  updated: "bg-red-500/40 text-red-800 dark:text-red-300 border-red-500/50",
  defaultText: "text-card-foreground",
};

const InputArrayElement = ({ value, index, isHighlighted }: { value: number, index: number, isHighlighted: boolean }) => (
  <div
    className={`flex flex-col items-center justify-center rounded border text-xs font-medium 
                ${isHighlighted ? "bg-accent text-accent-foreground ring-2 ring-accent" : "bg-secondary text-secondary-foreground"}`}
    style={{ width: `${ELEMENT_BOX_SIZE}px`, height: `${ELEMENT_BOX_SIZE * 0.8}px` }}
    title={`Input[${index}] = ${value}`}
  >
    <span className="text-muted-foreground text-[9px]">{index}</span>
    <span>{value}</span>
  </div>
);


export function SegmentTreeVisualizationPanel({ 
  data, 
  activeIndices = [],
  originalInputArray = [],
  processingSubArrayRange = null,
  originalArraySize = 0, 
}: VisualizationPanelProps) {
  
  const n = originalArraySize; 
  const tree = data; 

  const nodePositions: { id: string; x: number; y: number; value: number; label: string; isLeaf: boolean, originalIndex?: number, treeIndex: number }[] = [];
  const edges: { id: string; sourceId: string; targetId: string }[] = [];

  if (tree.length > 1 && n > 0) {
    const treeDepth = Math.ceil(Math.log2(n)) + 1;
    const maxLeafNodesAtBottom = Math.pow(2, treeDepth -1);
    const svgTreeWidth = Math.max(300, maxLeafNodesAtBottom * (ELEMENT_BOX_SIZE + ELEMENT_MARGIN * 3));


    const calculateTreePositions = (nodeTreeIndex: number, x: number, y: number, horizontalSpan: number) => {
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(horizontalSpan)) {
        console.error(`SegmentTreeViz: NaN or Infinite parameter in calculateTreePositions. Index: ${nodeTreeIndex}, X: ${x}, Y: ${y}, Span: ${horizontalSpan}`);
        return; 
      }

      if (nodeTreeIndex >= tree.length || nodeTreeIndex === 0 || tree[nodeTreeIndex] === undefined) return;
      
      const isLeaf = nodeTreeIndex >= n && nodeTreeIndex < 2 * n;
      
      nodePositions.push({
        id: `tree-${nodeTreeIndex}`,
        x: x,
        y: y,
        value: tree[nodeTreeIndex],
        label: `T[${nodeTreeIndex}]`,
        isLeaf: isLeaf,
        originalIndex: isLeaf ? nodeTreeIndex - n : undefined,
        treeIndex: nodeTreeIndex,
      });

      const leftChildIndex = nodeTreeIndex * 2;
      const rightChildIndex = nodeTreeIndex * 2 + 1;
      
      if (!isLeaf) {
        const childY = y + LEVEL_MARGIN;
        const childSpan = horizontalSpan / 2;
        if (leftChildIndex < tree.length && tree[leftChildIndex] !== undefined) {
          const childXLeft = x - horizontalSpan / 2;
           if(Number.isFinite(childXLeft) && Number.isFinite(childSpan)) {
            edges.push({ id: `edge-${nodeTreeIndex}-${leftChildIndex}`, sourceId: `tree-${nodeTreeIndex}`, targetId: `tree-${leftChildIndex}` });
            calculateTreePositions(leftChildIndex, childXLeft, childY, childSpan);
          } else {
            console.error(`SegmentTreeViz: Skipped left child due to NaN/Infinite coords. ParentIdx: ${nodeTreeIndex}, ChildIdx: ${leftChildIndex}, ChildX: ${childXLeft}, ChildSpan: ${childSpan}`);
          }
        }
        if (rightChildIndex < tree.length && tree[rightChildIndex] !== undefined) {
          const childXRight = x + horizontalSpan / 2;
           if(Number.isFinite(childXRight) && Number.isFinite(childSpan)) {
            edges.push({ id: `edge-${nodeTreeIndex}-${rightChildIndex}`, sourceId: `tree-${nodeTreeIndex}`, targetId: `tree-${rightChildIndex}` });
            calculateTreePositions(rightChildIndex, childXRight, childY, childSpan);
          } else {
            console.error(`SegmentTreeViz: Skipped right child due to NaN/Infinite coords. ParentIdx: ${nodeTreeIndex}, ChildIdx: ${rightChildIndex}, ChildX: ${childXRight}, ChildSpan: ${childSpan}`);
          }
        }
      }
    };
    
    if (tree.length > 1 && n > 0) { // Ensure n is positive before log2
        calculateTreePositions(1, svgTreeWidth / 2, SVG_PADDING_Y, svgTreeWidth / 2);
    }
  }
  
  const calculatedSvgHeight = Math.max(250, nodePositions.reduce((max, p) => Math.max(max, p.y + ELEMENT_BOX_SIZE), 0) + SVG_PADDING_Y);
  const calculatedSvgWidth = Math.max(300, nodePositions.reduce((max, p) => Math.max(max, p.x + ELEMENT_BOX_SIZE/2), 0) + SVG_PADDING_X * 2);

  const getElementColorClasses = (treeIndex: number, isLeaf: boolean) => {
    if (activeIndices.includes(treeIndex)) return NODE_COLORS.highlighted;
    return isLeaf ? NODE_COLORS.leaf : NODE_COLORS.internal;
  };

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[500px] md:h-[600px] lg:h-[700px] flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">Segment Tree Visualization</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-2 space-y-2 bg-muted/10 dark:bg-muted/5 overflow-hidden">
        <div className="mb-3">
            <p className="font-semibold text-sm mb-1">Input Array:</p>
            <div className="flex flex-wrap gap-1 p-1 border rounded bg-background/30 overflow-x-auto">
            {originalInputArray.length > 0 ? originalInputArray.map((val, idx) => (
                 <InputArrayElement 
                    key={`input-${idx}`} 
                    value={val} 
                    index={idx} 
                    isHighlighted={processingSubArrayRange !== null && idx >= processingSubArrayRange[0] && idx < processingSubArrayRange[1]}
                 />
            )) : <p className="text-xs text-muted-foreground italic p-1">(Build tree to see input array)</p>}
            </div>
        </div>
        
        <div className="flex-grow w-full border rounded-md bg-background overflow-auto">
          {nodePositions.length === 0 && n > 0 && (
             <div className="flex items-center justify-center h-full"><p className="text-muted-foreground">Segment tree not built or empty.</p></div>
          )}
          {nodePositions.length > 0 && (
            <svg width={calculatedSvgWidth} height={calculatedSvgHeight} viewBox={`0 0 ${calculatedSvgWidth} ${calculatedSvgHeight}`}>
              {edges.map(edge => {
                const sourceNode = nodePositions.find(n => n.id === edge.sourceId);
                const targetNode = nodePositions.find(n => n.id === edge.targetId);
                if (!sourceNode || !targetNode || 
                    !Number.isFinite(sourceNode.x) || !Number.isFinite(sourceNode.y) ||
                    !Number.isFinite(targetNode.x) || !Number.isFinite(targetNode.y)
                   ) {
                       console.error("SegmentTreeViz: Skipping edge due to invalid node data", edge, sourceNode, targetNode);
                       return null; 
                }
                return (
                  <line
                    key={edge.id}
                    x1={sourceNode.x} y1={sourceNode.y + ELEMENT_BOX_SIZE / 2}
                    x2={targetNode.x} y2={targetNode.y - ELEMENT_BOX_SIZE / 2}
                    stroke="hsl(var(--muted-foreground))" strokeWidth="1"
                  />
                );
              })}
              {nodePositions.map(node => {
                 if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) {
                    console.error("SegmentTreeViz: Skipping node due to invalid coords", node);
                    return null;
                 }
                return (
                  <g key={node.id} transform={`translate(${node.x - ELEMENT_BOX_SIZE / 2}, ${node.y - ELEMENT_BOX_SIZE / 2})`}>
                    <rect
                      width={ELEMENT_BOX_SIZE} height={ELEMENT_BOX_SIZE}
                      className={`transition-colors duration-150 ${getElementColorClasses(node.treeIndex, node.isLeaf).split(' ')[0]}`}
                      stroke="hsl(var(--border))"
                      rx="3"
                    />
                    <text
                      x={ELEMENT_BOX_SIZE / 2} y={ELEMENT_BOX_SIZE / 2}
                      textAnchor="middle" dy=".3em"
                      fontSize="10px"
                      className={`font-semibold ${getElementColorClasses(node.treeIndex, node.isLeaf).split(' ')[1] || 'text-foreground'}`}
                    >
                      {node.value}
                    </text>
                    <text
                      x={ELEMENT_BOX_SIZE / 2} y={ELEMENT_BOX_SIZE + 8}
                      textAnchor="middle" fontSize="8px" fill="hsl(var(--muted-foreground))"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
