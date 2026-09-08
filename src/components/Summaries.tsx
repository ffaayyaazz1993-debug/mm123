import React, { useState, useRef, useEffect } from 'react';
import { MindNode, Summary } from '../types';

interface SummariesProps {
  root: MindNode;
  summaries: Summary[];
  nodePositions: Map<string, { x: number; y: number; width: number; height: number }>;
  editingSummaryId: string | null;
  onEditSummary: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
  onFinishEdit: () => void;
  onDeleteSummary: (id: string) => void;
}

export const Summaries: React.FC<SummariesProps> = ({
  root,
  summaries,
  nodePositions,
  editingSummaryId,
  onEditSummary,
  onUpdateText,
  onFinishEdit,
  onDeleteSummary,
}) => {
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
        {summaries.map(summary => {
          // Get positions of all topic nodes
          const positions = summary.topicIds
            .map(id => nodePositions.get(id))
            .filter(Boolean) as { x: number; y: number; width: number; height: number }[];

          if (positions.length < 2) return null;

          const color = summary.color || '#6366f1';
          
          // Find the bounding box of all topic nodes
          const minY = Math.min(...positions.map(p => p.y - p.height / 2));
          const maxY = Math.max(...positions.map(p => p.y + p.height / 2));
          const maxX = Math.max(...positions.map(p => p.x + p.width / 2));
          
          // Bracket position - curly brace on the right side
          const bracketX = maxX + 25;
          const bracketTopY = minY;
          const bracketBottomY = maxY;
          const bracketMidY = (bracketTopY + bracketBottomY) / 2;
          const bracketWidth = 12;
          
          // Summary node position
          const summaryNodeX = bracketX + bracketWidth + 20;
          const summaryNodeY = bracketMidY;

          // Create curly brace path
          const bracePath = `
            M ${bracketX} ${bracketTopY}
            Q ${bracketX + bracketWidth} ${bracketTopY}, ${bracketX + bracketWidth} ${bracketTopY + 10}
            L ${bracketX + bracketWidth} ${bracketMidY - 6}
            Q ${bracketX + bracketWidth} ${bracketMidY}, ${bracketX + bracketWidth + 6} ${bracketMidY}
            Q ${bracketX + bracketWidth} ${bracketMidY}, ${bracketX + bracketWidth} ${bracketMidY + 6}
            L ${bracketX + bracketWidth} ${bracketBottomY - 10}
            Q ${bracketX + bracketWidth} ${bracketBottomY}, ${bracketX} ${bracketBottomY}
          `;

          return (
            <g key={summary.id}>
              {/* Curly brace */}
              <path
                d={bracePath}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.8}
              />
              
              {/* Connection line from brace tip to summary node */}
              <line
                x1={bracketX + bracketWidth + 6}
                y1={bracketMidY}
                x2={summaryNodeX - 8}
                y2={summaryNodeY}
                stroke={color}
                strokeWidth={2}
                opacity={0.6}
                strokeDasharray="4 3"
              />

              {/* Summary node */}
              <foreignObject
                x={summaryNodeX - 8}
                y={summaryNodeY - 18}
                width={180}
                height={36}
                style={{ overflow: 'visible', pointerEvents: 'auto' }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: `linear-gradient(135deg, ${color}18, ${color}08)`,
                    border: `2px solid ${color}50`,
                    borderRadius: '12px',
                    padding: '5px 14px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: color,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: `0 2px 10px ${color}20, inset 0 1px 0 ${color}10`,
                    transition: 'all 0.2s ease',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditSummary(summary.id);
                  }}
                >
                  {editingSummaryId === summary.id ? (
                    <SummaryEditor
                      summary={summary}
                      onUpdateText={onUpdateText}
                      onFinishEdit={onFinishEdit}
                    />
                  ) : (
                    <>
                      <span style={{ pointerEvents: 'none' }}>{summary.text}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSummary(summary.id);
                        }}
                        style={{
                          marginLeft: '2px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: `${color}25`,
                          border: 'none',
                          color: color,
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1,
                          transition: 'all 0.2s ease',
                        }}
                        title="Delete summary"
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background = `${color}40`;
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.background = `${color}25`;
                        }}
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

interface SummaryEditorProps {
  summary: Summary;
  onUpdateText: (id: string, text: string) => void;
  onFinishEdit: () => void;
}

const SummaryEditor: React.FC<SummaryEditorProps> = ({ summary, onUpdateText, onFinishEdit }) => {
  const [text, setText] = useState(summary.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleSubmit = () => {
    onUpdateText(summary.id, text.trim() || 'Summary');
    onFinishEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setText(summary.text);
      onFinishEdit();
    }
    e.stopPropagation();
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        width: '100px',
        padding: 0,
      }}
    />
  );
};
