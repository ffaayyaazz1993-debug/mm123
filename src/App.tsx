import { useState, useEffect, useCallback } from 'react';
import { MindMap } from './components/MindMap';
import { Toolbar } from './components/Toolbar';
import { useMindMap } from './hooks/useMindMap';
import { ViewState } from './types';

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
  } = useMindMap();

  const [viewState, setViewState] = useState<ViewState>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });

  // Multi-select mode: when active, regular clicks toggle node selection
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape cancels link mode, multi-select mode, or summary edit
      if (e.key === 'Escape') {
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedIds, editingId, editingSummaryId, linkMode, multiSelectMode, addChild, addSibling, deleteNode, setEditingId, setEditingSummaryId, toggleCollapse, startLinkMode, cancelLinkMode, clearSelection, createSummary]);

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
        onSummary={handleCreateSummary}
        onReset={resetMap}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
        scale={viewState.scale}
      />

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
        viewState={viewState}
        setViewState={setViewState}
      />

      {/* Help Panel */}
      <div className="fixed bottom-4 left-4 z-50 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 p-3 text-xs text-gray-500 space-y-1">
        <div className="font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Shortcuts
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">Tab</kbd>
          <span>Add child</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">Enter</kbd>
          <span>Add sibling</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">F2</kbd>
          <span>Edit node</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">Del</kbd>
          <span>Delete node</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">R</kbd>
          <span>Add relationship</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">Ctrl+Click</kbd>
          <span>Multi-select</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-emerald-100 rounded text-[10px] font-mono border border-emerald-200 text-emerald-700">☐ btn</kbd>
          <span>Multi-select mode (touchpad)</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-purple-100 rounded text-[10px] font-mono border border-purple-200 text-purple-700">🏷️ btn</kbd>
          <span>Add markers</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">S</kbd>
          <span>Create summary</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">Space</kbd>
          <span>Collapse/Expand</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">Scroll</kbd>
          <span>Zoom</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">Drag</kbd>
          <span>Pan canvas</span>
        </div>
      </div>

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
