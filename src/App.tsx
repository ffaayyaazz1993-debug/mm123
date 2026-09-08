import { useState, useEffect, useCallback, useMemo } from 'react';
import { MindMap } from './components/MindMap';
import { Toolbar } from './components/Toolbar';
import { InsertMenu } from './components/InsertMenu';
import { FormatPanel } from './components/FormatPanel';
import { useMindMap } from './hooks/useMindMap';
import { ViewState, MindNode } from './types';

export default function App() {
  const {
    root,
    selectedId,
    selectedIds,
    editingId,
    editingSummaryId,
    relationships,
    summaries,
    linkMode,
    linkSourceId,
    setSelectedId,
    setEditingId,
    setEditingSummaryId,
    addChild,
    addSibling,
    addFloatingNode,
    updateNodePosition,
    deleteNode,
    updateText,
    toggleCollapse,
    resetMap,
    toggleNodeSelection,
    clearSelection,
    createSummary,
    deleteSummary,
    updateSummaryText,
    deleteRelationship,
    updateRelationshipLabel,
    startLinkMode,
    cancelLinkMode,
    handleLinkNodeClick,
    toggleMarker,
    insertNote,
    insertLabel,
    insertTask,
    toggleTask,
    insertLink,
    removeLink,
    insertAttachment,
    removeAttachment,
    insertAudioNote,
    removeAudioNote,
    insertSticker,
    removeSticker,
    insertIllustration,
    removeIllustration,
    insertEquation,
    removeEquation,
    removeNote,
    removeLabel,
    removeTask,
  } = useMindMap();

  const [viewState, setViewState] = useState<ViewState>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });

  // Multi-select mode: when active, regular clicks toggle node selection
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  
  // Node drag mode: when active, nodes can be dragged to reposition
  const [dragEnabled, setDragEnabled] = useState(false);
  
  // Insert menu state
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  
  // Format panel state
  const [showFormatPanel, setShowFormatPanel] = useState(false);
  
  // Selected layout state
  const [selectedLayout, setSelectedLayout] = useState<{
    layoutId: string;
    layoutName: string;
    variantId: string;
    variantName: string;
  }>({
    layoutId: 'org-chart',
    layoutName: 'Org Chart',
    variantId: 'oc-hierarchical',
    variantName: 'Hierarchical',
  });
  
  // Helper to find a node by ID
  const findNode = useCallback((node: MindNode, id: string): MindNode | null => {
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  }, []);
  
  // Get the currently selected node
  const selectedNode = useMemo(() => {
    if (!selectedId) return null;
    return findNode(root, selectedId);
  }, [root, selectedId, findNode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape cancels link mode, multi-select mode, or summary edit
      if (e.key === 'Escape') {
        if (showInsertMenu) {
          setShowInsertMenu(false);
          return;
        }
        if (linkMode) {
          cancelLinkMode();
          return;
        }
        if (multiSelectMode) {
          setMultiSelectMode(false);
          clearSelection();
          return;
        }
        if (editingSummaryId) {
          setEditingSummaryId(null);
          return;
        }
        if (editingId) {
          setEditingId(null);
          return;
        }
        if (selectedIds.size > 0) {
          clearSelection();
          return;
        }
      }

      // Don't handle other shortcuts when editing
      if (editingId || editingSummaryId) return;

      if (e.key === 'Tab' && selectedId) {
        e.preventDefault();
        addChild(selectedId);
      } else if (e.key === 'Enter' && selectedId) {
        e.preventDefault();
        addSibling(selectedId);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        deleteNode(selectedId);
      } else if (e.key === 'F2' && selectedId) {
        e.preventDefault();
        setEditingId(selectedId);
      } else if (e.key === ' ' && selectedId) {
        e.preventDefault();
        toggleCollapse(selectedId);
      } else if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey) {
        if (!linkMode) {
          e.preventDefault();
          startLinkMode();
        }
      } else if ((e.key === 's' || e.key === 'S') && !e.ctrlKey && !e.metaKey) {
        // Create summary from selected nodes
        if (selectedIds.size >= 2) {
          e.preventDefault();
          createSummary(Array.from(selectedIds));
        }
      } else if ((e.key === 'i' || e.key === 'I') && !e.ctrlKey && !e.metaKey) {
        // Open insert menu
        if (selectedId && !showInsertMenu) {
          e.preventDefault();
          setShowInsertMenu(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedIds, editingId, editingSummaryId, linkMode, multiSelectMode, showInsertMenu, addChild, addSibling, deleteNode, setEditingId, setEditingSummaryId, toggleCollapse, startLinkMode, cancelLinkMode, clearSelection, createSummary]);

  const handleZoomIn = useCallback(() => {
    setViewState(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 3) }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewState(prev => ({ ...prev, scale: Math.max(prev.scale * 0.8, 0.2) }));
  }, []);

  const handleFitView = useCallback(() => {
    setViewState({ offsetX: 0, offsetY: 0, scale: 1 });
  }, []);

  const handleCreateSummary = useCallback(() => {
    if (selectedIds.size >= 2) {
      createSummary(Array.from(selectedIds));
    }
  }, [selectedIds, createSummary]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 overflow-hidden relative">
      {/* Toolbar */}
      <Toolbar
        selectedId={selectedId}
        selectedIds={selectedIds}
        linkMode={linkMode}
        multiSelectMode={multiSelectMode}
        onAddChild={() => selectedId && addChild(selectedId)}
        onAddSibling={() => selectedId && addSibling(selectedId)}
        onDelete={() => selectedId && deleteNode(selectedId)}
        onEdit={() => selectedId && setEditingId(selectedId)}
        onLink={startLinkMode}
        onCancelLink={cancelLinkMode}
        onToggleMultiSelect={() => setMultiSelectMode(!multiSelectMode)}
        onToggleDrag={() => setDragEnabled(!dragEnabled)}
        dragEnabled={dragEnabled}
        onSummary={handleCreateSummary}
        onInsert={() => setShowInsertMenu(true)}
        onFormat={() => setShowFormatPanel(!showFormatPanel)}
        onReset={resetMap}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
        scale={viewState.scale}
      />

      {/* Insert Menu Modal */}
      {showInsertMenu && selectedNode && (
        <InsertMenu
          node={selectedNode}
          onClose={() => setShowInsertMenu(false)}
          onInsertNote={insertNote}
          onInsertLabel={insertLabel}
          onInsertTask={insertTask}
          onInsertLink={insertLink}
          onInsertAttachment={insertAttachment}
          onInsertAudioNote={insertAudioNote}
          onInsertSticker={insertSticker}
          onInsertIllustration={insertIllustration}
          onInsertEquation={insertEquation}
        />
      )}

      {/* Format Panel */}
      {showFormatPanel && (
        <FormatPanel
          onClose={() => setShowFormatPanel(false)}
          onMinimize={() => setShowFormatPanel(false)}
          selectedLayout={selectedLayout}
          onLayoutChange={setSelectedLayout}
        />
      )}

      {/* Mind Map Canvas */}
      <MindMap
        root={root}
        selectedId={selectedId}
        selectedIds={selectedIds}
        editingId={editingId}
        editingSummaryId={editingSummaryId}
        relationships={relationships}
        summaries={summaries}
        linkMode={linkMode}
        linkSourceId={linkSourceId}
        multiSelectMode={multiSelectMode}
        selectedLayout={selectedLayout}
        onSelect={setSelectedId}
        onEdit={setEditingId}
        onTextChange={updateText}
        onFinishEdit={() => setEditingId(null)}
        onToggleCollapse={toggleCollapse}
        onAddChild={addChild}
        onLinkNodeClick={handleLinkNodeClick}
        onDeleteRelationship={deleteRelationship}
        onUpdateRelationshipLabel={updateRelationshipLabel}
        onToggleNodeSelection={toggleNodeSelection}
        onClearSelection={clearSelection}
        onEditSummary={setEditingSummaryId}
        onUpdateSummaryText={updateSummaryText}
        onFinishSummaryEdit={() => setEditingSummaryId(null)}
        onDeleteSummary={deleteSummary}
        onToggleMarker={toggleMarker}
        dragEnabled={dragEnabled}
        onToggleTask={toggleTask}
        onRemoveLink={removeLink}
        onRemoveAttachment={removeAttachment}
        onRemoveAudioNote={removeAudioNote}
        onRemoveSticker={removeSticker}
        onRemoveIllustration={removeIllustration}
        onRemoveEquation={removeEquation}
        onRemoveNote={removeNote}
        onRemoveLabel={removeLabel}
        onRemoveTask={removeTask}
        onAddFloatingNode={addFloatingNode}
        onUpdateNodePosition={updateNodePosition}
        viewState={viewState}
        setViewState={setViewState}
      />

      {/* Branding */}
      <div className="fixed bottom-4 right-4 z-50 text-xs text-gray-400 font-medium flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
        MindMap
      </div>
    </div>
  );
}
