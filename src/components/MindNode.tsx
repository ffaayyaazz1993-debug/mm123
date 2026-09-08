import React, { useState, useRef, useEffect } from 'react';
import { MindNode as MindNodeType } from '../types';

interface MindNodeProps {
  node: MindNodeType;
  x: number;
  y: number;
  isSelected: boolean;
  isMultiSelected: boolean;
  isEditing: boolean;
  isRoot: boolean;
  hasChildren: boolean;
  isCollapsed: boolean;
  isLinkSource: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onEdit: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  onFinishEdit: () => void;
  onToggleCollapse: (id: string) => void;
  onAddChild: (id: string) => void;
}

export const MindNodeComponent: React.FC<MindNodeProps> = ({
  node,
  x,
  y,
  isSelected,
  isMultiSelected,
  isEditing,
  isRoot,
  hasChildren,
  isCollapsed,
  isLinkSource,
  onSelect,
  onEdit,
  onTextChange,
  onFinishEdit,
  onToggleCollapse,
  onAddChild,
}) => {
  const [text, setText] = useState(node.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(node.text);
  }, [node.text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(node.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id, e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onTextChange(node.id, text);
      onFinishEdit();
    } else if (e.key === 'Escape') {
      setText(node.text);
      onFinishEdit();
    }
    e.stopPropagation();
  };

  const handleBlur = () => {
    onTextChange(node.id, text);
    onFinishEdit();
  };

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddChild(node.id);
  };

  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCollapse(node.id);
  };

  const color = node.color || '#4A90D9';
  
  // Styling based on node type
  const bgColor = isRoot 
    ? color
    : (isSelected || isMultiSelected)
      ? `${color}20`
      : `${color}08`;
  
  const borderColor = isLinkSource
    ? '#6366f1'
    : (isSelected || isMultiSelected)
      ? color
      : isRoot 
        ? 'transparent'
        : `${color}40`;

  const textColor = isRoot ? '#ffffff' : '#2d3748';
  const fontSize = isRoot ? '16px' : '14px';
  const fontWeight = isRoot ? '700' : '500';
  const padding = isRoot ? '12px 28px' : '8px 18px';
  const borderRadius = isRoot ? '24px' : '14px';
  const shadow = isRoot 
    ? `0 6px 24px ${color}35, 0 2px 8px ${color}20`
    : (isSelected || isMultiSelected)
      ? `0 3px 14px ${color}25, 0 1px 4px rgba(0,0,0,0.06)`
      : '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)';

  return (
    <div
      className="absolute cursor-pointer select-none group"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected || isMultiSelected ? 10 : 1,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className="relative flex items-center gap-2 whitespace-nowrap transition-all duration-200"
        style={{
          background: bgColor,
          border: `2px solid ${borderColor}`,
          borderRadius,
          padding,
          boxShadow: shadow,
          color: textColor,
          fontSize,
          fontWeight,
          backdropFilter: isRoot ? 'none' : 'blur(8px)',
          outline: isLinkSource ? '3px solid #6366f1' : undefined,
          outlineOffset: '2px',
        }}
      >
        {/* Selection indicator */}
        {(isSelected || isMultiSelected) && !isRoot && (
          <div 
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            style={{
              boxShadow: `0 0 0 3px ${color}30`,
              borderRadius: 'inherit',
            }}
          />
        )}

        {/* Multi-select badge */}
        {isMultiSelected && !isRoot && (
          <div
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
            style={{
              background: '#10b981',
              color: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
          >
            ✓
          </div>
        )}

        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="bg-transparent outline-none border-none w-full min-w-[80px]"
            style={{ color: textColor, fontSize, fontWeight }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="pointer-events-none">{node.text}</span>
        )}

        {/* Collapse/Expand button */}
        {hasChildren && !isEditing && (
          <button
            onClick={handleToggleCollapse}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            style={{
              background: color,
              color: '#fff',
              boxShadow: `0 2px 6px ${color}40`,
            }}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? node.children.length : '−'}
          </button>
        )}

        {/* Add child button */}
        {!isEditing && (
          <button
            onClick={handleAddChild}
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            style={{
              background: '#fff',
              color: color,
              border: `2px solid ${color}`,
              right: hasChildren ? '-32px' : '-16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}
            title="Add child"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};
