export interface MarkerDefinition {
  id: string;
  name: string;
  icon: string;
  category: string;
  color?: string;
}

export const MARKER_CATEGORIES = [
  { id: 'priority', name: 'Priority', icon: '🎯' },
  { id: 'progress', name: 'Progress', icon: '📊' },
  { id: 'status', name: 'Status', icon: '✅' },
  { id: 'emotion', name: 'Emotion', icon: '😊' },
  { id: 'star', name: 'Star Rating', icon: '⭐' },
  { id: 'flag', name: 'Flag', icon: '🚩' },
];

export const MARKERS: MarkerDefinition[] = [
  // Priority markers
  { id: 'priority-1', name: 'Priority 1', icon: '1️⃣', category: 'priority' },
  { id: 'priority-2', name: 'Priority 2', icon: '2️⃣', category: 'priority' },
  { id: 'priority-3', name: 'Priority 3', icon: '3️⃣', category: 'priority' },
  { id: 'priority-4', name: 'Priority 4', icon: '4️⃣', category: 'priority' },
  { id: 'priority-5', name: 'Priority 5', icon: '5️⃣', category: 'priority' },
  { id: 'priority-6', name: 'Priority 6', icon: '6️⃣', category: 'priority' },
  { id: 'priority-7', name: 'Priority 7', icon: '7️⃣', category: 'priority' },
  { id: 'priority-8', name: 'Priority 8', icon: '8️⃣', category: 'priority' },
  { id: 'priority-9', name: 'Priority 9', icon: '9️⃣', category: 'priority' },

  // Progress markers
  { id: 'progress-0', name: 'Not Started', icon: '⭕', category: 'progress' },
  { id: 'progress-25', name: '25% Complete', icon: '🌑', category: 'progress' },
  { id: 'progress-50', name: '50% Complete', icon: '🌓', category: 'progress' },
  { id: 'progress-75', name: '75% Complete', icon: '🌔', category: 'progress' },
  { id: 'progress-100', name: '100% Complete', icon: '🌕', category: 'progress' },

  // Status markers
  { id: 'status-todo', name: 'To Do', icon: '📋', category: 'status' },
  { id: 'status-doing', name: 'In Progress', icon: '🔄', category: 'status' },
  { id: 'status-done', name: 'Done', icon: '✅', category: 'status' },
  { id: 'status-blocked', name: 'Blocked', icon: '🚫', category: 'status' },
  { id: 'status-review', name: 'Needs Review', icon: '👀', category: 'status' },

  // Emotion markers
  { id: 'emotion-happy', name: 'Happy', icon: '😊', category: 'emotion' },
  { id: 'emotion-sad', name: 'Sad', icon: '😢', category: 'emotion' },
  { id: 'emotion-angry', name: 'Angry', icon: '😠', category: 'emotion' },
  { id: 'emotion-surprised', name: 'Surprised', icon: '😮', category: 'emotion' },
  { id: 'emotion-thinking', name: 'Thinking', icon: '🤔', category: 'emotion' },
  { id: 'emotion-love', name: 'Love', icon: '❤️', category: 'emotion' },

  // Star rating markers
  { id: 'star-1', name: '1 Star', icon: '⭐', category: 'star' },
  { id: 'star-2', name: '2 Stars', icon: '⭐⭐', category: 'star' },
  { id: 'star-3', name: '3 Stars', icon: '⭐⭐⭐', category: 'star' },
  { id: 'star-4', name: '4 Stars', icon: '⭐⭐⭐⭐', category: 'star' },
  { id: 'star-5', name: '5 Stars', icon: '⭐⭐⭐⭐⭐', category: 'star' },

  // Flag markers
  { id: 'flag-red', name: 'Red Flag', icon: '🚩', category: 'flag' },
  { id: 'flag-blue', name: 'Blue Flag', icon: '🏁', category: 'flag' },
  { id: 'flag-green', name: 'Green Flag', icon: '🎌', category: 'flag' },
  { id: 'flag-yellow', name: 'Yellow Flag', icon: '⚠️', category: 'flag' },
];

export function getMarkerById(id: string): MarkerDefinition | undefined {
  return MARKERS.find(m => m.id === id);
}

export function getMarkersByCategory(category: string): MarkerDefinition[] {
  return MARKERS.filter(m => m.category === category);
}
