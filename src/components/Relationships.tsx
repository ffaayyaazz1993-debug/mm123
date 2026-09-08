import React, { useState, useRef, useEffect } from 'react';
import { MindNode, Relationship } from '../types';

interface RelationshipsProps {
  root: MindNode;
  relationships: Relationship[];
  nodePositions: Map<string, { x: number; y: number; width: number; height: number }>;
  onDeleteRelationship: (id: string) => void;
  onUpdateLabel: (id: string, label: string) => void;
}

function getNodeColor(node: MindNode, id: string): string | undefined {
  if (node.id === id) return node.color;
  for (const child of node.children) {
    const found = getNodeColor(child, id);
    if (found) return found;
  }
  return undefined;
}

function generateRelationshipPath(
  x1: number, y1: number,
  x2: number, y2: number,
): { path: string; midX: number; midY: number } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist === 0) return { path: `M ${x1} ${y1}`, midX: x1, midY: y1 };
  
  // Create a curved path with control points
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  // Offset the control point perpendicular to the line
  const curvature = Math.min(dist * 0.25, 60);
  const nx = -dy / dist;
  const ny = dx / dist;
  
  const cx = midX + nx * curvature;
  const cy = midY + ny * curvature;
  
  // Label position at the middle of the quadratic bezier (t=0.5)
  const labelX = 0.25 * x1 + 0.5 * cx + 0.25 * x2;
  const labelY = 0.25 * y1 + 0.5 * cy + 0.25 * y2;
  
  const path = `M ${x1} ${y1} Q ${cx} ${cy}, ${x2} ${y2}`;
  
  return { path, midX: labelX, midY: labelY };
}

export const Relationships: React.FC<RelationshipsProps> = ({
  root,
  relationships,
  nodePositions,
  onDeleteRelationship,
  onUpdateLabel,
}) => {
  const [editingRelId, setEditingRelId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [hoveredRelId, setHoveredRelId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingRelId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingRelId]);

  const handleLabelClick = (relId: string, currentLabel: string) => {
    setEditingRelId(relId);
    setEditText(currentLabel);
  };

  const handleLabelSubmit = () => {
    if (editingRelId && editText.trim()) {
      onUpdateLabel(editingRelId, editText.trim());
    }
    setEditingRelId(null);
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelSubmit();
    } else if (e.key === 'Escape') {
      setEditingRelId(null);
    }
    e.stopPropagation();
  };

  if (relationships.length === 0) return null;

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
        zIndex: 0,
      }}
    >
      <g transform={`translate(${OFFSET}, ${OFFSET})`}>
      {relationships.map(rel => {
        const sourcePos = nodePositions.get(rel.sourceId);
        const targetPos = nodePositions.get(rel.targetId);
        if (!sourcePos || !targetPos) return null;

        const sourceColor = getNodeColor(root, rel.sourceId) || rel.color || '#6366f1';
        const isHovered = hoveredRelId === rel.id;
        
        // Connection points (center of nodes)
        const x1 = sourcePos.x;
        const y1 = sourcePos.y;
        const x2 = targetPos.x;
        const y2 = targetPos.y;

        const { path, midX, midY } = generateRelationshipPath(x1, y1, x2, y2);

        // Calculate label width based on text
        const labelWidth = Math.max(60, rel.label.length * 7 + 20);

        return (
          <g 
            key={rel.id}
            onMouseEnter={() => setHoveredRelId(rel.id)}
            onMouseLeave={() => setHoveredRelId(null)}
            className="rel-group"
          >
            {/* Shadow/glow path */}
            <path
              d={path}
              fill="none"
              stroke={sourceColor}
              strokeWidth={isHovered ? 6 : 4}
              strokeLinecap="round"
              strokeDasharray="8 5"
              opacity={isHovered ? 0.2 : 0.1}
              style={{ transition: 'all 0.2s ease' }}
            />
            {/* Main dashed path */}
            <path
              d={path}
              fill="none"
              stroke={sourceColor}
              strokeWidth={isHovered ? 2.5 : 1.8}
              strokeLinecap="round"
              strokeDasharray="8 5"
              opacity={isHovered ? 1 : 0.7}
              style={{ transition: 'all 0.2s ease' }}
            />
            {/* Arrow circle at target */}
            <circle
              cx={x2}
              cy={y2}
              r={isHovered ? 5 : 4}
              fill={sourceColor}
              opacity={isHovered ? 1 : 0.7}
              style={{ transition: 'all 0.2s ease' }}
            />
            {/* Start dot */}
            <circle
              cx={x1}
              cy={y1}
              r={3}
              fill={sourceColor}
              opacity={0.6}
            />
            {/* Label background */}
            <rect
              x={midX - labelWidth / 2}
              y={midY - 12}
              width={labelWidth}
              height={24}
              rx={12}
              fill="white"
              stroke={sourceColor}
              strokeWidth={1.5}
              opacity={0.95}
              className="pointer-events-auto cursor-pointer"
              onClick={() => handleLabelClick(rel.id, rel.label)}
              onDoubleClick={() => handleLabelClick(rel.id, rel.label)}
              style={{ filter: isHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none' }}
            />
            {/* Label text or input */}
            {editingRelId === rel.id ? (
              <foreignObject
                x={midX - labelWidth / 2 + 4}
                y={midY - 12}
                width={labelWidth - 8}
                height={24}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleLabelKeyDown}
                  onBlur={handleLabelSubmit}
                  className="w-full h-full text-center text-xs bg-transparent outline-none border-none"
                  style={{ color: sourceColor, lineHeight: '24px' }}
                  onClick={(e) => e.stopPropagation()}
                />
              </foreignObject>
            ) : (
              <text
                x={midX}
                y={midY + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="500"
                fill={sourceColor}
                className="pointer-events-auto cursor-pointer select-none"
                onClick={() => handleLabelClick(rel.id, rel.label)}
              >
                {rel.label}
              </text>
            )}
            {/* Delete button (visible on hover) */}
            <g
              className="pointer-events-auto cursor-pointer rel-delete"
              onClick={() => onDeleteRelationship(rel.id)}
              opacity={isHovered ? 1 : 0}
              style={{ transition: 'opacity 0.2s ease' }}
            >
              <circle
                cx={midX + labelWidth / 2 + 12}
                cy={midY}
                r={9}
                fill="#ef4444"
                opacity={0.9}
              />
              <text
                x={midX + labelWidth / 2 + 12}
                y={midY + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="white"
              >
                ×
              </text>
            </g>
          </g>
        );
      })}
      </g>
    </svg>
  );
};
