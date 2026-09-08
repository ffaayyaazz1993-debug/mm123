import React, { useState, useRef, useCallback, useEffect } from 'react';
import { LayoutPickerPopover } from './LayoutPickerPopover';

interface FormatPanelProps {
  onClose: () => void;
  onMinimize: () => void;
  selectedLayout: {
    layoutId: string;
    layoutName: string;
    variantId: string;
    variantName: string;
  };
  onLayoutChange: (layout: {
    layoutId: string;
    layoutName: string;
    variantId: string;
    variantName: string;
  }) => void;
  formatOptions: {
    theme: number;
    backgroundColor: string;
    globalFont: string;
    branchWidth: string;
    coloredBranch: boolean;
  };
  onFormatChange: (format: {
    theme?: number;
    backgroundColor?: string;
    globalFont?: string;
    branchWidth?: string;
    coloredBranch?: boolean;
  }) => void;
}

const THEME_COLORS = ['#e0407b', '#4a90d9', '#58b368', '#e6a23c', '#d9534f', '#8e6bbf'];
const THEME_NAMES = ['Rose', 'Ocean', 'Forest', 'Amber', 'Ruby', 'Violet'];

// Mini org chart SVG for thumbnails
const MiniOrgChart: React.FC<{ accentColor?: string; size?: 'large' | 'small' }> = ({ accentColor = '#9ca3af', size = 'large' }) => {
  const w = size === 'large' ? 76 : 48;
  const h = size === 'large' ? 48 : 32;
  const scale = size === 'large' ? 1 : 0.63;

  return (
    <svg width={w} height={h} viewBox="0 0 76 48" fill="none">
      {/* Top node */}
      <rect x="28" y="2" width="20" height="10" rx="2" fill={accentColor} opacity="0.2" stroke={accentColor} strokeWidth="1"/>
      {/* Middle nodes */}
      <rect x="10" y="20" width="16" height="8" rx="2" fill={accentColor} opacity="0.15" stroke={accentColor} strokeWidth="0.8"/>
      <rect x="50" y="20" width="16" height="8" rx="2" fill={accentColor} opacity="0.15" stroke={accentColor} strokeWidth="0.8"/>
      {/* Bottom nodes */}
      <rect x="2" y="36" width="12" height="7" rx="1.5" fill={accentColor} opacity="0.1" stroke={accentColor} strokeWidth="0.6"/>
      <rect x="18" y="36" width="12" height="7" rx="1.5" fill={accentColor} opacity="0.1" stroke={accentColor} strokeWidth="0.6"/>
      <rect x="46" y="36" width="12" height="7" rx="1.5" fill={accentColor} opacity="0.1" stroke={accentColor} strokeWidth="0.6"/>
      <rect x="62" y="36" width="12" height="7" rx="1.5" fill={accentColor} opacity="0.1" stroke={accentColor} strokeWidth="0.6"/>
      {/* Lines */}
      <line x1="38" y1="12" x2="38" y2="16" stroke={accentColor} strokeWidth="0.8"/>
      <line x1="18" y1="16" x2="58" y2="16" stroke={accentColor} strokeWidth="0.8"/>
      <line x1="18" y1="16" x2="18" y2="20" stroke={accentColor} strokeWidth="0.8"/>
      <line x1="58" y1="16" x2="58" y2="20" stroke={accentColor} strokeWidth="0.8"/>
      <line x1="18" y1="28" x2="18" y2="32" stroke={accentColor} strokeWidth="0.6"/>
      <line x1="58" y1="28" x2="58" y2="32" stroke={accentColor} strokeWidth="0.6"/>
      <line x1="8" y1="32" x2="28" y2="32" stroke={accentColor} strokeWidth="0.6"/>
      <line x1="52" y1="32" x2="72" y2="32" stroke={accentColor} strokeWidth="0.6"/>
      <line x1="8" y1="32" x2="8" y2="36" stroke={accentColor} strokeWidth="0.6"/>
      <line x1="24" y1="32" x2="24" y2="36" stroke={accentColor} strokeWidth="0.6"/>
      <line x1="52" y1="32" x2="52" y2="36" stroke={accentColor} strokeWidth="0.6"/>
      <line x1="68" y1="32" x2="68" y2="36" stroke={accentColor} strokeWidth="0.6"/>
    </svg>
  );
};

