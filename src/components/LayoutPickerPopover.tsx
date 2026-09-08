import React, { useState, useEffect, useRef } from 'react';

export interface LayoutVariant {
  id: string;
  name: string;
  thumbnail: React.ReactNode;
}

export interface LayoutItem {
  id: string;
  name: string;
  variants: LayoutVariant[];
}

const LAYOUT_ITEMS: LayoutItem[] = [
  {
    id: 'mindmap',
    name: 'Mind Map',
    variants: [
      { id: 'mm-right', name: 'Map Right', thumbnail: <MiniMindMap direction="right" /> },
      { id: 'mm-left', name: 'Map Left', thumbnail: <MiniMindMap direction="left" /> },
      { id: 'mm-both', name: 'Map Both', thumbnail: <MiniMindMap direction="both" /> },
    ],
  },
  {
    id: 'logic',
    name: 'Logic Chart',
    variants: [
      { id: 'lc-right', name: 'Chart Right', thumbnail: <MiniLogic direction="right" /> },
      { id: 'lc-left', name: 'Chart Left', thumbnail: <MiniLogic direction="left" /> },
    ],
  },
  {
    id: 'brace',
    name: 'Brace Map',
    variants: [
      { id: 'br-right', name: 'Brace Right', thumbnail: <MiniBrace side="right" /> },
      { id: 'br-left', name: 'Brace Left', thumbnail: <MiniBrace side="left" /> },
    ],
  },
  {
    id: 'org',
    name: 'Org Chart',
    variants: [
      { id: 'oc-down', name: 'Chart Down', thumbnail: <MiniOrg direction="down" /> },
      { id: 'oc-right', name: 'Chart Right', thumbnail: <MiniOrg direction="right" /> },
      { id: 'oc-left', name: 'Chart Left', thumbnail: <MiniOrg direction="left" /> },
    ],
  },
  {
    id: 'tree',
    name: 'Tree Chart',
    variants: [
      { id: 'tc-down', name: 'Tree Down', thumbnail: <MiniTree direction="down" /> },
      { id: 'tc-right', name: 'Tree Right', thumbnail: <MiniTree direction="right" /> },
      { id: 'tc-left', name: 'Tree Left', thumbnail: <MiniTree direction="left" /> },
    ],
  },
  {
    id: 'timeline',
    name: 'Timeline',
    variants: [
      { id: 'tl-horiz', name: 'Horizontal', thumbnail: <MiniTimeline orientation="horizontal" /> },
      { id: 'tl-vert', name: 'Vertical', thumbnail: <MiniTimeline orientation="vertical" /> },
    ],
  },
  {
    id: 'fishbone',
    name: 'Fishbone',
    variants: [
      { id: 'fb-right', name: 'Fish Right', thumbnail: <MiniFishbone direction="right" /> },
      { id: 'fb-left', name: 'Fish Left', thumbnail: <MiniFishbone direction="left" /> },
    ],
  },
  {
    id: 'treetable',
    name: 'Tree Table',
    variants: [
      { id: 'tt-down', name: 'Table Down', thumbnail: <MiniTreeTable /> },
      { id: 'tt-right', name: 'Table Right', thumbnail: <MiniTreeTable horizontal /> },
    ],
  },
  {
    id: 'matrix',
    name: 'Matrix',
    variants: [
      { id: 'mx-2x2', name: '2 × 2', thumbnail: <MiniMatrix size={2} /> },
      { id: 'mx-3x3', name: '3 × 3', thumbnail: <MiniMatrix size={3} /> },
      { id: 'mx-4x4', name: '4 × 4', thumbnail: <MiniMatrix size={4} /> },
    ],
  },
];

// --- Mini thumbnail SVGs for variants ---

