import { useState, useCallback } from 'react';
import { MindNode, Relationship, Summary } from '../types';

const BRANCH_COLORS = [
  '#4A90D9', // blue
  '#E74C3C', // red
  '#2ECC71', // green
  '#F39C12', // orange
  '#9B59B6', // purple
  '#1ABC9C', // teal
  '#E91E63', // pink
  '#00BCD4', // cyan
  '#FF5722', // deep orange
  '#607D8B', // blue grey
];

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function createDefaultMap(): MindNode {
  return {
    id: generateId(),
    text: '🧠 Mind Mapping',
    color: '#4A90D9',
    markers: ['star-5'],
    label: 'Central Topic',
    note: 'This is the main mind map topic. Use the insert button (+) to add notes, labels, tasks, links, and more!',
    children: [
      {
        id: generateId(),
        text: '📋 Planning',
        color: '#E74C3C',
        markers: ['priority-1', 'status-doing'],
        task: { completed: false, dueDate: '2024-12-31', assignee: 'Team Lead' },
        children: [
          { id: generateId(), text: 'Set Goals', color: '#E74C3C', children: [], markers: ['progress-75'], note: 'Define clear, measurable objectives' },
          { id: generateId(), text: 'Define Scope', color: '#E74C3C', children: [], markers: ['progress-50'], links: [{ id: 'link1', type: 'webpage', url: 'https://example.com/scope', title: 'Scope Guide' }] },
          { id: generateId(), text: 'Timeline', color: '#E74C3C', children: [], markers: ['progress-25'], equation: 'T = Σ(tasks) × avg_time' },
        ],
      },
      {
        id: generateId(),
        text: '💡 Ideas',
        color: '#2ECC71',
        markers: ['emotion-thinking'],
        sticker: '💡',
        children: [
          { id: generateId(), text: 'Brainstorm', color: '#2ECC71', children: [], markers: ['emotion-happy'], label: 'Creative' },
          { id: generateId(), text: 'Research', color: '#2ECC71', children: [], markers: ['star-3'], links: [{ id: 'link2', type: 'webpage', url: 'https://research.example.com', title: 'Research Portal' }] },
          { id: generateId(), text: 'Innovation', color: '#2ECC71', children: [], markers: ['flag-red'], task: { completed: true } },
        ],
      },
      {
        id: generateId(),
        text: '🎯 Tasks',
        color: '#F39C12',
        markers: ['priority-2'],
        task: { completed: false },
        children: [
          { id: generateId(), text: 'Priority High', color: '#F39C12', children: [], markers: ['priority-1', 'status-todo'], task: { completed: false, dueDate: '2024-12-15' } },
          { id: generateId(), text: 'Priority Medium', color: '#F39C12', children: [], markers: ['priority-5', 'status-doing'], task: { completed: false, dueDate: '2024-12-25' } },
          { id: generateId(), text: 'Priority Low', color: '#F39C12', children: [], markers: ['priority-9'], task: { completed: true } },
        ],
      },
      {
        id: generateId(),
        text: '📚 Resources',
        color: '#9B59B6',
        children: [
          { id: generateId(), text: 'Team Members', color: '#9B59B6', children: [], markers: ['star-4'], label: '5 people' },
          { id: generateId(), text: 'Tools & Software', color: '#9B59B6', children: [], markers: ['status-review'], links: [{ id: 'link3', type: 'webpage', url: 'https://tools.example.com', title: 'Tools List' }] },
        ],
      },
      {
        id: generateId(),
        text: '📊 Progress',
        color: '#1ABC9C',
        markers: ['progress-100'],
        children: [
          { id: generateId(), text: 'Milestones', color: '#1ABC9C', children: [], markers: ['flag-blue'], equation: 'M = completed / total × 100%' },
          { id: generateId(), text: 'KPIs', color: '#1ABC9C', children: [], markers: ['star-5'], sticker: '🏆' },
          { id: generateId(), text: 'Reviews', color: '#1ABC9C', children: [], markers: ['status-done'], task: { completed: true } },
        ],
      },
      {
        id: generateId(),
        text: '⚡ Actions',
        color: '#E91E63',
        markers: ['flag-red', 'priority-1'],
        task: { completed: false },
        children: [
          { id: generateId(), text: 'Next Steps', color: '#E91E63', children: [], markers: ['status-todo'], task: { completed: false }, note: 'Immediate action items for this week' },
          { id: generateId(), text: 'Follow Up', color: '#E91E63', children: [], markers: ['status-doing'], task: { completed: false } },
        ],
      },
    ],
  };
}

