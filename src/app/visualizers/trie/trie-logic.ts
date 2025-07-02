
import type { TrieStep, TrieNodeInternal, TrieNodeVisual, TrieEdgeVisual } from './types';

export const TRIE_LINE_MAP = {
  // Conceptual structure lines
  classNodeStart: 1,
  nodeConstructor: 2,
  classTrieStart: 3,
  trieConstructor: 4,
  // Insert
  insertFuncStart: 5,
  insertLoopChar: 6,
  insertCheckChildExists: 7,
  insertCreateChild: 8,
  insertMoveToChild: 9,
  insertMarkEndOfWord: 10,
  insertFuncEnd: 11,
  // Search
  searchFuncStart: 12,
  searchLoopChar: 13,
  searchCheckChildExists: 14,
  searchMoveToChild: 15,
  searchReturnFound: 16, // current.isEndOfWord
  searchFuncEnd: 17,
  // StartsWith
  startsWithFuncStart: 18,
  startsWithLoopChar: 19,
  startsWithCheckChildExists: 20,
  startsWithMoveToChild: 21,
  startsWithReturnTrue: 22, // Found prefix
  startsWithFuncEnd: 23,
};

let globalTrieNodeIdCounter = 0;
const generateTrieNodeId = (char: string | null, depth: number): string => `trie-${char === null ? 'root' : char}-${depth}-${globalTrieNodeIdCounter++}`;

const NODE_COLORS = {
  default: "hsl(var(--secondary))",
  active: "hsl(var(--primary))",
  path: "hsl(var(--accent))",
  endOfWord: "hsl(var(--ring))", // A distinct color for EOW nodes
  created: "hsl(var(--chart-2))", // Newly created node
};
const TEXT_COLORS = {
    default: "hsl(var(--secondary-foreground))",
    active: "hsl(var(--primary-foreground))",
    path: "hsl(var(--accent-foreground))",
    endOfWord: "hsl(var(--primary-foreground))",
};

function addStep(
  steps: TrieStep[],
  nodesMap: Map<string, TrieNodeInternal>,
  rootId: string,
  line: number | null,
  operation: TrieStep['operation'],
  message: string,
  currentWord?: string,
  currentCharIndex?: number,
  currentNodeId?: string | null,
  pathTakenIds?: string[],
  found?: boolean,
  auxData?: TrieStep['auxiliaryData']
) {
  const { visualNodes, visualEdges } = mapTrieToVisual(nodesMap, rootId, currentNodeId, pathTakenIds, []);
  steps.push({
    nodes: visualNodes,
    edges: visualEdges,
    operation, currentWord, currentCharIndex, currentNodeId, pathTakenIds, message, found,
    currentLine: line,
    auxiliaryData,
  });
}

