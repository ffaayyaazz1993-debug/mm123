import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { MindNode as MindNodeType, Relationship, Summary, ViewState } from '../types';
import { calculateLayout, LayoutResult } from '../utils/layout';
import { MindNodeComponent } from './MindNode';
import { Connections } from './Connections';
import { Relationships } from './Relationships';
import { Summaries } from './Summaries';

interface MindMapProps {
  root: MindNodeType;
  selectedId: string | null;
  selectedIds: Set<string>;
  editingId: string | null;
  editingSummaryId: string | null;
  relationships: Relationship[];
  summaries: Summary[];
  linkMode: boolean;
  linkSourceId: string | null;
  multiSelectMode: boolean;
  dragEnabled: boolean;
  selectedLayout: {
    layoutId: string;
    layoutName: string;
    variantId: string;
    variantName: string;
  };
  formatOptions: {
    theme: number;
    backgroundColor: string;
    globalFont: string;
    branchWidth: string;
    coloredBranch: boolean;
  };
  onSelect: (id: string | null) => void;
  onEdit: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  onFinishEdit: () => void;
  onToggleCollapse: (id: string) => void;
  onAddChild: (id: string) => void;
  onLinkNodeClick: (id: string) => boolean;
  onDeleteRelationship: (id: string) => void;
  onUpdateRelationshipLabel: (id: string, label: string) => void;
  onToggleNodeSelection: (id: string) => void;
  onClearSelection: () => void;
  onEditSummary: (id: string) => void;
  onUpdateSummaryText: (id: string, text: string) => void;
  onFinishSummaryEdit: () => void;
  onDeleteSummary: (id: string) => void;
  onToggleMarker: (nodeId: string, markerId: string) => void;
  onToggleTask: (nodeId: string) => void;
  onRemoveLink: (nodeId: string, linkId: string) => void;
  onRemoveAttachment: (nodeId: string, attachmentId: string) => void;
  onRemoveAudioNote: (nodeId: string) => void;
  onRemoveSticker: (nodeId: string) => void;
  onRemoveIllustration: (nodeId: string) => void;
  onRemoveEquation: (nodeId: string) => void;
  onRemoveNote: (nodeId: string) => void;
  onRemoveLabel: (nodeId: string) => void;
  onRemoveTask: (nodeId: string) => void;
  onAddFloatingNode: (x: number, y: number) => void;
  onUpdateNodePosition: (id: string, x: number, y: number) => void;
  viewState: ViewState;
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
}

