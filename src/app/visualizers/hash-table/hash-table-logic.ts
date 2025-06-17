
import type { HashTableStep, HashTableEntry, HashValue } from '@/types';

export const HASH_TABLE_LINE_MAP = {
  // General
  classDef: 1,
  constructor: 2,
  hashFuncStart: 3,
  hashLoop: 4,
  hashReturn: 5,

  // Insert
  insertFuncStart: 6,
  insertGetIndex: 7,
  insertGetBucket: 8,
  insertLoopBucketCheckExists: 9,
  insertUpdateExisting: 10,
  insertPushNew: 11,
  insertEnd: 12,

  // Search
  searchFuncStart: 13,
  searchGetIndex: 14,
  searchGetBucket: 15,
  searchLoopBucket: 16,
  searchCompareKey: 17,
  searchReturnFound: 18,
  searchReturnUndefined: 19,
  searchEnd: 20,

  // Delete
  deleteFuncStart: 21,
  deleteGetIndex: 22,
  deleteGetBucket: 23,
  deleteLoopBucket: 24,
  deleteCompareKey: 25,
  deleteSplice: 26,
  deleteReturnTrue: 27,
  deleteReturnFalse: 28,
  deleteEnd: 29,
};

function simpleHash(key: HashValue, tableSize: number): number {
  let hashValue = 0;
  const stringKey = String(key);
  for (let i = 0; i < stringKey.length; i++) {
    hashValue = (hashValue + stringKey.charCodeAt(i) * (i + 1)) % tableSize;
  }
  return hashValue;
}

const addStep = (
  steps: HashTableStep[],
  line: number | null,
  buckets: HashTableEntry[][],
  tableSize: number,
  operation: HashTableStep['operation'],
  message: string,
  currentKey?: HashValue,
  currentValue?: HashValue,
  hashIndex?: number,
  activeBucketIndex?: number | null,
  activeEntry?: HashTableEntry | null,
  foundValue?: HashValue | null
) => {
  steps.push({
    buckets: buckets.map(bucket => bucket.map(entry => [...entry] as HashTableEntry)),
    tableSize,
    operation,
    currentKey,
    currentValue,
    hashIndex,
    foundValue,
    message,
    currentLine: line,
    activeBucketIndex,
    activeEntry,
    // Unused AlgorithmStep fields
    activeIndices: activeBucketIndex !== null && activeBucketIndex !== undefined ? [activeBucketIndex] : [],
    swappingIndices: [],
    sortedIndices: [],
  });
};

