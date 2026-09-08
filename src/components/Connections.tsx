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
  const controlDist = Math.max(dx * 0.5, 40);
  
  const cx1 = direction === 'right' ? x1 + controlDist : x1 - controlDist;
  const cx2 = direction === 'right' ? x2 - controlDist : x2 + controlDist;
  
  return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
}

function collectPaths(
  node: MindNode,
  nodePositions: Map<string, { x: number; y: number; width: number; height: number }>,
  paths: PathData[]
) {
  const parentPos = nodePositions.get(node.id);
  if (!parentPos) return;

  if (node.collapsed) return;

  for (const child of node.children) {
    const childPos = nodePositions.get(child.id);
    if (!childPos) continue;

    const isRight = childPos.x >= parentPos.x;
    
    // Connection points
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
    
    // Stroke width based on depth
    const parentDepth = getDepth(node, nodePositions);
    const strokeWidth = Math.max(1.5, 3.5 - parentDepth * 0.5);

    paths.push({
      d,
      color: child.color || '#4A90D9',
      key: `${node.id}-${child.id}`,
      strokeWidth,
    });

    collectPaths(child, nodePositions, paths);
  }
}

function getDepth(
  node: MindNode, 
  nodePositions: Map<string, { x: number; y: number; width: number; height: number }>
): number {
  // Estimate depth based on x position
  const pos = nodePositions.get(node.id);
  if (!pos) return 0;
  return Math.round(Math.abs(pos.x) / 240);
}

export const Connections: React.FC<ConnectionsProps> = ({ root, nodePositions }) => {
  const paths: PathData[] = [];
  collectPaths(root, nodePositions, paths);

  return (
    <svg
      className="absolute pointer-events-none"
      style={{ 
        left: '0', 
        top: '0', 
        width: '0', 
        height: '0', 
        overflow: 'visible',
      }}
    >
      <defs>
        {paths.map(({ color, key }) => (
          <linearGradient key={`grad-${key}`} id={`grad-${key}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
        ))}
      </defs>
      {paths.map(({ d, color, key, strokeWidth }) => (
        <g key={key}>
          {/* Shadow */}
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 2}
            strokeLinecap="round"
            opacity={0.1}
          />
          {/* Main line */}
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={0.7}
          />
        </g>
      ))}
    </svg>
  );
};
