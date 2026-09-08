import { MindNode } from '../types';

const HORIZONTAL_SPACING = 240;
const VERTICAL_SPACING = 50;
const NODE_HEIGHT = 42;

export interface LayoutResult {
  id: string;
  x: number;
  y: number;
  depth: number;
  side: 'left' | 'right' | 'center';
}

// Calculate the height needed for a subtree
function getSubtreeHeight(node: MindNode): number {
  if (node.collapsed || node.children.length === 0) {
    return NODE_HEIGHT;
  }

  const childHeights = node.children.map(c => getSubtreeHeight(c));
  const totalChildHeight = childHeights.reduce((a, b) => a + b, 0) +
    (node.children.length - 1) * VERTICAL_SPACING;

  return Math.max(NODE_HEIGHT, totalChildHeight);
}

// Layout a branch of nodes on one side
function layoutBranchSide(
  nodes: MindNode[],
  depth: number,
  side: 'left' | 'right',
  baseX: number
): LayoutResult[] {
  if (nodes.length === 0) return [];

  const results: LayoutResult[] = [];
  
  // Filter out floating nodes - they have their own positions
  const nonFloatingNodes = nodes.filter(n => !n.floating);
  const floatingNodes = nodes.filter(n => n.floating);
  
  // Add floating nodes with their fixed positions
  for (const node of floatingNodes) {
    results.push({
      id: node.id,
      x: node.x || 0,
      y: node.y || 0,
      depth,
      side,
    });
    
    // Layout children of floating nodes recursively
    if (!node.collapsed && node.children.length > 0) {
      const childResults = layoutBranchSide(node.children, depth + 1, side, node.x || 0);
      const childOffsetY = node.y || 0;
      for (const cr of childResults) {
        results.push({
          ...cr,
          y: cr.y + childOffsetY - (node.y || 0),
        });
      }
    }
  }
  
  if (nonFloatingNodes.length === 0) return results;
  
  // Calculate total height needed for non-floating nodes
  const heights = nonFloatingNodes.map(n => getSubtreeHeight(n));
  const totalHeight = heights.reduce((a, b) => a + b, 0) + (nonFloatingNodes.length - 1) * VERTICAL_SPACING;
  
  let currentY = -totalHeight / 2;

  for (let i = 0; i < nonFloatingNodes.length; i++) {
    const node = nonFloatingNodes[i];
    const subtreeH = heights[i];
    const nodeY = currentY + subtreeH / 2;
    const x = side === 'right' ? baseX + depth * HORIZONTAL_SPACING : baseX - depth * HORIZONTAL_SPACING;

    results.push({
      id: node.id,
      x,
      y: nodeY,
      depth,
      side,
    });

    // Layout children recursively
    if (!node.collapsed && node.children.length > 0) {
      const childResults = layoutBranchSide(node.children, depth + 1, side, baseX);
      // Offset children relative to parent
      const childOffsetY = nodeY;
      for (const cr of childResults) {
        results.push({
          ...cr,
          y: cr.y + childOffsetY,
        });
      }
    }

    currentY += subtreeH + VERTICAL_SPACING;
  }

  return results;
}

export function calculateLayout(root: MindNode): LayoutResult[] {
  const results: LayoutResult[] = [];

  // Center node
  results.push({
    id: root.id,
    x: 0,
    y: 0,
    depth: 0,
    side: 'center',
  });

  if (root.collapsed || root.children.length === 0) {
    return results;
  }

  // Split children: first half right, second half left
  const mid = Math.ceil(root.children.length / 2);
  const rightChildren = root.children.slice(0, mid);
  const leftChildren = root.children.slice(mid);

  // Layout right side
  const rightResults = layoutBranchSide(rightChildren, 1, 'right', 0);
  results.push(...rightResults);

  // Layout left side
  const leftResults = layoutBranchSide(leftChildren, 1, 'left', 0);
  results.push(...leftResults);

  return results;
}

export { NODE_HEIGHT, HORIZONTAL_SPACING, VERTICAL_SPACING };
