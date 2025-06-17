
import type { DPAlgorithmStep } from '@/types'; // Reusing DPAlgorithmStep

export const FLOYD_WARSHALL_LINE_MAP = {
  functionDeclare: 1,
  getV: 2,
  initDistMatrix: 3,
  copyGraphToDistLoopI: 4,
  copyGraphToDistLoopJ: 5,
  setDiagonalToZero: 6,
  setDirectEdge: 7,
  loopK: 8,
  loopI: 9,
  loopJ: 10,
  checkPathThroughK_part1: 11, // dist[i][k] !== Infinity && dist[k][j] !== Infinity
  checkPathThroughK_part2: 12, // dist[i][k] + dist[k][j] < dist[i][j]
  updateDistIJ: 13,
  negativeCycleCheckLoop: 14,
  negativeCycleCondition: 15,
  returnErrorNegativeCycle: 16,
  returnDist: 17,
};

interface Edge {
  u: number;
  v: number;
  weight: number;
}

export function parseAdjacencyMatrix(numVertices: number, edgeListString: string): number[][] | null {
  const dist: number[][] = Array(numVertices).fill(null).map(() => Array(numVertices).fill(Infinity));
  for (let i = 0; i < numVertices; i++) dist[i][i] = 0;

  if(edgeListString.trim() === "") return dist; // No edges, just initialized matrix

  const edges: Edge[] = [];
  const entries = edgeListString.trim().split(';').filter(Boolean);
  try {
    for (const entry of entries) {
      const parts = entry.match(/(\d+)\s*-\s*(\d+)\s*\((\-?\d+(\.\d+)?)\)/);
      if (!parts || parts.length !== 4) throw new Error(`Invalid edge format: "${entry}"`);
      const u = parseInt(parts[1], 10);
      const v = parseInt(parts[2], 10);
      const weight = parseFloat(parts[3]);
      if (isNaN(u) || isNaN(v) || isNaN(weight) || u < 0 || u >= numVertices || v < 0 || v >= numVertices) {
        throw new Error(`Invalid edge data or out of bounds: "${entry}" for V=${numVertices}`);
      }
      dist[u][v] = weight; // Assuming directed graph for Floyd-Warshall typically
    }
  } catch (e) {
    console.error("Error parsing edge list:", e);
    return null; // Indicate parsing error
  }
  return dist;
}


const addStep = (
  localSteps: DPAlgorithmStep[],
  line: number | null,
  distMatrix: number[][],
  V: number,
  message: string,
  k_iter?: number, // Current k iteration
  current_i?: number,
  current_j?: number,
  highlighted?: {row: number, col: number, type: 'current' | 'dependency' | 'result'}[],
  auxData?: Record<string, any>
) => {
  localSteps.push({
    dpTable: distMatrix.map(row => [...row]),
    dpTableDimensions: { rows: V, cols: V },
    currentIndices: { k: k_iter, i: current_i, j: current_j },
    highlightedCells: highlighted,
    message,
    currentLine: line,
    auxiliaryData: { ...auxData, V, k: k_iter},
  });
};

export const generateFloydWarshallSteps = (
  initialDistMatrix: number[][], // Directly pass the parsed adjacency matrix
  V: number // Number of vertices
): DPAlgorithmStep[] => {
  const localSteps: DPAlgorithmStep[] = [];
  const lm = FLOYD_WARSHALL_LINE_MAP;

  let dist = initialDistMatrix.map(row => [...row]);

  addStep(localSteps, lm.functionDeclare, dist, V, `Floyd-Warshall for ${V} vertices.`);
  addStep(localSteps, lm.initDistMatrix, dist, V, "Distance matrix initialized from graph. INF means no direct path, 0 for self-loops.");

  // The loops for copying graph to dist are implicitly done by passing initialDistMatrix
  // For visualization, one might add explicit steps if parsing from edge list happens here.
  // For simplicity, assume initialDistMatrix is correctly set up.

  for (let k = 0; k < V; k++) {
    addStep(localSteps, lm.loopK, dist, V, `Iteration k = ${k} (considering vertex ${k} as intermediate).`, k);
    for (let i = 0; i < V; i++) {
      addStep(localSteps, lm.loopI, dist, V, `  i = ${i} (source vertex).`, k, i);
      for (let j = 0; j < V; j++) {
        addStep(localSteps, lm.loopJ, dist, V, `    j = ${j} (destination vertex). Checking dist[${i}][${j}].`, k, i, j, [{row:i, col:j, type:'current'}]);
        
        const highlightsForCheck = [
            {row:i, col:j, type:'current' as 'current'},
            {row:i, col:k, type:'dependency' as 'dependency'},
            {row:k, col:j, type:'dependency' as 'dependency'}
        ];

        addStep(localSteps, lm.checkPathThroughK_part1, dist, V, 
          `    Check if path i->k->j is shorter: dist[${i}][${k}] (${dist[i][k] === Infinity ? '∞': dist[i][k]}) + dist[${k}][${j}] (${dist[k][j] === Infinity ? '∞': dist[k][j]}) < dist[${i}][${j}] (${dist[i][j]===Infinity ? '∞': dist[i][j]})?`,
          k, i, j, highlightsForCheck, {costCalculation: `dist[${i}][${k}] + dist[${k}][${j}]`}
        );
        
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity && dist[i][k] + dist[k][j] < dist[i][j]) {
          const oldVal = dist[i][j];
          dist[i][j] = dist[i][k] + dist[k][j];
          addStep(localSteps, lm.updateDistIJ, dist, V, 
            `      Path via ${k} is shorter. Updated dist[${i}][${j}] from ${oldVal===Infinity ? '∞': oldVal} to ${dist[i][j]}.`, 
            k, i, j, [{row:i, col:j, type:'result'}, {row:i, col:k, type:'dependency'}, {row:k, col:j, type:'dependency'}]
          );
        } else {
           addStep(localSteps, lm.checkPathThroughK_part2, dist, V,
            `      Path via ${k} is NOT shorter or not viable. dist[${i}][${j}] remains ${dist[i][j]===Infinity ? '∞': dist[i][j]}.`,
            k, i, j, highlightsForCheck
           );
        }
      }
    }
    addStep(localSteps, lm.loopK, dist, V, `Finished iteration k = ${k}.`, k);
  }
  
  // Optional: Check for negative cycles
  addStep(localSteps, lm.negativeCycleCheckLoop, dist, V, "Checking for negative-weight cycles.");
  for (let i = 0; i < V; i++) {
    if (dist[i][i] < 0) {
      addStep(localSteps, lm.negativeCycleCondition, dist, V, `Negative cycle detected: dist[${i}][${i}] = ${dist[i][i]} < 0.`, undefined, i, i, [{row:i, col:i, type:'result'}], {resultValue: -1});
      addStep(localSteps, lm.returnErrorNegativeCycle, dist, V, "Algorithm terminated due to negative cycle.");
      return localSteps;
    }
  }
   addStep(localSteps, lm.negativeCycleCheckLoop, dist, V, "No negative cycles involving diagonal elements found.");

  addStep(localSteps, lm.returnDist, dist, V, "Floyd-Warshall algorithm complete. Final distances found.");
  return localSteps;
};