const MiniMindMap: React.FC<{ direction: 'left' | 'right' | 'both' }> = ({ direction }) => (
  <svg width="44" height="30" viewBox="0 0 44 30" fill="none">
    <rect x="18" y="11" width="8" height="8" rx="1.5" fill="#6b7280" />
    {direction !== 'left' && (
      <>
        <line x1="26" y1="15" x2="34" y2="8" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="26" y1="15" x2="34" y2="22" stroke="#6b7280" strokeWidth="0.8" />
        <rect x="34" y="5" width="6" height="6" rx="1" fill="#9ca3af" />
        <rect x="34" y="19" width="6" height="6" rx="1" fill="#9ca3af" />
      </>
    )}
    {direction !== 'right' && (
      <>
        <line x1="18" y1="15" x2="10" y2="8" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="18" y1="15" x2="10" y2="22" stroke="#6b7280" strokeWidth="0.8" />
        <rect x="4" y="5" width="6" height="6" rx="1" fill="#9ca3af" />
        <rect x="4" y="19" width="6" height="6" rx="1" fill="#9ca3af" />
      </>
    )}
  </svg>
);

const MiniLogic: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => (
  <svg width="44" height="30" viewBox="0 0 44 30" fill="none">
    {direction === 'right' ? (
      <>
        <rect x="2" y="11" width="8" height="8" rx="1.5" fill="#6b7280" />
        <line x1="10" y1="15" x2="18" y2="15" stroke="#6b7280" strokeWidth="0.8" />
        <rect x="18" y="11" width="8" height="8" rx="1.5" fill="#6b7280" />
        <line x1="26" y1="15" x2="34" y2="15" stroke="#6b7280" strokeWidth="0.8" />
        <rect x="34" y="11" width="8" height="8" rx="1.5" fill="#9ca3af" />
      </>
    ) : (
      <>
        <rect x="34" y="11" width="8" height="8" rx="1.5" fill="#6b7280" />
        <line x1="34" y1="15" x2="26" y2="15" stroke="#6b7280" strokeWidth="0.8" />
        <rect x="18" y="11" width="8" height="8" rx="1.5" fill="#6b7280" />
        <line x1="18" y1="15" x2="10" y2="15" stroke="#6b7280" strokeWidth="0.8" />
        <rect x="2" y="11" width="8" height="8" rx="1.5" fill="#9ca3af" />
      </>
    )}
  </svg>
);

const MiniBrace: React.FC<{ side: 'left' | 'right' }> = ({ side }) => (
  <svg width="44" height="30" viewBox="0 0 44 30" fill="none">
    {side === 'right' ? (
      <>
        <rect x="4" y="4" width="8" height="6" rx="1" fill="#9ca3af" />
        <rect x="4" y="12" width="8" height="6" rx="1" fill="#9ca3af" />
        <rect x="4" y="20" width="8" height="6" rx="1" fill="#9ca3af" />
        <path d="M 14 7 Q 18 7 18 15 Q 18 23 14 23" stroke="#6b7280" strokeWidth="1" fill="none" />
        <rect x="22" y="11" width="10" height="8" rx="1.5" fill="#6b7280" />
      </>
    ) : (
      <>
        <rect x="32" y="4" width="8" height="6" rx="1" fill="#9ca3af" />
        <rect x="32" y="12" width="8" height="6" rx="1" fill="#9ca3af" />
        <rect x="32" y="20" width="8" height="6" rx="1" fill="#9ca3af" />
        <path d="M 30 7 Q 26 7 26 15 Q 26 23 30 23" stroke="#6b7280" strokeWidth="1" fill="none" />
        <rect x="12" y="11" width="10" height="8" rx="1.5" fill="#6b7280" />
      </>
    )}
  </svg>
);