const ChevronDown: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className}>
    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FormatPanel: React.FC<FormatPanelProps> = ({ 
  onClose, 
  onMinimize,
  selectedLayout,
  onLayoutChange,
  formatOptions,
  onFormatChange,
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'pitch' | 'map'>('map');
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);
  const [widthOpen, setWidthOpen] = useState(false);
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);
  const layoutCardRef = useRef<HTMLButtonElement>(null);
  
  // Drag state
  const [position, setPosition] = useState({ x: window.innerWidth - 220, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'style' as const, label: 'Style' },
    { id: 'pitch' as const, label: 'Pitch' },
    { id: 'map' as const, label: 'Map' },
  ];

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep panel within viewport bounds
      const maxX = window.innerWidth - 210;
      const maxY = window.innerHeight - 100; // Leave some space at bottom
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  }, [isDragging, dragOffset]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  return (
    <div
      ref={panelRef}
      className="fixed z-[200] flex"
      style={{
        width: '210px',
        height: '100vh',
        left: `${position.x}px`,
        top: `${position.y}px`,
        fontFamily: 'Inter, "Segoe UI", sans-serif',
        fontSize: '13px',
        transition: isDragging ? 'none' : 'box-shadow 0.2s'
      }}
    >
      {/* Panel */}
      <div
        className="h-full flex flex-col overflow-hidden"
        style={{
          width: '210px',
          background: '#1e1e1e',
          color: '#fff',
          borderRadius: isDragging ? '8px' : '0',
          boxShadow: isDragging 
            ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)' 
            : '0 0 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Custom scrollbar styles */}
        <style>{`
          .format-scrollbar::-webkit-scrollbar { width: 4px; }
          .format-scrollbar::-webkit-scrollbar-track { background: #1e1e1e; }
          .format-scrollbar::-webkit-scrollbar-thumb { background: #444; border-radius: 2px; }
          .format-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        `}</style>

        {/* Header - Drag Handle */}
        <div 
          className="relative flex flex-col items-center pt-3 pb-2" 
          style={{ 
            minHeight: '64px',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
          onMouseDown={handleDragStart}
        >
          {/* Window controls */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="w-5 h-5 flex items-center justify-center rounded transition-colors"
              style={{ color: '#8b8b8b' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8b8b8b')}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="2" y1="5" x2="8" y2="5"/>
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-5 h-5 flex items-center justify-center rounded transition-colors"
              style={{ color: '#8b8b8b' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8b8b8b')}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="2" y1="2" x2="8" y2="8"/>
                <line x1="8" y1="2" x2="2" y2="8"/>
              </svg>
            </button>
          </div>
          {/* Panel icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18M9 21V9"/>
          </svg>
          <span className="mt-1" style={{ fontSize: '13px', color: '#fff' }}>Format</span>
          {/* Drag indicator dots */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            <div className="w-1 h-1 rounded-full" style={{ background: '#666' }}></div>
            <div className="w-1 h-1 rounded-full" style={{ background: '#666' }}></div>
            <div className="w-1 h-1 rounded-full" style={{ background: '#666' }}></div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex" style={{ height: '40px', borderBottom: '1px solid #333' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center transition-colors relative"
              style={{
                color: activeTab === tab.id ? '#fff' : '#8b8b8b',
                fontSize: '13px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) e.currentTarget.style.color = '#bbb';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) e.currentTarget.style.color = '#8b8b8b';
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0" style={{ height: '2px', background: '#fff' }}/>
              )}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto format-scrollbar">
          {activeTab === 'map' && (
            <div className="pb-4">
              {/* Layout card */}
              <div style={{ margin: '12px' }}>
                <button
                  ref={layoutCardRef}
                  onClick={() => setLayoutPickerOpen(!layoutPickerOpen)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-md transition-colors"
                  style={{ background: '#2a2a2a', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#2a2a2a')}
                >
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '76px',
                      height: '48px',
                      background: '#fff',
                      borderRadius: '4px',
                    }}
                  >
                    <MiniOrgChart accentColor="#9ca3af" size="large" />
                  </div>
                  <div className="flex-1 text-left">
                    <div style={{ color: '#e0e0e0', fontSize: '13px' }}>{selectedLayout.layoutName}</div>
                    <div style={{ color: '#8b8b8b', fontSize: '10px', marginTop: '2px' }}>{selectedLayout.variantName}</div>
                  </div>
                  <ChevronDown className="flex-shrink-0" />
                </button>
              </div>

              {/* Layout Picker Popover */}
              <LayoutPickerPopover
                isOpen={layoutPickerOpen}
                onClose={() => setLayoutPickerOpen(false)}
                onSelect={(layoutId, layoutName, variantId, variantName) => {
                  onLayoutChange({ layoutId, layoutName, variantId, variantName });
                }}
                anchorRef={layoutCardRef as React.RefObject<HTMLElement>}
              />

              {/* Divider */}
              <div style={{ height: '1px', background: '#333' }}/>

              {/* Color Theme label */}
              <div style={{ margin: '12px', fontSize: '11px', color: '#8b8b8b' }}>Color Theme</div>

              {/* Theme dropdown row */}
              <div style={{ margin: '0 12px' }} className="flex items-center gap-1.5">
                <button
                  onClick={() => setThemeOpen(!themeOpen)}
                  className="flex-1 flex items-center gap-2 px-2.5 transition-colors"
                  style={{
                    height: '36px',
                    background: '#2a2a2a',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#2a2a2a')}
                >
                  {/* Rainbow pill */}
                  <div
                    style={{
                      width: '60px',
                      height: '10px',
                      borderRadius: '5px',
                      background: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7)',
                      flexShrink: 0,
                    }}
                  />
                  <span className="flex-1 text-left" style={{ color: '#e0e0e0', fontSize: '13px' }}>Rainbow</span>
                  <ChevronDown className="flex-shrink-0" />
                </button>
                {/* + button */}
                <button
                  className="flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    width: '36px',
                    height: '36px',
                    background: '#2a2a2a',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#e0e0e0',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#2a2a2a')}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="7" y1="2" x2="7" y2="12"/>
                    <line x1="2" y1="7" x2="12" y2="7"/>
                  </svg>
                </button>
              </div>

              {/* Theme preview grid */}
              <div style={{ margin: '12px' }} className="grid grid-cols-3 gap-2">
                {THEME_COLORS.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => onFormatChange({ theme: idx })}
                    className="flex flex-col items-center justify-center transition-all"
                    style={{
                      width: '56px',
                      height: '40px',
                      background: '#fff',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      outline: formatOptions.theme === idx ? '2px solid #d0d0d0' : '2px solid transparent',
                      outlineOffset: '1px',
                    }}
                  >
                    <MiniOrgChart accentColor={color} size="small" />
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: '#333' }}/>

              {/* Background Color row */}
              <div style={{ margin: '0 12px' }} className="flex items-center justify-between py-3">
                <span style={{ color: '#fff', fontSize: '13px' }}>Background Color</span>
                <div
                  style={{
                    width: '60px',
                    height: '24px',
                    background: '#f5f5f5',
                    borderRadius: '4px',
                    border: '1px solid #444',
                  }}
                />
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: '#333' }}/>

              {/* Global Font */}
              <div style={{ margin: '12px 12px 6px', fontSize: '11px', color: '#8b8b8b' }}>Global Font</div>
              <div style={{ margin: '0 12px 8px' }}>
                <button
                  onClick={() => setFontOpen(!fontOpen)}
                  className="w-full flex items-center justify-between px-2.5 transition-colors"
                  style={{
                    height: '32px',
                    background: '#2a2a2a',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#2a2a2a')}
                >
                  <span style={{ color: '#e0e0e0', fontSize: '13px' }}>Default</span>
                  <ChevronDown />
                </button>
              </div>

              {/* Branch Line Width */}
              <div style={{ margin: '12px 12px 6px', fontSize: '11px', color: '#8b8b8b' }}>Branch Line Width</div>
              <div style={{ margin: '0 12px 8px' }}>
                <button
                  onClick={() => setWidthOpen(!widthOpen)}
                  className="w-full flex items-center justify-between px-2.5 transition-colors"
                  style={{
                    height: '32px',
                    background: '#2a2a2a',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#2a2a2a')}
                >
                  <span style={{ color: '#e0e0e0', fontSize: '13px' }}>Default</span>
                  <ChevronDown />
                </button>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: '#333' }}/>

              {/* Colored Branch row */}
              <div style={{ margin: '0 12px' }} className="flex items-center justify-between py-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => onFormatChange({ coloredBranch: !formatOptions.coloredBranch })}
                    className="flex items-center justify-center transition-colors"
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '3px',
                      background: formatOptions.coloredBranch ? '#4a90d9' : 'transparent',
                      border: formatOptions.coloredBranch ? 'none' : '1.5px solid #8b8b8b',
                      cursor: 'pointer',
                    }}
                  >
                    {formatOptions.coloredBranch && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 5L4.5 7.5L8 3"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ color: '#fff', fontSize: '13px' }}>Colored Branch</span>
                </label>
                {/* Color wheel button */}
                <button
                  className="flex items-center justify-center gap-1 transition-colors"
                  style={{
                    width: '60px',
                    height: '24px',
                    background: '#2a2a2a',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#2a2a2a')}
                >
                  {/* Conic gradient color wheel */}
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: 'conic-gradient(red, yellow, green, cyan, blue, magenta, red)',
                      flexShrink: 0,
                    }}
                  />
                  <ChevronDown />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="flex items-center justify-center h-32" style={{ color: '#8b8b8b', fontSize: '12px' }}>
              Style options coming soon
            </div>
          )}

          {activeTab === 'pitch' && (
            <div className="flex items-center justify-center h-32" style={{ color: '#8b8b8b', fontSize: '12px' }}>
              Pitch options coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
