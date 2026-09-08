import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { MindNode as MindNodeType, ViewState } from '../types';
import { calculateLayout, LayoutResult } from '../utils/layout';
import { MindNodeComponent } from './MindNode';
import { Connections } from './Connections';

interface MindMapProps {
  root: MindNodeType;
  selectedId: string | null;
  editingId: string | null;
  onSelect: (id: string | null) => void;
  onEdit: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  onFinishEdit: () => void;
  onToggleCollapse: (id: string) => void;
  onAddChild: (id: string) => void;
  viewState: ViewState;
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
}

export const MindMap: React.FC<MindMapProps> = ({
  root,
  selectedId,
  editingId,
  onSelect,
  onEdit,
  onTextChange,
  onFinishEdit,
  onToggleCollapse,
  onAddChild,
  viewState,
  setViewState,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Calculate layout
  const layoutResults = useMemo(() => calculateLayout(root), [root]);

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

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target === containerRef.current || target.classList.contains('canvas-bg') || target.tagName === 'svg' || target.tagName === 'path') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - viewState.offsetX, y: e.clientY - viewState.offsetY });
      onSelect(null);
    }
  }, [viewState.offsetX, viewState.offsetY, onSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setViewState(prev => ({
        ...prev,
        offsetX: e.clientX - dragStart.x,
        offsetY: e.clientY - dragStart.y,
      }));
    }
  }, [isDragging, dragStart, setViewState]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Zoom handler using native event for preventDefault support
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.92 : 1.08;
      setViewState(prev => {
        const newScale = Math.min(Math.max(prev.scale * delta, 0.15), 3);
        
        // Zoom toward cursor
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

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative"
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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

      {/* Transform container */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(${viewState.offsetX}px, ${viewState.offsetY}px) scale(${viewState.scale})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Connections SVG */}
        <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 0 }}>
          <Connections root={root} nodePositions={nodePositions} />
        </div>

        {/* Nodes */}
        <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}>
          {visibleNodes.map(node => {
            const pos = layoutMap.get(node.id);
            if (!pos) return null;

            return (
              <MindNodeComponent
                key={node.id}
                node={node}
                x={pos.x}
                y={pos.y}
                isSelected={selectedId === node.id}
                isEditing={editingId === node.id}
                isRoot={pos.depth === 0}
                hasChildren={node.children.length > 0}
                isCollapsed={node.collapsed || false}
                onSelect={onSelect}
                onEdit={onEdit}
                onTextChange={onTextChange}
                onFinishEdit={onFinishEdit}
                onToggleCollapse={onToggleCollapse}
                onAddChild={onAddChild}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