export const MindMap: React.FC<MindMapProps> = ({
  root,
  selectedId,
  selectedIds,
  editingId,
  editingSummaryId,
  relationships,
  summaries,
  linkMode,
  linkSourceId,
  multiSelectMode,
  dragEnabled,
  selectedLayout,
  formatOptions,
  onSelect,
  onEdit,
  onTextChange,
  onFinishEdit,
  onToggleCollapse,
  onAddChild,
  onLinkNodeClick,
  onDeleteRelationship,
  onUpdateRelationshipLabel,
  onToggleNodeSelection,
  onClearSelection,
  onEditSummary,
  onUpdateSummaryText,
  onFinishSummaryEdit,
  onDeleteSummary,
  onToggleMarker,
  onToggleTask,
  onRemoveLink,
  onRemoveAttachment,
  onRemoveAudioNote,
  onRemoveSticker,
  onRemoveIllustration,
  onRemoveEquation,
  onRemoveNote,
  onRemoveLabel,
  onRemoveTask,
  onAddFloatingNode,
  onUpdateNodePosition,
  viewState,
  setViewState,
}) => {  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [nodeDragStart, setNodeDragStart] = useState({ x: 0, y: 0 });
  const [draggedNodePosition, setDraggedNodePosition] = useState<{ x: number; y: number } | null>(null);

  // Calculate layout
  const layoutResults = useMemo(() => calculateLayout(root, selectedLayout.layoutId as any), [root, selectedLayout.layoutId]);

  // Create a map of id -> layout position
  const layoutMap = useMemo(() => {
    const map = new Map<string, LayoutResult>();
    layoutResults.forEach(r => map.set(r.id, r));
    return map;
  }, [layoutResults]);

  // Create node positions map for connections
  const nodePositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number; width: number; height: number }>();
    
    const getNodeWidth = (node: MindNodeType): number => {
      return Math.max(120, node.text.length * 9 + 48);
    };
    
    const traverse = (node: MindNodeType) => {
      const pos = layoutMap.get(node.id);
      if (pos) {
        const width = getNodeWidth(node);
        const height = pos.depth === 0 ? 52 : 40;
        map.set(node.id, { x: pos.x, y: pos.y, width, height });
      }
      if (!node.collapsed) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    };
    
    traverse(root);
    return map;
  }, [layoutMap, root]);

  // Canvas pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target === containerRef.current || target.classList.contains('canvas-bg') || target.tagName === 'svg' || target.tagName === 'path') {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - viewState.offsetX, y: e.clientY - viewState.offsetY });
      onSelect(null);
      onClearSelection();
    }
  }, [viewState.offsetX, viewState.offsetY, onSelect, onClearSelection]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Handle canvas panning
    if (isDraggingCanvas) {
      setViewState(prev => ({
        ...prev,
        offsetX: e.clientX - dragStart.x,
        offsetY: e.clientY - dragStart.y,
      }));
    }
    // Handle node dragging
    else if (draggingNodeId && draggedNodePosition) {
      const deltaX = (e.clientX - nodeDragStart.x) / viewState.scale;
      const deltaY = (e.clientY - nodeDragStart.y) / viewState.scale;
      
      // Calculate new position based on the initial dragged position
      const newX = draggedNodePosition.x + deltaX;
      const newY = draggedNodePosition.y + deltaY;
      
      // Update the node position
      onUpdateNodePosition(draggingNodeId, newX, newY);
      
      // Update drag start for next movement
      setNodeDragStart({ x: e.clientX, y: e.clientY });
      setDraggedNodePosition({ x: newX, y: newY });
    }
  }, [isDraggingCanvas, draggingNodeId, draggedNodePosition, nodeDragStart, dragStart, viewState.scale, onUpdateNodePosition, setViewState]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingCanvas(false);
    if (draggingNodeId) {
      setDraggingNodeId(null);
      setDraggedNodePosition(null);
    }
  }, [draggingNodeId]);

  // Node drag handlers
  const handleNodeDragStart = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingNodeId(id);
    setNodeDragStart({ x: e.clientX, y: e.clientY });
    
    // Get the current position from layout map
    const nodePos = layoutMap.get(id);
    if (nodePos) {
      setDraggedNodePosition({ x: nodePos.x, y: nodePos.y });
    }
  }, [layoutMap]);

  // Double-click handler to create floating node
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Only create node if double-clicking on canvas background
    if (target === containerRef.current || target.classList.contains('canvas-bg') || target.tagName === 'svg') {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Calculate position relative to container center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Convert to mind map coordinates (accounting for pan and zoom)
      const mindMapX = (clickX - centerX - viewState.offsetX) / viewState.scale;
      const mindMapY = (clickY - centerY - viewState.offsetY) / viewState.scale;

      onAddFloatingNode(mindMapX, mindMapY);
    }
  }, [viewState, onAddFloatingNode]);

  // Zoom handler using native event for preventDefault support
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.92 : 1.08;
      setViewState(prev => {
        const newScale = Math.min(Math.max(prev.scale * delta, 0.15), 3);
        
        const rect = el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        const scaleChange = newScale / prev.scale;
        return {
          scale: newScale,
          offsetX: mouseX - (mouseX - prev.offsetX) * scaleChange,
          offsetY: mouseY - (mouseY - prev.offsetY) * scaleChange,
        };
      });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [setViewState]);

  // Get all visible nodes
  const getVisibleNodes = useCallback((node: MindNodeType): MindNodeType[] => {
    const nodes: MindNodeType[] = [node];
    if (!node.collapsed) {
      for (const child of node.children) {
        nodes.push(...getVisibleNodes(child));
      }
    }
    return nodes;
  }, []);

  const visibleNodes = useMemo(() => getVisibleNodes(root), [root, getVisibleNodes]);

  // Handle node click with multi-select support
  const handleNodeSelect = useCallback((id: string, e: React.MouseEvent) => {
    if (linkMode) {
      onLinkNodeClick(id);
      return;
    }
    
    // Multi-select mode: toggle selection on every click
    // Or: Ctrl (Windows/Linux) or Cmd (Mac) + click
    if (multiSelectMode || e.ctrlKey || e.metaKey) {
      e.preventDefault();
      onToggleNodeSelection(id);
      onSelect(id);
    } else {
      // Single select - clear multi-selection
      onClearSelection();
      onSelect(id);
    }
  }, [linkMode, multiSelectMode, onLinkNodeClick, onToggleNodeSelection, onClearSelection, onSelect]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative"
      style={{ 
        cursor: isDraggingCanvas || draggingNodeId ? 'grabbing' : linkMode ? 'crosshair' : multiSelectMode ? 'cell' : 'default',
        backgroundColor: formatOptions.backgroundColor,
        fontFamily: formatOptions.globalFont !== 'Default' ? formatOptions.globalFont : 'Inter, "Segoe UI", sans-serif',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Dot grid background */}
      <div 
        className="canvas-bg absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #cbd5e1 0.8px, transparent 0.8px)`,
          backgroundSize: `${24 * viewState.scale}px ${24 * viewState.scale}px`,
          backgroundPosition: `${viewState.offsetX % (24 * viewState.scale)}px ${viewState.offsetY % (24 * viewState.scale)}px`,
          opacity: 0.4,
        }}
      />

      {/* Link mode indicator */}
      {linkMode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          {linkSourceId ? 'Click target node to create relationship' : 'Click source node'}
          <span className="text-indigo-200 ml-1">(Esc to cancel)</span>
        </div>
      )}

      {/* Multi-select indicator */}
      {selectedIds.size > 0 && !linkMode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          {selectedIds.size} node{selectedIds.size > 1 ? 's' : ''} selected
          <span className="text-emerald-200 ml-1">
            {multiSelectMode ? '(Click to toggle)' : '(Ctrl+Click to toggle)'}
          </span>
        </div>
      )}

      {/* Multi-select mode active indicator */}
      {multiSelectMode && selectedIds.size === 0 && !linkMode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Multi-Select Mode: Click nodes to select
          <span className="text-emerald-200 ml-1">(Esc to exit)</span>
        </div>
      )}

      {/* Transform container */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(${viewState.offsetX}px, ${viewState.offsetY}px) scale(${viewState.scale})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Connections SVG */}
        <Connections 
          root={root} 
          nodePositions={nodePositions} 
          coloredBranch={formatOptions.coloredBranch}
          themeColor={['#e0407b', '#4a90d9', '#58b368', '#e6a23c', '#d9534f', '#8e6bbf'][formatOptions.theme]}
          branchWidth={formatOptions.branchWidth}
        />

        {/* Relationships SVG */}
        <Relationships
          root={root}
          relationships={relationships}
          nodePositions={nodePositions}
          onDeleteRelationship={onDeleteRelationship}
          onUpdateLabel={onUpdateRelationshipLabel}
        />

        {/* Summaries SVG */}
        <Summaries
          root={root}
          summaries={summaries}
          nodePositions={nodePositions}
          editingSummaryId={editingSummaryId}
          onEditSummary={onEditSummary}
          onUpdateText={onUpdateSummaryText}
          onFinishEdit={onFinishSummaryEdit}
          onDeleteSummary={onDeleteSummary}
        />

        {/* Nodes */}
        <div className="pointer-events-auto">
          {visibleNodes.map(node => {
            const pos = layoutMap.get(node.id);
            if (!pos) return null;

            // Use dragged position if this node is being dragged
            const isBeingDragged = draggingNodeId === node.id && draggedNodePosition;
            const nodeX = isBeingDragged ? draggedNodePosition.x : pos.x;
            const nodeY = isBeingDragged ? draggedNodePosition.y : pos.y;

            // Apply theme color if coloredBranch is enabled
            const themeColors = ['#e0407b', '#4a90d9', '#58b368', '#e6a23c', '#d9534f', '#8e6bbf'];
            const nodeWithTheme = formatOptions.coloredBranch 
              ? { ...node, color: node.color || themeColors[formatOptions.theme] }
              : node;

            return (
              <MindNodeComponent
                key={node.id}
                node={nodeWithTheme}
                x={nodeX}
                y={nodeY}
                isSelected={selectedId === node.id}
                isMultiSelected={selectedIds.has(node.id)}
                isEditing={editingId === node.id}
                isRoot={pos.depth === 0}
                hasChildren={node.children.length > 0}
                isCollapsed={node.collapsed || false}
                isLinkSource={linkSourceId === node.id}
                isDragging={draggingNodeId === node.id}
                dragEnabled={dragEnabled}
                onSelect={(id, e) => handleNodeSelect(id, e)}
                onEdit={onEdit}
                onTextChange={onTextChange}
                onFinishEdit={onFinishEdit}
                onToggleCollapse={onToggleCollapse}
                onAddChild={onAddChild}
                onToggleMarker={onToggleMarker}
                onDragStart={handleNodeDragStart}
                onDrag={() => {}} // Handled in parent mouse move
                onDragEnd={() => {
                  setDraggingNodeId(null);
                  setDraggedNodePosition(null);
                }}
                onToggleTask={onToggleTask}
                onRemoveLink={onRemoveLink}
                onRemoveAttachment={onRemoveAttachment}
                onRemoveAudioNote={onRemoveAudioNote}
                onRemoveSticker={onRemoveSticker}
                onRemoveIllustration={onRemoveIllustration}
                onRemoveEquation={onRemoveEquation}
                onRemoveNote={onRemoveNote}
                onRemoveLabel={onRemoveLabel}
                onRemoveTask={onRemoveTask}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
