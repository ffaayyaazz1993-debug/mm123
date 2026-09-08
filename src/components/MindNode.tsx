import React, { useState, useRef, useEffect } from 'react';
import { MindNode as MindNodeType } from '../types';
import { MarkerPicker } from './MarkerPicker';
import { InsertMenu } from './InsertMenu';
import { getMarkerById } from '../utils/markers';

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
  onToggleMarker: (nodeId: string, markerId: string) => void;
  onInsertNote: (nodeId: string, note: string) => void;
  onInsertLabel: (nodeId: string, label: string) => void;
  onInsertTask: (nodeId: string) => void;
  onToggleTask: (nodeId: string) => void;
  onInsertLink: (nodeId: string, type: 'webpage' | 'topic' | 'file' | 'folder', url: string, title?: string) => void;
  onRemoveLink: (nodeId: string, linkId: string) => void;
  onInsertAttachment: (nodeId: string, file: File) => void;
  onRemoveAttachment: (nodeId: string, attachmentId: string) => void;
  onInsertAudioNote: (nodeId: string, duration: number, dataUrl?: string) => void;
  onRemoveAudioNote: (nodeId: string) => void;
  onInsertSticker: (nodeId: string, sticker: string) => void;
  onRemoveSticker: (nodeId: string) => void;
  onInsertIllustration: (nodeId: string, url: string, alt?: string) => void;
  onRemoveIllustration: (nodeId: string) => void;
  onInsertEquation: (nodeId: string, equation: string) => void;
  onRemoveEquation: (nodeId: string) => void;
  onRemoveNote: (nodeId: string) => void;
  onRemoveLabel: (nodeId: string) => void;
  onRemoveTask: (nodeId: string) => void;
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
  onToggleMarker,
  onInsertNote,
  onInsertLabel,
  onInsertTask,
  onToggleTask,
  onInsertLink,
  onRemoveLink,
  onInsertAttachment,
  onRemoveAttachment,
  onInsertAudioNote,
  onRemoveAudioNote,
  onInsertSticker,
  onRemoveSticker,
  onInsertIllustration,
  onRemoveIllustration,
  onInsertEquation,
  onRemoveEquation,
  onRemoveNote,
  onRemoveLabel,
  onRemoveTask,
}) => {
  const [text, setText] = useState(node.text);
  const [showMarkerPicker, setShowMarkerPicker] = useState(false);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const markerPickerRef = useRef<HTMLDivElement>(null);
  const insertMenuRef = useRef<HTMLDivElement>(null);

  // Close marker picker when clicking outside
  useEffect(() => {
    if (!showMarkerPicker) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (markerPickerRef.current && !markerPickerRef.current.contains(e.target as Node)) {
        setShowMarkerPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMarkerPicker]);

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

        {/* Markers display */}
        {node.markers && node.markers.length > 0 && !isEditing && (
          <div className="flex items-center gap-0.5 ml-1">
            {node.markers.slice(0, 3).map(markerId => {
              const marker = getMarkerById(markerId);
              if (!marker) return null;
              return (
                <span
                  key={markerId}
                  className="text-sm"
                  title={marker.name}
                  style={{ pointerEvents: 'none' }}
                >
                  {marker.icon}
                </span>
              );
            })}
            {node.markers.length > 3 && (
              <span className="text-xs text-gray-500">+{node.markers.length - 3}</span>
            )}
          </div>
        )}

        {/* Marker button */}
        {!isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMarkerPicker(!showMarkerPicker);
            }}
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            style={{
              background: '#fff',
              color: '#9333ea',
              border: '2px solid #9333ea',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}
            title="Add Marker"
          >
            🏷️
          </button>
        )}

        {/* Marker Picker */}
        {showMarkerPicker && (
          <div
            ref={markerPickerRef}
            className="absolute left-0 top-full mt-2 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <MarkerPicker
              currentMarkers={node.markers || []}
              onToggleMarker={(markerId) => onToggleMarker(node.id, markerId)}
              onClose={() => setShowMarkerPicker(false)}
            />
          </div>
        )}

        {/* Insert button */}
        {!isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInsertMenu(!showInsertMenu);
            }}
            className="absolute -left-4 bottom-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            style={{
              background: '#fff',
              color: '#0ea5e9',
              border: '2px solid #0ea5e9',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}
            title="Insert"
          >
            +
          </button>
        )}

        {/* Insert Menu */}
        {showInsertMenu && (
          <div
            ref={insertMenuRef}
            className="absolute left-0 bottom-full mb-2 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <InsertMenu
              node={node}
              onClose={() => setShowInsertMenu(false)}
              onInsertNote={onInsertNote}
              onInsertLabel={onInsertLabel}
              onInsertTask={onInsertTask}
              onInsertLink={onInsertLink}
              onInsertAttachment={onInsertAttachment}
              onInsertAudioNote={onInsertAudioNote}
              onInsertSticker={onInsertSticker}
              onInsertIllustration={onInsertIllustration}
              onInsertEquation={onInsertEquation}
            />
          </div>
        )}

        {/* Inserted features display */}
        {!isEditing && (
          <div className="absolute left-0 top-full mt-2 flex flex-wrap gap-1 max-w-[300px]">
            {/* Note */}
            {node.note && (
              <div className="group/note relative flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium hover:bg-blue-200 transition-colors" title={node.note}>
                <span>📝 Note</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveNote(node.id);
                  }}
                  className="w-3 h-3 rounded-full bg-blue-300 text-white text-[8px] flex items-center justify-center opacity-0 group-hover/note:opacity-100 hover:bg-red-500 transition-all"
                  title="Delete note"
                >
                  ×
                </button>
              </div>
            )}

            {/* Label */}
            {node.label && (
              <div className="group/label relative flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium hover:bg-purple-200 transition-colors">
                <span>🏷️ {node.label}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveLabel(node.id);
                  }}
                  className="w-3 h-3 rounded-full bg-purple-300 text-white text-[8px] flex items-center justify-center opacity-0 group-hover/label:opacity-100 hover:bg-red-500 transition-all"
                  title="Delete label"
                >
                  ×
                </button>
              </div>
            )}

            {/* Task */}
            {node.task && (
              <div className="group/task relative flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium hover:bg-green-200 transition-colors">
                <span
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTask(node.id);
                  }}
                >
                  {node.task.completed ? '✅' : '⬜'} Task
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTask(node.id);
                  }}
                  className="w-3 h-3 rounded-full bg-green-300 text-white text-[8px] flex items-center justify-center opacity-0 group-hover/task:opacity-100 hover:bg-red-500 transition-all"
                  title="Delete task"
                >
                  ×
                </button>
              </div>
            )}

            {/* Links */}
            {node.links && node.links.length > 0 && (
              <div className="group/links relative flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium hover:bg-indigo-200 transition-colors">
                <span>🔗 {node.links.length} link{node.links.length > 1 ? 's' : ''}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Delete first link for simplicity, or show a menu
                    if (node.links && node.links.length > 0) {
                      onRemoveLink(node.id, node.links[0].id);
                    }
                  }}
                  className="w-3 h-3 rounded-full bg-indigo-300 text-white text-[8px] flex items-center justify-center opacity-0 group-hover/links:opacity-100 hover:bg-red-500 transition-all"
                  title="Delete link"
                >
                  ×
                </button>
              </div>
            )}

            {/* Attachments */}
            {node.attachments && node.attachments.length > 0 && (
              <div className="group/attachments relative flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium hover:bg-orange-200 transition-colors">
                <span>📎 {node.attachments.length} file{node.attachments.length > 1 ? 's' : ''}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (node.attachments && node.attachments.length > 0) {
                      onRemoveAttachment(node.id, node.attachments[0].id);
                    }
                  }}
                  className="w-3 h-3 rounded-full bg-orange-300 text-white text-[8px] flex items-center justify-center opacity-0 group-hover/attachments:opacity-100 hover:bg-red-500 transition-all"
                  title="Delete attachment"
                >
                  ×
                </button>
              </div>
            )}

            {/* Audio Note */}
            {node.audioNote && (
              <div className="group/audio relative flex items-center gap-1 px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full font-medium hover:bg-pink-200 transition-colors">
                <span>🎙️ {Math.round(node.audioNote.duration)}s</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveAudioNote(node.id);
                  }}
                  className="w-3 h-3 rounded-full bg-pink-300 text-white text-[8px] flex items-center justify-center opacity-0 group-hover/audio:opacity-100 hover:bg-red-500 transition-all"
                  title="Delete audio note"
                >
                  ×
                </button>
              </div>
            )}

            {/* Sticker */}
            {node.sticker && (
              <div className="group/sticker relative">
                <div className="text-2xl">{node.sticker}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSticker(node.id);
                  }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover/sticker:opacity-100 hover:bg-red-600 transition-all shadow-md"
                  title="Delete sticker"
                >
                  ×
                </button>
              </div>
            )}

            {/* Illustration */}
            {node.illustration && (
              <div className="group/illustration relative flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full font-medium hover:bg-teal-200 transition-colors">
                <span>🖼️ Image</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveIllustration(node.id);
                  }}
                  className="w-3 h-3 rounded-full bg-teal-300 text-white text-[8px] flex items-center justify-center opacity-0 group-hover/illustration:opacity-100 hover:bg-red-500 transition-all"
                  title="Delete illustration"
                >
                  ×
                </button>
              </div>
            )}

            {/* Equation */}
            {node.equation && (
              <div className="group/equation relative flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium font-mono hover:bg-gray-200 transition-colors">
                <span>∑ {node.equation}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveEquation(node.id);
                  }}
                  className="w-3 h-3 rounded-full bg-gray-300 text-white text-[8px] flex items-center justify-center opacity-0 group-hover/equation:opacity-100 hover:bg-red-500 transition-all"
                  title="Delete equation"
                >
                  ×
                </button>
              </div>
            )}
          </div>
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
