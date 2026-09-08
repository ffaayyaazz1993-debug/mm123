import React, { useState } from 'react';
import { MARKERS, MARKER_CATEGORIES, MarkerDefinition } from '../utils/markers';

interface MarkerPickerProps {
  currentMarkers: string[];
  onToggleMarker: (markerId: string) => void;
  onClose: () => void;
}

export const MarkerPicker: React.FC<MarkerPickerProps> = ({
  currentMarkers,
  onToggleMarker,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('priority');

  const handleMarkerClick = (markerId: string) => {
    onToggleMarker(markerId);
  };

  return (
    <div className="absolute top-full left-0 mt-2 z-[100] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden min-w-[320px]">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Add Markers</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {MARKER_CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={category.name}
          >
            <span className="text-base">{category.icon}</span>
          </button>
        ))}
      </div>

      {/* Markers grid */}
      <div className="p-4 max-h-[300px] overflow-y-auto">
        <div className="grid grid-cols-3 gap-2">
          {MARKERS.filter(m => m.category === activeCategory).map(marker => {
            const isSelected = currentMarkers.includes(marker.id);
            return (
              <button
                key={marker.id}
                onClick={() => handleMarkerClick(marker.id)}
                className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                }`}
                title={marker.name}
              >
                <div className="text-2xl text-center mb-1">{marker.icon}</div>
                <div className="text-xs text-gray-600 text-center truncate">
                  {marker.name}
                </div>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      {currentMarkers.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="text-xs text-gray-600 mb-2">
            Active markers: {currentMarkers.length}
          </div>
          <div className="flex flex-wrap gap-1">
            {currentMarkers.map(markerId => {
              const marker = MARKERS.find(m => m.id === markerId);
              if (!marker) return null;
              return (
                <span
                  key={markerId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                >
                  <span>{marker.icon}</span>
                  <span className="text-gray-600">{marker.name}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
