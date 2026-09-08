import React from 'react';

interface ToolbarProps {
  selectedId: string | null;
  onAddChild: () => void;
  onAddSibling: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  scale: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedId,
  onAddChild,
  onAddSibling,
  onDelete,
  onEdit,
  onReset,
  onZoomIn,
  onZoomOut,
  onFitView,
  scale,
}) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 px-3 py-2">
      {/* View controls */}
      <div className="flex items-center gap-1 pr-3 border-r border-gray-200">
        <button
          onClick={onZoomOut}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
          title="Zoom Out"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
        <span className="text-xs text-gray-500 min-w-[40px] text-center font-medium">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
          title="Zoom In"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
        <button
          onClick={onFitView}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
          title="Fit View"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </button>
      </div>

      {/* Node controls */}
      <div className="flex items-center gap-1 px-3 border-r border-gray-200">
        <button
          onClick={onAddChild}
          disabled={!selectedId}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600"
          title="Add Child (Tab)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
            <path d="M3 12h4M17 12h4" opacity="0.4"/>
          </svg>
        </button>
        <button
          onClick={onAddSibling}
          disabled={!selectedId}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600"
          title="Add Sibling (Enter)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
            <path d="M10 7h4v7" opacity="0.4"/>
          </svg>
        </button>
        <button
          onClick={onEdit}
          disabled={!selectedId}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600"
          title="Edit (F2 or Double-click)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          onClick={onDelete}
          disabled={!selectedId}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600"
          title="Delete (Del)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3,6 5,6 21,6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
        title="Reset Map"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 4v6h6"/>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
        </svg>
      </button>
    </div>
  );
};
