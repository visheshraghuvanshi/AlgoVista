
// src/app/visualizers/avl-tree/avl-node-colors.ts

export const NODE_COLORS_AVL = {
  DEFAULT: "hsl(var(--secondary))", // Standard node color
  BALANCED_GREEN: "hsl(130 60% 50%)", // A clear green for balanced nodes (BF 0)
  SLIGHTLY_UNBALANCED_YELLOW: "hsl(var(--accent))", // Yellow for BF -1 or +1
  UNBALANCED_NODE_RED: "hsl(var(--destructive))",   // Red for BF -2 or +2 (needs rotation)
  
  ACTIVE_COMPARISON: "hsl(var(--primary))", // Node currently being processed or compared
  NEWLY_INSERTED: "hsl(var(--accent))",    // Newly inserted node (often yellow to stand out)
  ROTATION_PIVOT_YELLOW: "hsl(var(--accent))", // Pivot node during rotation (often yellow)
  
  FOUND_HIGHLIGHT: "hsl(var(--accent))",   // Node found in a search operation
  PATH_TRAVERSED: "hsl(var(--primary)/0.6)", // Nodes on a traversal path (slightly transparent primary)
  
  TO_BE_DELETED: "hsl(var(--destructive)/0.8)", // Node marked for deletion
  INORDER_SUCCESSOR: "hsl(var(--ring))",      // Inorder successor during deletion (often a distinct highlight like the ring color)
};

// Text colors for corresponding node fills to ensure readability
export const TEXT_COLORS_AVL = {
  DEFAULT_TEXT: "hsl(var(--secondary-foreground))",
  BALANCED_GREEN_TEXT: "hsl(var(--primary-foreground))", // White/light text on green
  SLIGHTLY_UNBALANCED_YELLOW_TEXT: "hsl(var(--accent-foreground))", // Dark text on yellow
  UNBALANCED_NODE_RED_TEXT: "hsl(var(--destructive-foreground))", // White/light text on red

  ACTIVE_COMPARISON_TEXT: "hsl(var(--primary-foreground))",
  NEWLY_INSERTED_TEXT: "hsl(var(--accent-foreground))",
  ROTATION_PIVOT_YELLOW_TEXT: "hsl(var(--accent-foreground))",
  
  FOUND_HIGHLIGHT_TEXT: "hsl(var(--accent-foreground))",
  PATH_TRAVERSED_TEXT: "hsl(var(--primary-foreground))",

  TO_BE_DELETED_TEXT: "hsl(var(--destructive-foreground))",
  INORDER_SUCCESSOR_TEXT: "hsl(var(--primary-foreground))", // Assuming ring color is dark enough for light text
};
