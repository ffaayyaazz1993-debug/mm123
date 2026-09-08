import { useState, useCallback } from 'react';
import { MindNode, Relationship } from '../types';

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

function createDefaultRelationships(root: MindNode): Relationship[] {
  // Create some demo relationships between nodes
  const rels: Relationship[] = [];
  
  // Connect "Set Goals" to "Milestones" (Planning -> Progress)
  if (root.children[0]?.children[0] && root.children[4]?.children[0]) {
    rels.push({
      id: generateId(),
      sourceId: root.children[0].children[0].id,
      targetId: root.children[4].children[0].id,
      label: 'tracks',
      color: '#6366f1',
    });
  }
  
  // Connect "Brainstorm" to "Innovation" (Ideas internal)
  if (root.children[1]?.children[0] && root.children[1]?.children[2]) {
    rels.push({
      id: generateId(),
      sourceId: root.children[1].children[0].id,
      targetId: root.children[1].children[2].id,
      label: 'leads to',
      color: '#2ECC71',
    });
  }
  
  // Connect "Next Steps" to "Priority High" (Actions -> Tasks)
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

function createInitial() {
  const root = createDefaultMap();
  const relationships = createDefaultRelationships(root);
  return { root, relationships };
}

export function useMindMap() {
  const [initial] = useState(createInitial);
  const [root, setRoot] = useState<MindNode>(initial.root);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [relationships, setRelationships] = useState<Relationship[]>(initial.relationships);
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
      const findParent = (node: MindNode, targetId: string): MindNode | null => {
        for (const child of node.children) {
          if (child.id === targetId) return node;
          const found = findParent(child, targetId);
          if (found) return found;
        }
        return null;
      };

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
  }, [findNode, updateNode]);

  const deleteNode = useCallback((nodeId: string) => {
    setRoot(prev => {
      if (prev.id === nodeId) return prev;
      return deleteNodeFromTree(prev, nodeId);
    });
    // Also remove any relationships involving this node
    setRelationships(prev => prev.filter(r => r.sourceId !== nodeId && r.targetId !== nodeId));
    setSelectedId(null);
  }, [deleteNodeFromTree]);

  const updateText = useCallback((nodeId: string, text: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({ ...n, text })));
  }, [updateNode]);

  const toggleCollapse = useCallback((nodeId: string) => {
    setRoot(prev => updateNode(prev, nodeId, n => ({ ...n, collapsed: !n.collapsed })));
  }, [updateNode]);

  const resetMap = useCallback(() => {
    const newInitial = createInitial();
    setRoot(newInitial.root);
    setRelationships(newInitial.relationships);
    setSelectedId(null);
    setEditingId(null);
    setLinkMode(false);
    setLinkSourceId(null);
  }, []);

  // Relationship management
  const addRelationship = useCallback((sourceId: string, targetId: string, label: string = 'relates to') => {
    // Don't add duplicate relationships
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
      // First click - set source
      setLinkSourceId(nodeId);
      return true;
    } else {
      // Second click - create relationship
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
    editingId,
    relationships,
    linkMode,
    linkSourceId,
    setSelectedId,
    setEditingId,
    addChild,
    addSibling,
    deleteNode,
    updateText,
    toggleCollapse,
    resetMap,
    addRelationship,
    deleteRelationship,
    updateRelationshipLabel,
    startLinkMode,
    cancelLinkMode,
    handleLinkNodeClick,
  };
}