export const generateHashTableSteps = (
  currentBuckets: HashTableEntry[][],
  tableSize: number,
  operation: 'insert' | 'search' | 'delete',
  key: HashValue,
  value?: HashValue // Only for insert
): HashTableStep[] => {
  const localSteps: HashTableStep[] = [];
  const newBuckets = currentBuckets.map(bucket => bucket.map(entry => [...entry] as HashTableEntry)); // Deep copy
  const lm = HASH_TABLE_LINE_MAP;

  addStep(localSteps, null, newBuckets, tableSize, operation, `Starting ${operation} operation with key: "${key}"` + (value !== undefined ? ` and value: "${value}"` : ""), key, value);

  const index = simpleHash(key, tableSize);
  addStep(localSteps, lm.hashFuncStart, newBuckets, tableSize, operation, `Hashing key "${key}"... Calculated hash index: ${index}`, key, value, index, index);

  const bucket = newBuckets[index];

  switch (operation) {
    case 'insert':
      if (value === undefined) {
        addStep(localSteps, lm.insertEnd, newBuckets, tableSize, operation, `Error: Value is undefined for insert.`, key, value, index, index, null, null);
        return localSteps;
      }
      addStep(localSteps, lm.insertGetBucket, newBuckets, tableSize, operation, `Accessing bucket at index ${index}.`, key, value, index, index);
      let updated = false;
      for (let i = 0; i < bucket.length; i++) {
        addStep(localSteps, lm.insertLoopBucketCheckExists, newBuckets, tableSize, operation, `Checking entry [${bucket[i][0]}, ${bucket[i][1]}] in bucket.`, key, value, index, index, bucket[i]);
        if (bucket[i][0] === key) {
          bucket[i][1] = value;
          updated = true;
          addStep(localSteps, lm.insertUpdateExisting, newBuckets, tableSize, operation, `Key "${key}" found. Updated value to "${value}".`, key, value, index, index, bucket[i]);
          break;
        }
      }
      if (!updated) {
        bucket.push([key, value]);
        addStep(localSteps, lm.insertPushNew, newBuckets, tableSize, operation, `Key "${key}" not found. Added new entry [${key}, ${value}].`, key, value, index, index, [key,value]);
      }
      addStep(localSteps, lm.insertEnd, newBuckets, tableSize, operation, `Insert operation for key "${key}" complete.`, key, value, index, index);
      break;

    case 'search':
      addStep(localSteps, lm.searchGetBucket, newBuckets, tableSize, operation, `Accessing bucket at index ${index}.`, key, undefined, index, index);
      let foundVal: HashValue | null = null;
      for (let i = 0; i < bucket.length; i++) {
        addStep(localSteps, lm.searchLoopBucket, newBuckets, tableSize, operation, `Checking entry [${bucket[i][0]}, ${bucket[i][1]}] in bucket.`, key, undefined, index, index, bucket[i]);
        addStep(localSteps, lm.searchCompareKey, newBuckets, tableSize, operation, `Is entry key "${bucket[i][0]}" === search key "${key}"?`, key, undefined, index, index, bucket[i]);
        if (bucket[i][0] === key) {
          foundVal = bucket[i][1];
          addStep(localSteps, lm.searchReturnFound, newBuckets, tableSize, operation, `Key "${key}" found. Value: "${foundVal}".`, key, undefined, index, index, bucket[i], foundVal);
          break;
        }
      }
      if (foundVal === null) {
        addStep(localSteps, lm.searchReturnUndefined, newBuckets, tableSize, operation, `Key "${key}" not found in bucket ${index}.`, key, undefined, index, index, null, null);
      }
      addStep(localSteps, lm.searchEnd, newBuckets, tableSize, operation, `Search for key "${key}" complete.`, key, undefined, index, index, null, foundVal);
      break;

    case 'delete':
      addStep(localSteps, lm.deleteGetBucket, newBuckets, tableSize, operation, `Accessing bucket at index ${index}.`, key, undefined, index, index);
      let deleted = false;
      for (let i = 0; i < bucket.length; i++) {
        addStep(localSteps, lm.deleteLoopBucket, newBuckets, tableSize, operation, `Checking entry [${bucket[i][0]}, ${bucket[i][1]}] in bucket.`, key, undefined, index, index, bucket[i]);
        addStep(localSteps, lm.deleteCompareKey, newBuckets, tableSize, operation, `Is entry key "${bucket[i][0]}" === delete key "${key}"?`, key, undefined, index, index, bucket[i]);
        if (bucket[i][0] === key) {
          const removedEntry = bucket.splice(i, 1)[0];
          deleted = true;
          addStep(localSteps, lm.deleteSplice, newBuckets, tableSize, operation, `Key "${key}" found. Removed entry [${removedEntry[0]}, ${removedEntry[1]}].`, key, undefined, index, index, removedEntry);
          addStep(localSteps, lm.deleteReturnTrue, newBuckets, tableSize, operation, `Deletion successful.`, key, undefined, index, index);
          break;
        }
      }
      if (!deleted) {
        addStep(localSteps, lm.deleteReturnFalse, newBuckets, tableSize, operation, `Key "${key}" not found in bucket ${index}. Nothing to delete.`, key, undefined, index, index);
      }
      addStep(localSteps, lm.deleteEnd, newBuckets, tableSize, operation, `Delete operation for key "${key}" complete.`, key, undefined, index, index);
      break;
  }
  return localSteps;
};

export const createInitialHashTable = (size: number): HashTableEntry[][] => {
  return Array(size).fill(null).map(() => []);
};