const MiniOrg: React.FC<{ direction: 'down' | 'left' | 'right' }> = ({ direction }) => (
  <svg width="44" height="30" viewBox="0 0 44 30" fill="none">
    {direction === 'down' ? (
      <>
        <rect x="17" y="2" width="10" height="6" rx="1" fill="#6b7280" />
        <line x1="22" y1="8" x2="22" y2="12" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="10" y1="12" x2="34" y2="12" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="10" y1="12" x2="10" y2="16" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="34" y1="12" x2="34" y2="16" stroke="#6b7280" strokeWidth="0.8" />
        <rect x="5" y="16" width="10" height="6" rx="1" fill="#9ca3af" />
        <rect x="29" y="16" width="10" height="6" rx="1" fill="#9ca3af" />
        <line x1="10" y1="22" x2="10" y2="24" stroke="#6b7280" strokeWidth="0.6" />
        <line x1="34" y1="22" x2="34" y2="24" stroke="#6b7280" strokeWidth="0.6" />
      </>
    ) : direction === 'right' ? (
      <>
        <rect x="2" y="11" width="10" height="8" rx="1" fill="#6b7280" />
        <line x1="12" y1="15" x2="18" y2="15" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="18" y1="6" x2="18" y2="24" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="18" y1="6" x2="22" y2="6" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="18" y1="24" x2="22" y2="24" stroke="#6b7280" strokeWidth="0.8" />
        <rect x="22" y="2" width="10" height="8" rx="1" fill="#9ca3af" />
        <rect x="22" y="20" width="10" height="8" rx="1" fill="#9ca3af" />
      </>
    ) : (
      <>
        <rect x="32" y="11" width="10" height="8" rx="1" fill="#6b7280" />
        <line x1="32" y1="15" x2="26" y2="15" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="26" y1="6" x2="26" y2="24" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="26" y1="6" x2="22" y2="6" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="26" y1="24" x2="22" y2="24" stroke="#6b7280" strokeWidth="0.8" />
        <rect x="12" y="2" width="10" height="8" rx="1" fill="#9ca3af" />
        <rect x="12" y="20" width="10" height="8" rx="1" fill="#9ca3af" />
      </>
    )}
  </svg>
);

const MiniTree: React.FC<{ direction: 'down' | 'left' | 'right' }> = ({ direction }) => (
  <svg width="44" height="30" viewBox="0 0 44 30" fill="none">
    {direction === 'down' ? (
      <>
        <rect x="18" y="2" width="8" height="6" rx="1" fill="#6b7280" />
        <line x1="22" y1="8" x2="22" y2="12" stroke="#6b7280" strokeWidth="0.8" />
        <rect x="10" y="12" width="8" height="6" rx="1" fill="#9ca3af" />
        <rect x="26" y="12" width="8" height="6" rx="1" fill="#9ca3af" />
        <line x1="14" y1="18" x2="14" y2="22" stroke="#6b7280" strokeWidth="0.6" />
        <rect x="10" y="22" width="8" height="6" rx="1" fill="#9ca3af" opacity="0.7" />
      </>
    ) : direction === 'right' ? (
      <>
        <rect x="2" y="11" width="8" height="8" rx="1" fill="#6b7280" />
        <line x1="10" y1="15" x2="14" y2="15" stroke="#6b7280" strokeWidth="0.8" />
        <rect x="14" y="4" width="8" height="6" rx="1" fill="#9ca3af" />
        <rect x="14" y="20" width="8" height="6" rx="1" fill="#9ca3af" />
        <line x1="22" y1="7" x2="26" y2="7" stroke="#6b7280" strokeWidth="0.6" />
        <rect x="26" y="4" width="8" height="6" rx="1" fill="#9ca3af" opacity="0.7" />
      </>
    ) : (
      <>
        <rect x="34" y="11" width="8" height="8" rx="1" fill="#6b7280" />
        <line x1="34" y1="15" x2="30" y2="15" stroke="#6b7280" strokeWidth="0.8" />
        <rect x="22" y="4" width="8" height="6" rx="1" fill="#9ca3af" />
        <rect x="22" y="20" width="8" height="6" rx="1" fill="#9ca3af" />
        <line x1="22" y1="7" x2="18" y2="7" stroke="#6b7280" strokeWidth="0.6" />
        <rect x="10" y="4" width="8" height="6" rx="1" fill="#9ca3af" opacity="0.7" />
      </>
    )}
  </svg>
);