function createDefaultRelationships(root: MindNode): Relationship[] {
  const rels: Relationship[] = [];
  
  if (root.children[0]?.children[0] && root.children[4]?.children[0]) {
    rels.push({
      id: generateId(),
      sourceId: root.children[0].children[0].id,
      targetId: root.children[4].children[0].id,
      label: 'tracks',
      color: '#6366f1',
    });
  }
  
  if (root.children[1]?.children[0] && root.children[1]?.children[2]) {
    rels.push({
      id: generateId(),
      sourceId: root.children[1].children[0].id,
      targetId: root.children[1].children[2].id,
      label: 'leads to',
      color: '#2ECC71',
    });
  }
  
  if (root.children[5]?.children[0] && root.children[2]?.children[0]) {
    rels.push({
      id: generateId(),
      sourceId: root.children[5].children[0].id,
      targetId: root.children[2].children[0].id,
      label: 'prioritizes',
      color: '#E91E63',
    });
  }
  
  return rels;
}

function createDefaultSummaries(root: MindNode): Summary[] {
  // Create a demo summary for the Planning branch
  const planning = root.children[0];
  if (planning && planning.children.length >= 2) {
    return [{
      id: generateId(),
      topicIds: [planning.children[0].id, planning.children[1].id],
      text: '📌 Foundation',
      color: '#E74C3C',
    }];
  }
  return [];
}

function createInitial() {
  const root = createDefaultMap();
  const relationships = createDefaultRelationships(root);
  const summaries = createDefaultSummaries(root);
  return { root, relationships, summaries };
}

