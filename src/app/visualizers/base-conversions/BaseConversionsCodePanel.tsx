
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { BASE_CONVERSION_LINE_MAP_DEC_TO_BASE, BASE_CONVERSION_LINE_MAP_BASE_TO_DEC } from './base-conversions-logic';

// Combined for display, actual logic maps distinct parts.
// The visualization panel will highlight relative to these snippets.
export const BASE_CONVERSION_CODE_SNIPPETS = {
  JavaScript: [
    "// Convert Decimal to Base B (Integer part)",      // 1 (dec_to_base.funcDeclare)
    "function decimalToBaseB(decimalNum, baseB) {",
    "  if (decimalNum === 0) return '0';",            // 2 (dec_to_base.handleZero)
    "  let result = '';",                             // 3 (dec_to_base.initResultDigits)
    "  const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';",
    "  while (decimalNum > 0) {",                      // 4 (dec_to_base.loopWhileNumPositive)
    "    result = digits[decimalNum % baseB] + result;",// 5 & 6 (dec_to_base.getRemainder & prependDigit)
    "    decimalNum = Math.floor(decimalNum / baseB);",// 7 (dec_to_base.updateNum)
    "  }",
    "  return result;",                                 // 8 (dec_to_base.returnResult)
    "}",
    "",
    "// Convert Base B to Decimal (Integer part)",      // 10 (base_to_dec.funcDeclare)
    "function baseBToDecimal(baseBNumStr, baseB) {",
    "  let decimalNum = 0;",                           // 11 (base_to_dec.initDecimalMap)
    "  let power = 0;",                                // 12 (base_to_dec.initResultPower)
    "  const digitsMap = {}; /* {'0':0 ...} */",       // conceptually, part of init
    "  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((char, idx) => digitsMap[char] = idx);",
    "",
    "  for (let i = baseBNumStr.length - 1; i >= 0; i--) {", // 13 (base_to_dec.loopThroughDigits)
    "    const digitValue = digitsMap[baseBNumStr[i].toUpperCase()];", // 14 (base_to_dec.getDigitValue)
    "    if (digitValue === undefined || digitValue >= baseB) {",    // 15 (base_to_dec.checkInvalidDigit)
    "      throw new Error('Invalid digit');",
    "    }",
    "    decimalNum += digitValue * Math.pow(baseB, power);", // 16 (base_to_dec.addToResult)
    "    power++;",                                           // 17 (base_to_dec.incrementPower)
    "  }",
    "  return decimalNum;",                                     // 18 (base_to_dec.returnResult)
    "}",
  ],
};

interface BaseConversionsCodePanelProps {
  currentLine: number | null;
}

export function BaseConversionsCodePanel({ currentLine }: BaseConversionsCodePanelProps) {
  const { toast } = useToast();

  const handleCopyCode = () => {
    const codeString = BASE_CONVERSION_CODE_SNIPPETS.JavaScript.join('\n');
    navigator.clipboard.writeText(codeString)
      .then(() => toast({ title: `Base Conversion Code Copied!` }))
      .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Conceptual Code (JS)
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopyCode}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {BASE_CONVERSION_CODE_SNIPPETS.JavaScript.map((line, index) => (
              <div key={`bc-line-${index}`}
                className={`px-2 py-0.5 rounded whitespace-pre-wrap ${index + 1 === currentLine ? "bg-accent text-accent-foreground" : "text-foreground"}`}>
                <span className="select-none text-muted-foreground/50 w-8 inline-block mr-2 text-right">{index + 1}</span>
                {line}
              </div>
            ))}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