const MiniTimeline: React.FC<{ orientation: 'horizontal' | 'vertical' }> = ({ orientation }) => (
  <svg width="44" height="30" viewBox="0 0 44 30" fill="none">
    {orientation === 'horizontal' ? (
      <>
        <line x1="4" y1="15" x2="40" y2="15" stroke="#6b7280" strokeWidth="1.2" />
        <circle cx="10" cy="15" r="2.5" fill="#9ca3af" />
        <circle cx="22" cy="15" r="2.5" fill="#9ca3af" />
        <circle cx="34" cy="15" r="2.5" fill="#9ca3af" />
        <line x1="10" y1="12" x2="10" y2="6" stroke="#6b7280" strokeWidth="0.6" />
        <line x1="22" y1="18" x2="22" y2="24" stroke="#6b7280" strokeWidth="0.6" />
        <line x1="34" y1="12" x2="34" y2="6" stroke="#6b7280" strokeWidth="0.6" />
        <rect x="6" y="2" width="8" height="4" rx="0.5" fill="#6b7280" opacity="0.5" />
        <rect x="18" y="24" width="8" height="4" rx="0.5" fill="#6b7280" opacity="0.5" />
        <rect x="30" y="2" width="8" height="4" rx="0.5" fill="#6b7280" opacity="0.5" />
      </>
    ) : (
      <>
        <line x1="22" y1="4" x2="22" y2="26" stroke="#6b7280" strokeWidth="1.2" />
        <circle cx="22" cy="8" r="2.5" fill="#9ca3af" />
        <circle cx="22" cy="15" r="2.5" fill="#9ca3af" />
        <circle cx="22" cy="22" r="2.5" fill="#9ca3af" />
        <line x1="25" y1="8" x2="32" y2="8" stroke="#6b7280" strokeWidth="0.6" />
        <line x1="19" y1="15" x2="12" y2="15" stroke="#6b7280" strokeWidth="0.6" />
        <line x1="25" y1="22" x2="32" y2="22" stroke="#6b7280" strokeWidth="0.6" />
      </>
    )}
  </svg>
);

const MiniFishbone: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => (
  <svg width="44" height="30" viewBox="0 0 44 30" fill="none">
    <line x1="4" y1="15" x2="40" y2="15" stroke="#6b7280" strokeWidth="1.2" />
    {direction === 'right' ? (
      <>
        <rect x="32" y="11" width="10" height="8" rx="1" fill="#6b7280" />
        <line x1="12" y1="15" x2="8" y2="6" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="12" y1="15" x2="8" y2="24" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="22" y1="15" x2="18" y2="6" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="22" y1="15" x2="18" y2="24" stroke="#6b7280" strokeWidth="0.8" />
      </>
    ) : (
      <>
        <rect x="2" y="11" width="10" height="8" rx="1" fill="#6b7280" />
        <line x1="32" y1="15" x2="36" y2="6" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="32" y1="15" x2="36" y2="24" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="22" y1="15" x2="26" y2="6" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="22" y1="15" x2="26" y2="24" stroke="#6b7280" strokeWidth="0.8" />
      </>
    )}
  </svg>
);

const MiniTreeTable: React.FC<{ horizontal?: boolean }> = ({ horizontal }) => (
  <svg width="44" height="30" viewBox="0 0 44 30" fill="none">
    {horizontal ? (
      <>
        <rect x="2" y="11" width="10" height="8" rx="1" fill="#6b7280" />
        <line x1="12" y1="15" x2="18" y2="15" stroke="#6b7280" strokeWidth="0.8" />
        <rect x="18" y="4" width="22" height="6" rx="1" fill="#9ca3af" opacity="0.6" />
        <rect x="18" y="12" width="22" height="6" rx="1" fill="#9ca3af" opacity="0.6" />
        <rect x="18" y="20" width="22" height="6" rx="1" fill="#9ca3af" opacity="0.6" />
        <line x1="18" y1="15" x2="18" y2="4" stroke="#6b7280" strokeWidth="0.6" />
        <line x1="18" y1="15" x2="18" y2="26" stroke="#6b7280" strokeWidth="0.6" />
      </>
    ) : (
      <>
        <rect x="17" y="2" width="10" height="6" rx="1" fill="#6b7280" />
        <line x1="22" y1="8" x2="22" y2="12" stroke="#6b7280" strokeWidth="0.8" />
        <rect x="4" y="12" width="16" height="5" rx="1" fill="#9ca3af" opacity="0.6" />
        <rect x="24" y="12" width="16" height="5" rx="1" fill="#9ca3af" opacity="0.6" />
        <rect x="4" y="20" width="16" height="5" rx="1" fill="#9ca3af" opacity="0.6" />
        <rect x="24" y="20" width="16" height="5" rx="1" fill="#9ca3af" opacity="0.6" />
        <line x1="22" y1="12" x2="4" y2="12" stroke="#6b7280" strokeWidth="0.6" />
        <line x1="22" y1="12" x2="40" y2="12" stroke="#6b7280" strokeWidth="0.6" />
      </>
    )}
  </svg>
);

