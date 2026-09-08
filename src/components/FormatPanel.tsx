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
    themeType: 'colorful' | 'classic';
    backgroundColor: string;
    globalFont: string;
    branchWidth: string;
    coloredBranch: boolean;
  };
  onFormatChange: (format: {
    theme?: number;
    themeType?: 'colorful' | 'classic';
    backgroundColor?: string;
    globalFont?: string;
    branchWidth?: string;
    coloredBranch?: boolean;
  }) => void;
}

// Colorful gradient themes
const COLORFUL_THEMES = [
  { id: 'rainbow', name: 'Rainbow', gradient: 'linear-gradient(135deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7)', colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'] },
  { id: 'energy', name: 'Energy', gradient: 'linear-gradient(135deg, #ff6b35, #f7931e, #ffd23f)', colors: ['#ff6b35', '#f7931e', '#ffd23f'] },
  { id: 'ocean', name: 'Ocean', gradient: 'linear-gradient(135deg, #00d2ff, #3a7bd5, #0063b2)', colors: ['#00d2ff', '#3a7bd5', '#0063b2'] },
  { id: 'dancing', name: 'Dancing', gradient: 'linear-gradient(135deg, #ff6b9d, #c44569, #a855f7)', colors: ['#ff6b9d', '#c44569', '#a855f7'] },
  { id: 'code', name: 'Code', gradient: 'linear-gradient(135deg, #00d9ff, #00ff88, #00d9ff)', colors: ['#00d9ff', '#00ff88', '#00d9ff'] },
  { id: 'kimono', name: 'Kimono Island', gradient: 'linear-gradient(135deg, #dc2626, #fbbf24, #1f2937)', colors: ['#dc2626', '#fbbf24', '#1f2937'] },
  { id: 'roses', name: 'Roses', gradient: 'linear-gradient(135deg, #f43f5e, #ec4899, #be185d)', colors: ['#f43f5e', '#ec4899', '#be185d'] },
  { id: 'mint', name: 'Mint', gradient: 'linear-gradient(135deg, #6ee7b7, #34d399, #10b981)', colors: ['#6ee7b7', '#34d399', '#10b981'] },
  { id: 'greentea', name: 'Green Tea', gradient: 'linear-gradient(135deg, #84cc16, #65a30d, #4d7c0f)', colors: ['#84cc16', '#65a30d', '#4d7c0f'] },
  { id: 'space', name: 'Space', gradient: 'linear-gradient(135deg, #1e1b4b, #312e81, #4c1d95)', colors: ['#1e1b4b', '#312e81', '#4c1d95'] },
  { id: 'shopisticated', name: 'Shopisticated', gradient: 'linear-gradient(135deg, #7c3aed, #a855f7, #d4af37)', colors: ['#7c3aed', '#a855f7', '#d4af37'] },
  { id: 'innocence', name: 'Innocence', gradient: 'linear-gradient(135deg, #fbcfe8, #f9a8d4, #f472b6)', colors: ['#fbcfe8', '#f9a8d4', '#f472b6'] },
];

// Classic solid color themes
const CLASSIC_THEMES = [
  { id: 'constancy', name: 'Constancy', gradient: 'linear-gradient(135deg, #3b82f6, #3b82f6)', colors: ['#3b82f6'] },
  { id: 'cream', name: 'Cream', gradient: 'linear-gradient(135deg, #fef3c7, #fef3c7)', colors: ['#fef3c7'] },
  { id: 'flowers', name: 'Flowers', gradient: 'linear-gradient(135deg, #ec4899, #ec4899)', colors: ['#ec4899'] },
  { id: 'coral', name: 'Coral', gradient: 'linear-gradient(135deg, #fb7185, #fb7185)', colors: ['#fb7185'] },
  { id: 'gorgeous', name: 'Gorgeous', gradient: 'linear-gradient(135deg, #8b5cf6, #8b5cf6)', colors: ['#8b5cf6'] },
  { id: 'champagne', name: 'Champagne', gradient: 'linear-gradient(135deg, #fbbf24, #fbbf24)', colors: ['#fbbf24'] },
  { id: 'perfume', name: 'Perfume', gradient: 'linear-gradient(135deg, #a78bfa, #a78bfa)', colors: ['#a78bfa'] },
  { id: 'zen', name: 'Zen', gradient: 'linear-gradient(135deg, #6b7280, #6b7280)', colors: ['#6b7280'] },
  { id: 'groove', name: 'Groove', gradient: 'linear-gradient(135deg, #f59e0b, #f59e0b)', colors: ['#f59e0b'] },
];

// Comprehensive color palette for background picker
const ALL_COLORS = [
  // Row 1: Whites & Grays
  '#ffffff', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626', '#171717',
  // Row 2: Reds
  '#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d',
  // Row 3: Oranges
  '#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12',
  // Row 4: Yellows
  '#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12',
  // Row 5: Greens
  '#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d',
  // Row 6: Teals
  '#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a',
  // Row 7: Blues
  '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
  // Row 8: Indigos
  '#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81',
  // Row 9: Purples
  '#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87',
  // Row 10: Pinks
  '#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843',
];

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
  const [bgColorOpen, setBgColorOpen] = useState(false);
  const [bgColorTab, setBgColorTab] = useState<'all' | 'theme' | 'recent'>('all');
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const layoutCardRef = useRef<HTMLButtonElement>(null);
  const bgColorRef = useRef<HTMLDivElement>(null);
  
  // Drag state
  const [position, setPosition] = useState({ x: window.innerWidth - 290, y: 0 });
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
    // Only start drag if clicking directly on the header, not on child elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-no-drag]')) {
      return;
    }
    
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
      const maxX = window.innerWidth - 280;
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeOpen || fontOpen || widthOpen) {
        setThemeOpen(false);
        setFontOpen(false);
        setWidthOpen(false);
      }
      if (bgColorOpen && bgColorRef.current && !bgColorRef.current.contains(e.target as Node)) {
        setBgColorOpen(false);
      }
    };
    
    if (themeOpen || fontOpen || widthOpen || bgColorOpen) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [themeOpen, fontOpen, widthOpen, bgColorOpen]);

  return (
    <div
      ref={panelRef}
      className="fixed z-[200] flex"
      style={{
        width: '280px',
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
          width: '280px',
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setLayoutPickerOpen(!layoutPickerOpen);
                  }}
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
              <div style={{ margin: '0 12px' }} className="flex items-center gap-1.5 relative">
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
                  {/* Theme preview pill */}
                  <div
                    style={{
                      width: '60px',
                      height: '10px',
                      borderRadius: '5px',
                      background: formatOptions.themeType === 'colorful' 
                        ? COLORFUL_THEMES[formatOptions.theme]?.gradient 
                        : CLASSIC_THEMES[formatOptions.theme]?.gradient,
                      flexShrink: 0,
                    }}
                  />
                  <span className="flex-1 text-left" style={{ color: '#e0e0e0', fontSize: '13px' }}>
                    {formatOptions.themeType === 'colorful' 
                      ? COLORFUL_THEMES[formatOptions.theme]?.name 
                      : CLASSIC_THEMES[formatOptions.theme]?.name}
                  </span>
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

                {/* Theme Dropdown Panel */}
                {themeOpen && (
                  <div 
                    className="absolute top-full left-0 mt-1 z-50"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '100%',
                      background: '#2a2a2a',
                      borderRadius: '6px',
                      border: '1px solid #3a3a3a',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      padding: '8px',
                      maxHeight: '400px',
                      overflowY: 'auto',
                    }}
                  >
                    {/* Colorful Section */}
                    <div style={{ fontSize: '10px', color: '#8b8b8b', fontWeight: 600, marginBottom: '6px', marginTop: '4px' }}>Colorful</div>
                    <div className="grid grid-cols-3 gap-2" style={{ marginBottom: '12px' }}>
                      {COLORFUL_THEMES.map((theme, idx) => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            onFormatChange({ theme: idx, themeType: 'colorful' });
                            setThemeOpen(false);
                          }}
                          className="flex flex-col items-center justify-center transition-all"
                          style={{
                            padding: '4px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            outline: formatOptions.theme === idx && formatOptions.themeType === 'colorful' ? '2px solid #fff' : '2px solid transparent',
                            outlineOffset: '1px',
                          }}
                          title={theme.name}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '36px',
                              background: theme.gradient,
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <MiniOrgChart accentColor="#fff" size="small" />
                          </div>
                          <span style={{ fontSize: '9px', color: '#e0e0e0', marginTop: '3px', fontWeight: 500 }}>
                            {theme.name}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Classic Section */}
                    <div style={{ fontSize: '10px', color: '#8b8b8b', fontWeight: 600, marginBottom: '6px' }}>Classic</div>
                    <div className="grid grid-cols-3 gap-2">
                      {CLASSIC_THEMES.map((theme, idx) => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            onFormatChange({ theme: idx, themeType: 'classic' });
                            setThemeOpen(false);
                          }}
                          className="flex flex-col items-center justify-center transition-all"
                          style={{
                            padding: '4px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            outline: formatOptions.theme === idx && formatOptions.themeType === 'classic' ? '2px solid #4a90d9' : '2px solid transparent',
                            outlineOffset: '1px',
                          }}
                          title={theme.name}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '36px',
                              background: '#fff',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <MiniOrgChart accentColor={theme.colors[0]} size="small" />
                          </div>
                          <span style={{ fontSize: '9px', color: '#e0e0e0', marginTop: '3px', fontWeight: 500 }}>
                            {theme.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: '#333' }}/>

              {/* Background Color row */}
              <div style={{ margin: '0 12px', position: 'relative' }} className="flex items-center justify-between py-3" ref={bgColorRef}>
                <span style={{ color: '#fff', fontSize: '13px' }}>Background Color</span>
                <button
                  onClick={() => setBgColorOpen(!bgColorOpen)}
                  style={{
                    width: '60px',
                    height: '24px',
                    background: formatOptions.backgroundColor,
                    borderRadius: '4px',
                    border: '1px solid #444',
                    cursor: 'pointer',
                  }}
                />
                
                {/* Background Color Picker Dropdown */}
                {bgColorOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '280px',
                      background: '#2a2a2a',
                      borderRadius: '6px',
                      border: '1px solid #3a3a3a',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      zIndex: 100,
                      marginTop: '8px',
                    }}
                  >
                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #3a3a3a' }}>
                      <button
                        onClick={() => setBgColorTab('all')}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: bgColorTab === 'all' ? '2px solid #fff' : '2px solid transparent',
                          color: bgColorTab === 'all' ? '#fff' : '#8b8b8b',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        All Colors
                      </button>
                      <button
                        onClick={() => setBgColorTab('theme')}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: bgColorTab === 'theme' ? '2px solid #fff' : '2px solid transparent',
                          color: bgColorTab === 'theme' ? '#fff' : '#8b8b8b',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Current Theme
                      </button>
                      <button
                        onClick={() => setBgColorTab('recent')}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: bgColorTab === 'recent' ? '2px solid #fff' : '2px solid transparent',
                          color: bgColorTab === 'recent' ? '#fff' : '#8b8b8b',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Recent
                      </button>
                    </div>

                    {/* Content based on active tab */}
                    <div style={{ padding: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                      {/* All Colors Tab */}
                      {bgColorTab === 'all' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' }}>
                          {ALL_COLORS.map((color, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                onFormatChange({ backgroundColor: color });
                                setRecentColors(prev => {
                                  const filtered = prev.filter(c => c !== color);
                                  return [color, ...filtered].slice(0, 10);
                                });
                                setBgColorOpen(false);
                              }}
                              style={{
                                width: '20px',
                                height: '20px',
                                background: color,
                                border: formatOptions.backgroundColor === color ? '2px solid #fff' : '1px solid #444',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                padding: 0,
                              }}
                              title={color}
                            />
                          ))}
                        </div>
                      )}

                      {/* Current Theme Tab */}
                      {bgColorTab === 'theme' && (
                        <div>
                          <div style={{ fontSize: '10px', color: '#8b8b8b', marginBottom: '8px', fontWeight: 600 }}>
                            Colors from Current Theme
                          </div>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {(formatOptions.themeType === 'colorful' 
                              ? COLORFUL_THEMES[formatOptions.theme]?.colors 
                              : CLASSIC_THEMES[formatOptions.theme]?.colors
                            )?.map((color, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  onFormatChange({ backgroundColor: color });
                                  setRecentColors(prev => {
                                    const filtered = prev.filter(c => c !== color);
                                    return [color, ...filtered].slice(0, 10);
                                  });
                                  setBgColorOpen(false);
                                }}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  background: color,
                                  border: formatOptions.backgroundColor === color ? '2px solid #fff' : '1px solid #444',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  padding: 0,
                                }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recent Tab */}
                      {bgColorTab === 'recent' && (
                        <div>
                          {recentColors.length > 0 ? (
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {recentColors.map((color, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    onFormatChange({ backgroundColor: color });
                                    setBgColorOpen(false);
                                  }}
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    background: color,
                                    border: formatOptions.backgroundColor === color ? '2px solid #fff' : '1px solid #444',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    padding: 0,
                                  }}
                                  title={color}
                                />
                              ))}
                            </div>
                          ) : (
                            <div style={{ fontSize: '11px', color: '#8b8b8b', textAlign: 'center', padding: '20px' }}>
                              No recently used colors
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
