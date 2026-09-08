import React from 'react';
import { MindNode } from '../types';

interface ConnectionsProps {
  root: MindNode;
  nodePositions: Map<string, { x: number; y: number; width: number; height: number }>;
}

interface PathData {
  d: string;
  color: string;
  key: string;
  strokeWidth: number;
}

function generateCurvedPath(
  x1: number, y1: number,
  x2: number, y2: number,
  direction: 'left' | 'right'
): string {
  const dx = Math.abs(x2 - x1);
  const controlDist = Math.max(dx * 0.45, 50);

  const cx1 = direction === 'right' ? x1 + controlDist : x1 - controlDist;
  const cx2 = direction === 'right' ? x2 - controlDist : x2 + controlDist;

  return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
}

function collectPaths(
  node: MindNode,
  nodePositions: Map<string, { x: number; y: number; width: number; height: number }>,
  paths: PathData[],
  depth: number = 0
) {
  if (node.collapsed) return;

  const parentPos = nodePositions.get(node.id);
  if (!parentPos) return;

  for (const child of node.children) {
    const childPos = nodePositions.get(child.id);
    if (!childPos) continue;

    const isRight = childPos.x >= parentPos.x;

    // Connection points: from edge of parent to edge of child
    const x1 = isRight
      ? parentPos.x + parentPos.width / 2
      : parentPos.x - parentPos.width / 2;
    const y1 = parentPos.y;
    const x2 = isRight
      ? childPos.x - childPos.width / 2
      : childPos.x + childPos.width / 2;
    const y2 = childPos.y;

    const direction = isRight ? 'right' : 'left';
    const d = generateCurvedPath(x1, y1, x2, y2, direction);

    const strokeWidth = Math.max(2.5, 4.5 - depth * 0.8);

    paths.push({
      d,
      color: child.color || '#4A90D9',
      key: `${node.id}-${child.id}`,
      strokeWidth,
    });

    collectPaths(child, nodePositions, paths, depth + 1);
  }
}

export const Connections: React.FC<ConnectionsProps> = ({ root, nodePositions }) => {
  const paths: PathData[] = [];
  collectPaths(root, nodePositions, paths);

  if (paths.length === 0) return null;

  // The SVG is positioned so that its top-left corner is at the same point
  // as the container's origin (where the root node center is).
  // We use a negative offset so that negative coordinates (left-side nodes)
  // are also visible. The g transform shifts paths to match.
  const OFFSET = 3000;

  return (
    <svg
      style={{
        position: 'absolute',
        left: `${-OFFSET}px`,
        top: `${-OFFSET}px`,
        width: `${OFFSET * 2}px`,
        height: `${OFFSET * 2}px`,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <g transform={`translate(${OFFSET}, ${OFFSET})`}>
        {paths.map(({ d, color, key, strokeWidth }) => (
          <g key={key}>
            {/* Glow */}
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth + 5}
              strokeLinecap="round"
              opacity={0.12}
            />
            {/* Main stroke */}
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              opacity={0.85}
            />
          </g>
        ))}
      </g>
    </svg>
  );
};