function mapTrieToVisual(
  nodesMap: Map<string, TrieNodeInternal>,
  rootId: string,
  activeNodeId?: string | null,
  pathNodeIds: string[] = [],
  highlightedWordNodeIds: string[] = [] // Nodes that form a successfully searched word
): { visualNodes: TrieNodeVisual[], visualEdges: TrieEdgeVisual[] } {
  const visualNodes: TrieNodeVisual[] = [];
  const visualEdges: TrieEdgeVisual[] = [];
  if (!nodesMap.has(rootId)) return { visualNodes, visualEdges };

  const HORIZONTAL_SPACING = 50;
  const VERTICAL_SPACING = 60;
  const SVG_WIDTH_CENTER = 300;

  // BFS-like traversal to calculate positions
  const queue: { nodeId: string; x: number; y: number; depth: number }[] = [{ nodeId: rootId, x: SVG_WIDTH_CENTER, y: 50, depth: 0 }];
  const visitedForLayout = new Set<string>();

  while (queue.length > 0) {
    const { nodeId, x, y, depth } = queue.shift()!;
    if (visitedForLayout.has(nodeId)) continue;
    visitedForLayout.add(nodeId);

    const nodeInternal = nodesMap.get(nodeId)!;
    let nodeColor = NODE_COLORS.default;
    let textColor = TEXT_COLORS.default;

    if (pathNodeIds.includes(nodeId)) { nodeColor = NODE_COLORS.path; textColor = TEXT_COLORS.path; }
    if (activeNodeId === nodeId) { nodeColor = NODE_COLORS.active; textColor = TEXT_COLORS.active; }
    if (nodeInternal.isEndOfWord) { 
        nodeColor = NODE_COLORS.endOfWord; textColor = TEXT_COLORS.endOfWord;
        if(pathNodeIds.includes(nodeId) || activeNodeId === nodeId) { // If EOW and also on path/active
            nodeColor = NODE_COLORS.endOfWord; // EOW color takes precedence
            textColor = TEXT_COLORS.endOfWord;
        }
    }
     if (nodeInternal.visualColor) nodeColor = nodeInternal.visualColor; // For newly created nodes


    visualNodes.push({
      id: nodeId,
      label: nodeInternal.char === null ? 'ROOT' : nodeInternal.char,
      x, y, isEndOfWord: nodeInternal.isEndOfWord,
      color: nodeColor,
      textColor: textColor,
    });

    const childrenIds = Array.from(nodeInternal.children.values());
    const numChildren = childrenIds.length;
    // Calculate width needed for children
    const childrenSubtreeWidth = (numChildren -1) * HORIZONTAL_SPACING;
    let startX = x - childrenSubtreeWidth / 2;

    childrenIds.sort((a,b) => (nodesMap.get(a)?.char || "").localeCompare(nodesMap.get(b)?.char || "")).forEach((childId) => {
      if (nodesMap.has(childId) && !visitedForLayout.has(childId)) {
        visualEdges.push({ id: `edge-${nodeId}-${childId}`, sourceId: nodeId, targetId: childId, color: "hsl(var(--muted-foreground))" });
        queue.push({ nodeId: childId, x: startX, y: y + VERTICAL_SPACING, depth: depth + 1 });
        startX += HORIZONTAL_SPACING;
      }
    });
  }
  return { visualNodes, visualEdges };
}