export function useMindMap() {
  const [initial] = useState(createInitial);
  const [root, setRoot] = useState<MindNode>(initial.root);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSummaryId, setEditingSummaryId] = useState<string | null>(null);
  const [relationships, setRelationships] = useState<Relationship[]>(initial.relationships);
  const [summaries, setSummaries] = useState<Summary[]>(initial.summaries);
  const [linkMode, setLinkMode] = useState(false);
  const [linkSourceId, setLinkSourceId] = useState<string | null>(null);

  const findNode = useCallback((node: MindNode, id: string): MindNode | null => {
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  }, []);

  const findParent = useCallback((node: MindNode, targetId: string): MindNode | null => {
    for (const child of node.children) {
      if (child.id === targetId) return node;
      const found = findParent(child, targetId);
      if (found) return found;
    }
    return null;
  }, []);

  const updateNode = useCallback((node: MindNode, id: string, updater: (n: MindNode) => MindNode): MindNode => {
    if (node.id === id) return updater(node);
    return {
      ...node,
      children: node.children.map(child => updateNode(child, id, updater)),
    };
  }, []);

  const deleteNodeFromTree = useCallback((node: MindNode, id: string): MindNode => {
    return {
      ...node,
      children: node.children
        .filter(child => child.id !== id)
        .map(child => deleteNodeFromTree(child, id)),
    };
  }, []);

  const addChild = useCallback((parentId: string) => {
    setRoot(prev => {
      const parent = findNode(prev, parentId);
      if (!parent) return prev;
      const color = parent.color || BRANCH_COLORS[Math.floor(Math.random() * BRANCH_COLORS.length)];
      const newNode: MindNode = {
        id: generateId(),
        text: 'New Topic',
        color,
        children: [],
      };
      return updateNode(prev, parentId, n => ({
        ...n,
        children: [...n.children, newNode],
      }));
    });
  }, [findNode, updateNode]);

  const addSibling = useCallback((nodeId: string) => {
    setRoot(prev => {
      const parent = findParent(prev, nodeId);
      if (!parent) return prev;

      const targetNode = findNode(prev, nodeId);
      if (!targetNode) return prev;

      const color = targetNode.color || BRANCH_COLORS[Math.floor(Math.random() * BRANCH_COLORS.length)];
      const newNode: MindNode = {
        id: generateId(),
        text: 'New Topic',
        color,
        children: [],
      };

      return updateNode(prev, parent.id, n => ({
        ...n,
        children: [...n.children, newNode],
      }));
    });
  }, [findNode, findParent, updateNode]);

  const deleteNode = useCallback((nodeId: string) => {
    setRoot(prev => {
      if (prev.id === nodeId) return prev;
      return deleteNodeFromTree(prev, nodeId);
    });
    setRelationships(prev => prev.filter(r => r.sourceId !== nodeId && r.targetId !== nodeId));
    setSummaries(prev => prev.filter(s => !s.topicIds.includes(nodeId)));
    setSelectedId(null);
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(nodeId);
      return next;
    });
  }, [deleteNodeFromTree]);

  const updateText = useCallback((nodeId: string, text: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({ ...n, text })));
  }, [updateNode]);

  // Marker management
  const toggleMarker = useCallback((nodeId: string, markerId: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => {
      const markers = n.markers || [];
      const hasMarker = markers.includes(markerId);
      return {
        ...n,
        markers: hasMarker
          ? markers.filter(id => id !== markerId)
          : [...markers, markerId],
      };
    }));
  }, [updateNode]);

  const removeMarker = useCallback((nodeId: string, markerId: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({
      ...n,
      markers: (n.markers || []).filter(id => id !== markerId),
    })));
  }, [updateNode]);

  const clearMarkers = useCallback((nodeId: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({
      ...n,
      markers: [],
    })));
  }, [updateNode]);

  // Insert features management
  const insertNote = useCallback((nodeId: string, note: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({ ...n, note })));
  }, [updateNode]);

  const insertLabel = useCallback((nodeId: string, label: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({ ...n, label })));
  }, [updateNode]);

  const insertTask = useCallback((nodeId: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({
      ...n,
      task: { completed: false },
    })));
  }, [updateNode]);

  const toggleTask = useCallback((nodeId: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => {
      if (!n.task) return n;
      return { ...n, task: { ...n.task, completed: !n.task.completed } };
    }));
  }, [updateNode]);

  const insertLink = useCallback((nodeId: string, type: 'webpage' | 'topic' | 'file' | 'folder', url: string, title?: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => {
      const links = n.links || [];
      const newLink = {
        id: generateId(),
        type,
        url,
        title: title || url,
      };
      return { ...n, links: [...links, newLink] };
    }));
  }, [updateNode]);

  const removeLink = useCallback((nodeId: string, linkId: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({
      ...n,
      links: (n.links || []).filter(l => l.id !== linkId),
    })));
  }, [updateNode]);

  const insertAttachment = useCallback((nodeId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setRoot(prev => updateNode(prev, nodeId, n => {
        const attachments = n.attachments || [];
        const newAttachment = {
          id: generateId(),
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result as string,
        };
        return { ...n, attachments: [...attachments, newAttachment] };
      }));
    };
    reader.readAsDataURL(file);
  }, [updateNode]);

  const removeAttachment = useCallback((nodeId: string, attachmentId: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({
      ...n,
      attachments: (n.attachments || []).filter(a => a.id !== attachmentId),
    })));
  }, [updateNode]);

  const insertAudioNote = useCallback((nodeId: string, duration: number, dataUrl?: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({
      ...n,
      audioNote: {
        id: generateId(),
        duration,
        dataUrl,
      },
    })));
  }, [updateNode]);

  const removeAudioNote = useCallback((nodeId: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({ ...n, audioNote: undefined })));
  }, [updateNode]);

  const insertSticker = useCallback((nodeId: string, sticker: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({ ...n, sticker })));
  }, [updateNode]);

  const removeSticker = useCallback((nodeId: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({ ...n, sticker: undefined })));
  }, [updateNode]);

  const insertIllustration = useCallback((nodeId: string, url: string, alt?: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({
      ...n,
      illustration: {
        id: generateId(),
        url,
        alt,
      },
    })));
  }, [updateNode]);

  const removeIllustration = useCallback((nodeId: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({ ...n, illustration: undefined })));
  }, [updateNode]);

  const insertEquation = useCallback((nodeId: string, equation: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({ ...n, equation })));
  }, [updateNode]);

  const removeEquation = useCallback((nodeId: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({ ...n, equation: undefined })));
  }, [updateNode]);

  const toggleCollapse = useCallback((nodeId: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({ ...n, collapsed: !n.collapsed })));
  }, [updateNode]);

  const resetMap = useCallback(() => {
    const newInitial = createInitial();
    setRoot(newInitial.root);
    setRelationships(newInitial.relationships);
    setSummaries(newInitial.summaries);
    setSelectedId(null);
    setSelectedIds(new Set());
    setEditingId(null);
    setEditingSummaryId(null);
    setLinkMode(false);
    setLinkSourceId(null);
  }, []);

  // Multi-select management
  const toggleNodeSelection = useCallback((nodeId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Summary management
  const createSummary = useCallback((topicIds: string[]) => {
    if (topicIds.length < 2) return;
    
    // Verify all topics are siblings (have the same parent)
    const parents = topicIds.map(id => findParent(root, id));
    const parentIds = new Set(parents.map(p => p?.id));
    if (parentIds.size !== 1 || !parents[0]) return;

    const parent = parents[0];
    const firstTopic = findNode(root, topicIds[0]);
    const color = firstTopic?.color || '#6366f1';

    const newSummary: Summary = {
      id: generateId(),
      topicIds,
      text: 'Summary',
      color,
    };

    setSummaries(prev => [...prev, newSummary]);
    setSelectedIds(new Set());
  }, [root, findNode, findParent]);

  const deleteSummary = useCallback((summaryId: string) => {
    setSummaries(prev => prev.filter(s => s.id !== summaryId));
    if (editingSummaryId === summaryId) {
      setEditingSummaryId(null);
    }
  }, [editingSummaryId]);

  const updateSummaryText = useCallback((summaryId: string, text: string) => {
    setSummaries(prev => prev.map(s => s.id === summaryId ? { ...s, text } : s));
  }, []);

  const getSummaryForNode = useCallback((nodeId: string): Summary | undefined => {
    return summaries.find(s => s.topicIds.includes(nodeId));
  }, [summaries]);

  // Relationship management
  const addRelationship = useCallback((sourceId: string, targetId: string, label: string = 'relates to') => {
    const exists = relationships.some(
      r => (r.sourceId === sourceId && r.targetId === targetId) ||
           (r.sourceId === targetId && r.targetId === sourceId)
    );
    if (exists || sourceId === targetId) return;

    const newRel: Relationship = {
      id: generateId(),
      sourceId,
      targetId,
      label,
      color: '#6366f1',
    };
    setRelationships(prev => [...prev, newRel]);
  }, [relationships]);

  const deleteRelationship = useCallback((relId: string) => {
    setRelationships(prev => prev.filter(r => r.id !== relId));
  }, []);

  const updateRelationshipLabel = useCallback((relId: string, label: string) => {
    setRelationships(prev => prev.map(r => r.id === relId ? { ...r, label } : r));
  }, []);

  // Link mode handlers
  const startLinkMode = useCallback(() => {
    setLinkMode(true);
    setLinkSourceId(null);
  }, []);

  const cancelLinkMode = useCallback(() => {
    setLinkMode(false);
    setLinkSourceId(null);
  }, []);

  const handleLinkNodeClick = useCallback((nodeId: string) => {
    if (!linkMode) return false;

    if (!linkSourceId) {
      setLinkSourceId(nodeId);
      return true;
    } else {
      if (nodeId !== linkSourceId) {
        addRelationship(linkSourceId, nodeId);
      }
      setLinkMode(false);
      setLinkSourceId(null);
      return true;
    }
  }, [linkMode, linkSourceId, addRelationship]);

  return {
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
    setSelectedIds,
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
    getSummaryForNode,
    addRelationship,
    deleteRelationship,
    updateRelationshipLabel,
    startLinkMode,
    cancelLinkMode,
    handleLinkNodeClick,
    toggleMarker,
    removeMarker,
    clearMarkers,
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
  };
}