const MiniMatrix: React.FC<{ size: number }> = ({ size }) => {
  const cellSize = Math.floor(28 / size);
  const gap = 1;
  const totalSize = size * cellSize + (size - 1) * gap;
  const offset = (44 - totalSize) / 2;
  const offsetY = (30 - totalSize) / 2;

  return (
    <svg width="44" height="30" viewBox="0 0 44 30" fill="none">
      {Array.from({ length: size }).map((_, row) =>
        Array.from({ length: size }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={offset + col * (cellSize + gap)}
            y={offsetY + row * (cellSize + gap)}
            width={cellSize}
            height={cellSize}
            rx={0.5}
            fill={row === 0 && col === 0 ? '#6b7280' : '#9ca3af'}
            opacity={row === 0 && col === 0 ? 1 : 0.5}
          />
        ))
      )}
    </svg>
  );
};

// --- Main Popover Component ---

interface LayoutPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (layoutId: string, layoutName: string, variantId: string, variantName: string) => void;
  anchorRef: React.RefObject<HTMLElement>;
}

export const LayoutPickerPopover: React.FC<LayoutPickerPopoverProps> = ({
  isOpen,
  onClose,
  onSelect,
  anchorRef,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, anchorRef]);

  // Reset expanded state when popover closes
  useEffect(() => {
    if (!isOpen) setExpandedId(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRowClick = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleVariantClick = (layoutId: string, layoutName: string, variantId: string, variantName: string) => {
    onSelect(layoutId, layoutName, variantId, variantName);
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: '50%',
        right: '222px',
        transform: 'translateY(-50%)',
        width: '310px',
        minHeight: '530px',
        background: '#262626',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        padding: '12px',
        display: 'flex',
        zIndex: 300,
        fontFamily: 'Inter, "Segoe UI", sans-serif',
      }}
    >
      {/* Left menu column */}
      <div style={{ width: '160px', flexShrink: 0 }}>
        {LAYOUT_ITEMS.map(item => {
          const isExpanded = expandedId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleRowClick(item.id)}
              style={{
                width: '100%',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 8px',
                background: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#333333')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Caret */}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                style={{
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  flexShrink: 0,
                }}
              >
                <path d="M3 2L7 5L3 8" fill="#cfcfcf" />
              </svg>
              {/* Label */}
              <span
                style={{
                  fontSize: '14px',
                  color: '#e6e6e6',
                  fontWeight: 500,
                  textAlign: 'left',
                  flex: 1,
                }}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right pane - submenu/preview area */}
      <div
        style={{
          flex: 1,
          marginLeft: '12px',
          background: '#1e1e1e',
          borderRadius: '6px',
          padding: '8px',
          minHeight: '500px',
        }}
      >
        {expandedId && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {LAYOUT_ITEMS.find(item => item.id === expandedId)?.variants.map(variant => (
              <button
                key={variant.id}
                onClick={() => {
                  const item = LAYOUT_ITEMS.find(i => i.id === expandedId);
                  if (item) handleVariantClick(item.id, item.name, variant.id, variant.name);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 8px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  width: '100%',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#333333')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: '44px',
                    height: '30px',
                    background: '#2a2a2a',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {variant.thumbnail}
                </div>
                {/* Name */}
                <span style={{ fontSize: '12px', color: '#e6e6e6', fontWeight: 400 }}>
                  {variant.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
