"use client";

import React, {useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { BASE_CONVERSION_LINE_MAP_DEC_TO_BASE, BASE_CONVERSION_LINE_MAP_BASE_TO_DEC } from './base-conversions-logic';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';


export const BASE_CONVERSION_CODE_SNIPPETS: Record<string, string[]> = {
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
  Python: [
    "# Convert Decimal to Base B (Integer part)",
    "def decimal_to_base_b(decimal_num, base_b):",
    "    if decimal_num == 0: return '0'",
    "    result = ''",
    "    digits_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'",
    "    while decimal_num > 0:",
    "        result = digits_chars[decimal_num % base_b] + result",
    "        decimal_num //= base_b",
    "    return result",
    "",
    "# Convert Base B to Decimal (Integer part)",
    "def base_b_to_decimal(base_b_num_str, base_b):",
    "    decimal_num = 0",
    "    power = 0",
    "    digits_map = {char: idx for idx, char in enumerate('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')}",
    "    for char_digit in reversed(base_b_num_str):",
    "        digit_value = digits_map.get(char_digit.upper())",
    "        if digit_value is None or digit_value >= base_b:",
    "            raise ValueError('Invalid digit for base')",
    "        decimal_num += digit_value * (base_b ** power)",
    "        power += 1",
    "    return decimal_num",
  ],
  Java: [
    "// Convert Decimal to Base B (Integer part)",
    "public class BaseConverter {",
    "    public static String decimalToBaseB(int decimalNum, int baseB) {",
    "        if (decimalNum == 0) return \"0\";",
    "        StringBuilder result = new StringBuilder();",
    "        String digitsChars = \"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ\";",
    "        while (decimalNum > 0) {",
    "            result.insert(0, digitsChars.charAt(decimalNum % baseB));",
    "            decimalNum /= baseB;",
    "        }",
    "        return result.toString();",
    "    }",
    "",
    "// Convert Base B to Decimal (Integer part)",
    "    public static int baseBToDecimal(String baseBNumStr, int baseB) {",
    "        int decimalNum = 0;",
    "        int power = 0;",
    "        String digitsChars = \"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ\";",
    "        for (int i = baseBNumStr.length() - 1; i >= 0; i--) {",
    "            char charDigit = baseBNumStr.toUpperCase().charAt(i);",
    "            int digitValue = digitsChars.indexOf(charDigit);",
    "            if (digitValue == -1 || digitValue >= baseB) {",
    "                throw new IllegalArgumentException(\"Invalid digit for base\");",
    "            }",
    "            decimalNum += digitValue * Math.pow(baseB, power);",
    "            power++;",
    "        }",
    "        return decimalNum;",
    "    }",
    "}",
  ],
  "C++": [
    "// Convert Decimal to Base B (Integer part)",
    "#include <string>",
    "#include <vector>",
    "#include <algorithm> // For std::reverse",
    "#include <cmath>     // For std::pow",
    "std::string decimalToBaseB(int decimalNum, int baseB) {",
    "    if (decimalNum == 0) return \"0\";",
    "    std::string result = \"\";",
    "    const std::string digitsChars = \"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ\";",
    "    while (decimalNum > 0) {",
    "        result += digitsChars[decimalNum % baseB];",
    "        decimalNum /= baseB;",
    "    }",
    "    std::reverse(result.begin(), result.end());",
    "    return result;",
    "}",
    "",
    "// Convert Base B to Decimal (Integer part)",
    "int baseBToDecimal(std::string baseBNumStr, int baseB) {",
    "    int decimalNum = 0;",
    "    int power = 0;",
    "    const std::string digitsChars = \"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ\";",
    "    for (int i = baseBNumStr.length() - 1; i >= 0; --i) {",
    "        char charDigit = std::toupper(baseBNumStr[i]);",
    "        size_t digitValue = digitsChars.find(charDigit);",
    "        if (digitValue == std::string::npos || digitValue >= baseB) {",
    "            throw std::invalid_argument(\"Invalid digit for base\");",
    "        }",
    "        decimalNum += digitValue * static_cast<int>(std::pow(baseB, power));",
    "        power++;",
    "    }",
    "    return decimalNum;",
    "}",
  ],
};

interface BaseConversionsCodePanelProps {
  currentLine: number | null;
}

export function BaseConversionsCodePanel({ currentLine }: BaseConversionsCodePanelProps) {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const languages = Object.keys(BASE_CONVERSION_CODE_SNIPPETS);
  const codeToDisplay = BASE_CONVERSION_CODE_SNIPPETS[selectedLanguage] || [];


  const handleCopyCode = () => {
    const codeString = codeToDisplay.join('\n');
    if (codeString) {
      navigator.clipboard.writeText(codeString)
        .then(() => toast({ title: `${selectedLanguage} Base Conversion Code Copied!` }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  return (
    <Card className="shadow-lg rounded-lg h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="font-headline text-xl text-primary dark:text-accent flex items-center">
          <Code2 className="mr-2 h-5 w-5" /> Conceptual Code
        </CardTitle>
        <div className="flex items-center gap-2">
            <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="w-auto">
                <TabsList className="grid w-full grid-cols-4 h-8 text-xs p-0.5">
                    {languages.map(lang => (
                        <TabsTrigger key={lang} value={lang} className="text-xs px-1.5 py-0.5 h-auto">
                            {lang}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                <ClipboardCopy className="h-4 w-4 mr-1" /> Copy
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 pt-2 flex flex-col">
        <ScrollArea className="flex-1 overflow-auto border-t bg-muted/20 dark:bg-muted/5">
          <pre className="font-code text-sm p-4">
            {codeToDisplay.map((line, index) => (
              <div key={`bc-${selectedLanguage}-line-${index}`}
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
