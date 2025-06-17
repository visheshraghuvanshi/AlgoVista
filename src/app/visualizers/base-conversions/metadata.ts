
import type { AlgorithmMetadata } from '@/types';

export const algorithmMetadata: AlgorithmMetadata = {
  slug: 'base-conversions',
  title: 'Base Conversions',
  category: 'Math & Number Theory',
  difficulty: 'Easy',
  description: 'Converts numbers between different numeral systems (bases), e.g., decimal to binary.',
  longDescription: 'Base conversion is the process of changing the representation of a number from one numeral system (base) to another. Common bases include binary (base-2), octal (base-8), decimal (base-10), and hexadecimal (base-16).\n\n**Converting from Decimal to Another Base (e.g., Base B):**\nTo convert a decimal integer to base B, repeatedly divide the decimal number by B. The remainders of these divisions, read in reverse order of their calculation, form the digits of the number in base B.\nFor the fractional part, repeatedly multiply the fractional part by B. The integer parts of these products, read in order, form the digits of the fractional part in base B.\n\nExample: Convert decimal 42 to binary (Base 2)\n- 42 / 2 = 21 remainder 0\n- 21 / 2 = 10 remainder 1\n- 10 / 2 = 5  remainder 0\n- 5  / 2 = 2  remainder 1\n- 2  / 2 = 1  remainder 0\n- 1  / 2 = 0  remainder 1\nReading remainders in reverse: 101010. So, 42 (decimal) = 101010 (binary).\n\n**Converting from Another Base (e.g., Base B) to Decimal:**\nTo convert a number from base B to decimal, multiply each digit by B raised to the power of its position (starting from 0 for the rightmost integer digit, and -1 for the first fractional digit) and sum the results.\n\nExample: Convert binary 101010 to decimal\nDigits (right to left): 0, 1, 0, 1, 0, 1\nPositions (right to left, starting 0): 0, 1, 2, 3, 4, 5\nValue = (0 * 2^0) + (1 * 2^1) + (0 * 2^2) + (1 * 2^3) + (0 * 2^4) + (1 * 2^5)\n      = 0 + 2 + 0 + 8 + 0 + 32 = 42.\n\nConverting between non-decimal bases (e.g., binary to hexadecimal) can often be done more easily by first converting to decimal, or by using shortcut methods if one base is a power of the other (e.g., each hex digit corresponds to 4 binary digits).',
  timeComplexities: {
    best: "O(log_B N) for integer part, O(P) for P precision digits of fractional part",
    average: "O(log_B N) for integer part, O(P) for P precision digits of fractional part",
    worst: "O(log_B N) for integer part, O(P) for P precision digits of fractional part",
  },
  spaceComplexity: "O(log_B N) or O(P) for storing the digits of the result.",
};
    