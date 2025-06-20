
// src/app/visualizers/base-conversions/base-conversions-logic.ts
import type { BaseConversionStep } from './types'; // Local, more specific type

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

const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const generateBaseConversionSteps = (
  numberStr: string,
  fromBase: number,
  toBase: number
): BaseConversionStep[] => {
  const localSteps: BaseConversionStep[] = [];
  let finalOutputString: string = ""; // To hold the final converted string for the last step

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
    if (final) {
      finalOutputString = final;
    }
  };

  let decimalValue = 0;
  let numToConvertForSecondPhase = numberStr; // Stores the number (as string) for the dec to base B phase

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
        // Add a final "error" step
        addStep(null, "Conversion failed due to invalid input digit.", numberStr, undefined, undefined, undefined);
        return localSteps; 
      }
      addStep(lm.getDigitValue, `Digit '${char}' has value ${digitValue}.`, char, `Sum: ${tempDecimal}, Power: ${power}`);
      
      tempDecimal += digitValue * Math.pow(fromBase, power);
      const term = `${digitValue}*${fromBase}^${power}`;
      addStep(lm.addToResult, `Add ${term} to sum. Sum = ${tempDecimal}.`, char, `Sum: ${tempDecimal}`, undefined, `${term} = ${digitValue * Math.pow(fromBase, power)}`);
      power++;
      addStep(lm.incrementPower, `Increment power to ${power}.`, char, `Sum: ${tempDecimal}, Power: ${power}`);
    }
    decimalValue = tempDecimal;
    numToConvertForSecondPhase = decimalValue.toString(); 
    addStep(lm.returnResult, `Decimal equivalent of "${numberStr}" (base ${fromBase}) is ${decimalValue}.`, decimalValue, `Final Sum: ${decimalValue}`);
  } else {
    decimalValue = parseInt(numberStr, 10);
    if (isNaN(decimalValue)) {
       addStep(null, `Invalid decimal number: "${numberStr}". Aborting.`, numberStr);
       addStep(null, "Conversion failed due to invalid input.", numberStr, undefined, undefined, undefined);
       return localSteps;
    }
     addStep(null, `Input "${numberStr}" is already in Decimal (base 10). Value: ${decimalValue}.`, decimalValue);
     numToConvertForSecondPhase = numberStr; // If fromBase is 10, this is what goes to next phase
  }

  let finalResultForThisConversion = decimalValue.toString(); // Default if toBase is 10

  if (toBase !== 10) {
    const lm = BASE_CONVERSION_LINE_MAP_DEC_TO_BASE;
    addStep(lm.funcDeclare, `Convert Decimal ${decimalValue} to Base ${toBase}.`, decimalValue);
    if (decimalValue === 0) {
      addStep(lm.handleZero, `Decimal is 0. Result is '0' in base ${toBase}.`, 0, "0", "0");
      finalResultForThisConversion = "0";
    } else {
      let tempNumForToPhase = decimalValue; // Use a new temp var for this phase
      let resultStr = "";
      addStep(lm.initResultDigits, `Initialize result string = "". Current number = ${tempNumForToPhase}.`, tempNumForToPhase, resultStr);

      while (tempNumForToPhase > 0) {
        addStep(lm.loopWhileNumPositive, `Loop: ${tempNumForToPhase} > 0.`, tempNumForToPhase, resultStr);
        const remainder = tempNumForToPhase % toBase;
        addStep(lm.getRemainder, `Remainder = ${tempNumForToPhase} % ${toBase} = ${remainder}.`, tempNumForToPhase, resultStr, undefined, `${tempNumForToPhase} / ${toBase} = ${Math.floor(tempNumForToPhase/toBase)} R ${remainder}`);
        resultStr = DIGITS[remainder] + resultStr;
        addStep(lm.prependDigit, `Prepend digit '${DIGITS[remainder]}' (from remainder). Result = "${resultStr}".`, tempNumForToPhase, resultStr, undefined, `${tempNumForToPhase} / ${toBase} = ${Math.floor(tempNumForToPhase/toBase)} R ${remainder}`);
        tempNumForToPhase = Math.floor(tempNumForToPhase / toBase);
        addStep(lm.updateNum, `Update number = floor(${(tempNumForToPhase*toBase) + remainder} / ${toBase}) = ${tempNumForToPhase}.`, tempNumForToPhase, resultStr);
      }
      finalResultForThisConversion = resultStr;
      addStep(lm.returnResult, `Final result in base ${toBase}: "${resultStr}".`, 0, resultStr, resultStr); // currentVal is 0 when loop ends
    }
  } else { // toBase is 10
     addStep(null, `Target base is 10. Result is decimal ${decimalValue}.`, decimalValue, decimalValue.toString(), decimalValue.toString());
     finalResultForThisConversion = decimalValue.toString();
  }
  
  // Consistent final step
  addStep(null, `Algorithm complete. Result: ${finalOutputString} (base ${toBase}).`,
    (toBase === 10) ? decimalValue : 0, // Last 'currentValue' is 0 if decimalValue became 0
    finalOutputString, // 'intermediateResult' can be the same as final here
    finalOutputString, // 'finalResult'
    undefined
  );
  
  return localSteps;
};

