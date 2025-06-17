
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DPAlgorithmStep } from '@/types';
import { Badge } from "@/components/ui/badge";

interface CoinChangeVisualizationPanelProps {
  step: DPAlgorithmStep | null;
}

export function CoinChangeVisualizationPanel({ step }: CoinChangeVisualizationPanelProps) {
  if (!step || !step.dpTable || !Array.isArray(step.dpTable) || (Array.isArray(step.dpTable) && Array.isArray(step.dpTable[0]))) {
    // This check ensures dpTable is number[] for Coin Change
    return (
      <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
        <CardHeader><CardTitle className="font-headline text-xl text-primary dark:text-accent">Coin Change DP Table</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center flex-grow"><p className="text-muted-foreground">Enter coins and amount, then click "Solve".</p></CardContent>
      </Card>
    );
  }

  const { dpTable, highlightedCells, message, auxiliaryData, resultValue } = step;
  const coins = auxiliaryData?.coins as number[] || [];
  const problemType = auxiliaryData?.problemType as string || "";
  const currentAmount = step.currentIndices?.amount;
  const currentCoin = step.currentIndices?.coin;

  const getCellClass = (index: number) => {
    const highlight = highlightedCells?.find(cell => cell.col === index); // col used as index for 1D array
    if (highlight) {
      if (highlight.type === 'current') return 'bg-accent text-accent-foreground scale-110 shadow-lg z-10';
      if (highlight.type === 'dependency') return 'bg-primary/30 dark:bg-primary/40';
      if (highlight.type === 'result') return 'bg-green-500/80 text-white';
    }
    if (index === 0 && dpTable[index] !== Infinity && dpTable[index] !== (auxiliaryData?.infinityVal || Infinity) ) return 'bg-muted/50 text-muted-foreground'; // Base case
    return 'bg-card text-card-foreground';
  };

  const infinityVal = auxiliaryData?.infinityVal || Infinity;

  return (
    <Card className="flex-1 shadow-lg rounded-lg overflow-hidden h-auto md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent">
          Coin Change DP Table ({problemType === 'minCoins' ? 'Min Coins' : 'Number of Ways'})
        </CardTitle>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
        {currentAmount !== undefined && <Badge variant="outline" className="mr-1">Amount: {currentAmount}</Badge>}
        {currentCoin !== undefined && <Badge variant="outline">Coin: {currentCoin}</Badge>}
        {resultValue !== undefined && resultValue !== -1 && (
            <p className="text-sm font-bold mt-1">
                Result: {problemType === 'minCoins' ? `Min Coins: ${resultValue}` : `Num Ways: ${resultValue}`}
            </p>
        )}
        {resultValue === -1 && problemType === 'minCoins' && (
            <p className="text-sm font-bold text-red-500 mt-1">Result: Not Possible</p>
        )}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-2 md:p-4 bg-muted/10 dark:bg-muted/5 rounded-b-lg overflow-auto">
        <div className="overflow-auto flex-grow">
          <div className="flex flex-wrap gap-1">
            {(dpTable as number[]).map((value, index) => (
              <div
                key={`dp-cell-${index}`}
                className={`flex flex-col items-center justify-center p-1 border rounded min-w-[40px] min-h-[40px] ${getCellClass(index)} transition-all duration-150`}
                title={`dp[${index}] = ${value === infinityVal ? '∞' : value}`}
              >
                <span className="text-xs text-muted-foreground -mb-0.5">{index}</span>
                <span className="font-bold text-sm">{value === infinityVal ? '∞' : value}</span>
              </div>
            ))}
          </div>
        </div>
         {auxiliaryData?.currentCalculation && (
          <div className="mt-2 p-2 border rounded-md bg-background shadow">
            <p className="text-xs font-semibold">Calculation:</p>
            <p className="text-xs font-code">{auxiliaryData.currentCalculation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    