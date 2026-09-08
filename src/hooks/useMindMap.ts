import { useState, useCallback } from 'react';
import { MindNode } from '../types';

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
    children: [
      {
        id: generateId(),
        text: '📋 Planning',
        color: '#E74C3C',
        children: [
          { id: generateId(), text: 'Set Goals', color: '#E74C3C', children: [] },
          { id: generateId(), text: 'Define Scope', color: '#E74C3C', children: [] },
          { id: generateId(), text: 'Timeline', color: '#E74C3C', children: [] },
        ],
      },
      {
        id: generateId(),
        text: '💡 Ideas',
        color: '#2ECC71',
        children: [
          { id: generateId(), text: 'Brainstorm', color: '#2ECC71', children: [] },
          { id: generateId(), text: 'Research', color: '#2ECC71', children: [] },
          { id: generateId(), text: 'Innovation', color: '#2ECC71', children: [] },
        ],
      },
      {
        id: generateId(),
        text: '🎯 Tasks',
        color: '#F39C12',
        children: [
          { id: generateId(), text: 'Priority High', color: '#F39C12', children: [] },
          { id: generateId(), text: 'Priority Medium', color: '#F39C12', children: [] },
          { id: generateId(), text: 'Priority Low', color: '#F39C12', children: [] },
        ],
      },
      {
        id: generateId(),
        text: '📚 Resources',
        color: '#9B59B6',
        children: [
          { id: generateId(), text: 'Team Members', color: '#9B59B6', children: [] },
          { id: generateId(), text: 'Tools & Software', color: '#9B59B6', children: [] },
        ],
      },
      {
        id: generateId(),
        text: '📊 Progress',
        color: '#1ABC9C',
        children: [
          { id: generateId(), text: 'Milestones', color: '#1ABC9C', children: [] },
          { id: generateId(), text: 'KPIs', color: '#1ABC9C', children: [] },
          { id: generateId(), text: 'Reviews', color: '#1ABC9C', children: [] },
        ],
      },
      {
        id: generateId(),
        text: '⚡ Actions',
        color: '#E91E63',
        children: [
          { id: generateId(), text: 'Next Steps', color: '#E91E63', children: [] },
          { id: generateId(), text: 'Follow Up', color: '#E91E63', children: [] },
        ],
      },
    ],
  };
}

export function useMindMap() {
  const [root, setRoot] = useState<MindNode>(createDefaultMap);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const findNode = useCallback((node: MindNode, id: string): MindNode | null => {
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  }, []);

  const findParent = useCallback((node: MindNode, id: string): MindNode | null => {
    for (const child of node.children) {
      if (child.id === id) return node;
      const found = findParent(child, id);
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

  const addChild = useCallback((parentId: string) => {
    setRoot(prev => {
      const parent = findNode(prev, parentId);
      if (!parent) return prev;
      
      const colorIndex = parent.children.length % BRANCH_COLORS.length;
      // If parent is root (no parent of its own), use branch colors
      const isRoot = !findParent(prev, parent.id);
      const newColor = isRoot ? BRANCH_COLORS[colorIndex] : parent.color;
      
      const newNode: MindNode = {
        id: generateId(),
        text: 'New Topic',
        color: newColor || BRANCH_COLORS[colorIndex],
        children: [],
      };

      return updateNode(prev, parentId, n => ({
        ...n,
        children: [...n.children, newNode],
        collapsed: false,
      }));
    });
  }, [findNode, updateNode]);

  const addSibling = useCallback((nodeId: string) => {
    setRoot(prev => {
      const parent = findParent(prev, nodeId);
      if (!parent) return prev;
      
      const node = findNode(prev, nodeId);
      if (!node) return prev;

      const newNode: MindNode = {
        id: generateId(),
        text: 'New Topic',
        color: node.color,
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
      const parent = findParent(prev, nodeId);
      if (!parent) return prev; // Can't delete root
      
      return updateNode(prev, parent.id, n => ({
        ...n,
        children: n.children.filter(c => c.id !== nodeId),
      }));
    });
    setSelectedId(null);
  }, [findParent, updateNode]);

  const updateText = useCallback((nodeId: string, text: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({ ...n, text })));
  }, [updateNode]);

  const toggleCollapse = useCallback((nodeId: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({ ...n, collapsed: !n.collapsed })));
  }, [updateNode]);

  const resetMap = useCallback(() => {
    setRoot(createDefaultMap());
    setSelectedId(null);
    setEditingId(null);
  }, []);

  return {
    root,
    selectedId,
    editingId,
    setSelectedId,
    setEditingId,
    addChild,
    addSibling,
    deleteNode,
    updateText,
    toggleCollapse,
    resetMap,
    findNode,
  };
}
