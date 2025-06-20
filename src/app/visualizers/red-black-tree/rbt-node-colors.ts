// src/app/visualizers/red-black-tree/rbt-node-colors.ts

export const RBT_NODE_COLORS = {
  RED: "hsl(var(--destructive))", // Typically red for RBT red nodes
  BLACK: "hsl(var(--foreground))", // Dark color for RBT black nodes (could be card-foreground or similar)
  NIL: "hsl(var(--muted))", // Muted color for NIL leaves
  
  // States for visualization beyond RBT properties:
  ACTIVE_COMPARISON: "hsl(var(--primary))",     // Node currently being processed or compared
  NEWLY_INSERTED: "hsl(var(--accent))",        // Node just after BST insertion (before fixup)
  ROTATION_PIVOT: "hsl(var(--yellow-500))",    // Node around which rotation occurs (can be same as accent)
  FOUND_HIGHLIGHT: "hsl(var(--green-500))",       // Node found in a search operation
  PATH_TRAVERSED: "hsl(var(--primary)/0.6)",   // Nodes on a traversal path
  DOUBLE_BLACK: "hsl(var(--blue-700))",        // Node that is "double black" during delete fixup
};

// Text colors for corresponding node fills to ensure readability
export const RBT_TEXT_COLORS = {
  RED_TEXT: "hsl(var(--destructive-foreground))",   // Light text on red
  BLACK_TEXT: "hsl(var(--background))",           // Light text on dark (black) nodes
  NIL_TEXT: "hsl(var(--muted-foreground))",
  
  ACTIVE_COMPARISON_TEXT: "hsl(var(--primary-foreground))",
  NEWLY_INSERTED_TEXT: "hsl(var(--accent-foreground))", // Dark text if accent is light yellow
  ROTATION_PIVOT_TEXT: "hsl(var(--accent-foreground))",
  FOUND_HIGHLIGHT_TEXT: "hsl(var(--primary-foreground))", // Light text on green
  PATH_TRAVERSED_TEXT: "hsl(var(--primary-foreground))",
  DOUBLE_BLACK_TEXT: "hsl(var(--primary-foreground))", // Light text on blue
};