export const generateTrieSteps = (
  currentTrie: { rootId: string; nodesMap: Map<string, TrieNodeInternal> },
  operation: 'insert' | 'search' | 'startsWith' | 'init',
  word: string
): TrieStep[] => {
  const localSteps: TrieStep[] = [];
  const { rootId, nodesMap } = currentTrie;
  const lm = TRIE_LINE_MAP;
  let currentId = rootId;
  const pathTakenIds: string[] = [rootId];

  addStep(localSteps, nodesMap, rootId, null, operation, `Operation: ${operation}('${word}')`, word, -1, rootId, [...pathTakenIds]);

  if (operation === 'insert') {
    addStep(localSteps, nodesMap, rootId, lm.insertFuncStart, operation, `Insert: Start traversing for '${word}'.`, word, -1, rootId, [...pathTakenIds]);
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      addStep(localSteps, nodesMap, rootId, lm.insertLoopChar, operation, `Insert: Processing char '${char}'. Current node: ${nodesMap.get(currentId)?.char || 'ROOT'}.`, word, i, currentId, [...pathTakenIds]);
      
      let currentInternalNode = nodesMap.get(currentId)!;
      addStep(localSteps, nodesMap, rootId, lm.insertCheckChildExists, operation, `Insert: Does current node have child '${char}'?`, word, i, currentId, [...pathTakenIds]);
      if (!currentInternalNode.children.has(char)) {
        const newNodeId = generateTrieNodeId(char, currentInternalNode.depth! + 1);
        nodesMap.set(newNodeId, { id: newNodeId, char, isEndOfWord: false, children: new Map(), parentId: currentId, depth: currentInternalNode.depth! + 1, visualColor: NODE_COLORS.created });
        currentInternalNode.children.set(char, newNodeId);
        nodesMap.set(currentId, currentInternalNode); // Update parent's children map
        addStep(localSteps, nodesMap, rootId, lm.insertCreateChild, operation, `Insert: Child '${char}' not found. Created new node.`, word, i, currentId, [...pathTakenIds]);
         // Reset visualColor after creation step
        setTimeout(() => { if(nodesMap.has(newNodeId)) nodesMap.get(newNodeId)!.visualColor = undefined; }, 0);
      } else {
         addStep(localSteps, nodesMap, rootId, lm.insertCheckChildExists, operation, `Insert: Child '${char}' found.`, word, i, currentId, [...pathTakenIds]);
      }
      currentId = currentInternalNode.children.get(char)!;
      pathTakenIds.push(currentId);
      addStep(localSteps, nodesMap, rootId, lm.insertMoveToChild, operation, `Insert: Moved to node '${char}'.`, word, i, currentId, [...pathTakenIds]);
    }
    nodesMap.get(currentId)!.isEndOfWord = true;
    addStep(localSteps, nodesMap, rootId, lm.insertMarkEndOfWord, operation, `Insert: Marked node '${nodesMap.get(currentId)?.char}' as end of word for '${word}'.`, word, word.length -1, currentId, [...pathTakenIds]);
    addStep(localSteps, nodesMap, rootId, lm.insertFuncEnd, operation, `Insert for '${word}' complete.`, word, undefined, undefined, [...pathTakenIds], undefined, {insertedWords: Array.from(nodesMap.values()).filter(n=>n.isEndOfWord).map(n=>n.char!)});

  } else if (operation === 'search' || operation === 'startsWith') {
    const opStartLine = operation === 'search' ? lm.searchFuncStart : lm.startsWithFuncStart;
    const loopCharLine = operation === 'search' ? lm.searchLoopChar : lm.startsWithLoopChar;
    const checkChildLine = operation === 'search' ? lm.searchCheckChildExists : lm.startsWithCheckChildExists;
    const moveToChildLine = operation === 'search' ? lm.searchMoveToChild : lm.startsWithMoveToChild;
    const returnFoundLine = operation === 'search' ? lm.searchReturnFound : lm.startsWithReturnTrue;
    const opEndLine = operation === 'search' ? lm.searchFuncEnd : lm.startsWithFuncEnd;

    addStep(localSteps, nodesMap, rootId, opStartLine, operation, `${operation}: Start traversing for '${word}'.`, word, -1, rootId, [...pathTakenIds]);
    let found = true;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      addStep(localSteps, nodesMap, rootId, loopCharLine, operation, `${operation}: Processing char '${char}'. Current node: ${nodesMap.get(currentId)?.char || 'ROOT'}.`, word, i, currentId, [...pathTakenIds]);
      
      const currentInternalNode = nodesMap.get(currentId)!;
      addStep(localSteps, nodesMap, rootId, checkChildLine, operation, `${operation}: Does current node have child '${char}'?`, word, i, currentId, [...pathTakenIds]);
      if (!currentInternalNode.children.has(char)) {
        addStep(localSteps, nodesMap, rootId, checkChildLine, operation, `${operation}: Child '${char}' not found. ${word} does not exist.`, word, i, currentId, [...pathTakenIds], false);
        found = false;
        break;
      }
      addStep(localSteps, nodesMap, rootId, checkChildLine, operation, `${operation}: Child '${char}' found.`, word, i, currentId, [...pathTakenIds]);
      currentId = currentInternalNode.children.get(char)!;
      pathTakenIds.push(currentId);
      addStep(localSteps, nodesMap, rootId, moveToChildLine, operation, `${operation}: Moved to node '${char}'.`, word, i, currentId, [...pathTakenIds]);
    }

    if (found && operation === 'search') {
      found = nodesMap.get(currentId)!.isEndOfWord;
      addStep(localSteps, nodesMap, rootId, returnFoundLine, operation, `Search: Path for '${word}' exists. Is it marked as end of word? ${found}.`, word, word.length - 1, currentId, [...pathTakenIds], found);
    } else if (found && operation === 'startsWith') {
      addStep(localSteps, nodesMap, rootId, returnFoundLine, operation, `StartsWith: Prefix '${word}' found.`, word, word.length - 1, currentId, [...pathTakenIds], true);
    }
    addStep(localSteps, nodesMap, rootId, opEndLine, operation, `${operation} for '${word}' complete. Result: ${found}.`, word, undefined, undefined, [...pathTakenIds], found);
  }
  return localSteps;
};

export const createInitialTrie = (): { rootId: string; nodesMap: Map<string, TrieNodeInternal> } => {
  globalTrieNodeIdCounter = 0;
  const rootId = generateTrieNodeId(null, 0);
  const nodesMap = new Map<string, TrieNodeInternal>();
  nodesMap.set(rootId, { id: rootId, char: null, isEndOfWord: false, children: new Map(), depth: 0 });
  return { rootId, nodesMap };
};
