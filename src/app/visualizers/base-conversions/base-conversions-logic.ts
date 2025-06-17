
import type { AlgorithmStep } from '@/types';

export const BASE_CONVERSION_LINE_MAP_DEC_TO_BASE = {
  funcDeclare: 1,
  handleZero: 2,
  initResultDigits: 3,
  loopWhileNumPositive: 4,
  getRemainder: 5,
  prependDigit: 6,
  updateNum: 7,
  returnResult: 8,
};

export const BASE_CONVERSION_LINE_MAP_BASE_TO_DEC = {
  funcDeclare: 10,
  initDecimalMap: 11,
  initResultPower: 12,
  loopThroughDigits: 13,
  getDigitValue: 14,
  checkInvalidDigit: 15,
  addToResult: 16,
  incrementPower: 17,
  returnResult: 18,
};

export interface BaseConversionStep extends AlgorithmStep {
  auxiliaryData: {
    originalNumber: string;
    fromBase: number;
    toBase: number;
    currentValue: string | number; // Can be number during dec-to-base, string for base-to-dec
    intermediateResult?: string; // e.g. remainders collected, sum accumulated
    finalResult?: string;
    equation?: string; // e.g. 42 / 2 = 21 R 0
    message: string;
  };
}

const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const generateBaseConversionSteps = (
  numberStr: string,
  fromBase: number,
  toBase: number
): BaseConversionStep[] => {
  const localSteps: BaseConversionStep[] = [];

  const addStep = (
    line: number | null,
    message: string,
    currentVal: string | number,
    intermediate?: string,
    final?: string,
    eq?: string
  ) => {
    localSteps.push({
      array: [], activeIndices: [], swappingIndices: [], sortedIndices: [],
      currentLine: line, message,
      auxiliaryData: {
        originalNumber: numberStr, fromBase, toBase,
        currentValue: currentVal,
        intermediateResult: intermediate,
        finalResult: final,
        equation: eq,
        message: message,
      },
    });
  };

  // Step 1: Convert fromBase to Decimal (if not already decimal)
  let decimalValue = 0;
  let numToConvert = numberStr;

  if (fromBase !== 10) {
    const lm = BASE_CONVERSION_LINE_MAP_BASE_TO_DEC;
    addStep(lm.funcDeclare, `Convert "${numberStr}" (base ${fromBase}) to Decimal.`, numberStr);
    let power = 0;
    let tempDecimal = 0;
    addStep(lm.initResultPower, `Initialize decimalResult = 0, power = 0.`, numberStr, `Sum: ${tempDecimal}`);
    
    for (let i = numberStr.length - 1; i >= 0; i--) {
      const char = numberStr[i].toUpperCase();
      const digitValue = DIGITS.indexOf(char);
      addStep(lm.loopThroughDigits, `Processing digit '${char}' from right.`, char, `Sum: ${tempDecimal}, Power: ${power}`);
      
      if (digitValue === -1 || digitValue >= fromBase) {
        addStep(lm.checkInvalidDigit, `Invalid digit '${char}' for base ${fromBase}. Aborting.`, char);
        return localSteps; // Or throw error
      }
      addStep(lm.getDigitValue, `Digit '${char}' has value ${digitValue}.`, char, `Sum: ${tempDecimal}, Power: ${power}`);
      
      tempDecimal += digitValue * Math.pow(fromBase, power);
      const term = `${digitValue}*${fromBase}^${power}`;
      addStep(lm.addToResult, `Add ${term} to sum. Sum = ${tempDecimal}.`, char, `Sum: ${tempDecimal}`, undefined, `${term} = ${digitValue * Math.pow(fromBase, power)}`);
      power++;
      addStep(lm.incrementPower, `Increment power to ${power}.`, char, `Sum: ${tempDecimal}, Power: ${power}`);
    }
    decimalValue = tempDecimal;
    numToConvert = decimalValue.toString(); // Now use decimal for next step
    addStep(lm.returnResult, `Decimal equivalent of "${numberStr}" (base ${fromBase}) is ${decimalValue}.`, decimalValue, `Final Sum: ${decimalValue}`);
  } else {
    decimalValue = parseInt(numberStr, 10);
    if (isNaN(decimalValue)) {
       addStep(null, `Invalid decimal number: "${numberStr}". Aborting.`, numberStr);
       return localSteps;
    }
     addStep(null, `Input "${numberStr}" is already in Decimal (base 10). Value: ${decimalValue}.`, decimalValue);
  }

  // Step 2: Convert Decimal to toBase (if not already decimal)
  if (toBase !== 10) {
    const lm = BASE_CONVERSION_LINE_MAP_DEC_TO_BASE;
    addStep(lm.funcDeclare, `Convert Decimal ${decimalValue} to Base ${toBase}.`, decimalValue);
    if (decimalValue === 0) {
      addStep(lm.handleZero, `Decimal is 0. Result is '0' in base ${toBase}.`, 0, "0", "0");
      return localSteps;
    }
    let tempNum = decimalValue;
    let resultStr = "";
    addStep(lm.initResultDigits, `Initialize result string = "". Current number = ${tempNum}.`, tempNum, resultStr);

    while (tempNum > 0) {
      addStep(lm.loopWhileNumPositive, `Loop: ${tempNum} > 0.`, tempNum, resultStr);
      const remainder = tempNum % toBase;
      addStep(lm.getRemainder, `Remainder = ${tempNum} % ${toBase} = ${remainder}.`, tempNum, resultStr, undefined, `${tempNum} / ${toBase} = ${Math.floor(tempNum/toBase)} R ${remainder}`);
      resultStr = DIGITS[remainder] + resultStr;
      addStep(lm.prependDigit, `Prepend digit '${DIGITS[remainder]}' (from remainder). Result = "${resultStr}".`, tempNum, resultStr, undefined, `${tempNum} / ${toBase} = ${Math.floor(tempNum/toBase)} R ${remainder}`);
      tempNum = Math.floor(tempNum / toBase);
      addStep(lm.updateNum, `Update number = floor(${tempNum*toBase + remainder} / ${toBase}) = ${tempNum}.`, tempNum, resultStr);
    }
    addStep(lm.returnResult, `Final result in base ${toBase}: "${resultStr}".`, tempNum, resultStr, resultStr);
  } else { // Target is decimal, and we already have decimalValue
     addStep(null, `Target base is 10. Result is ${decimalValue}.`, decimalValue, decimalValue.toString(), decimalValue.toString());
  }
  
  return localSteps;
};
