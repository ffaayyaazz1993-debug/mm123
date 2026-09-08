export interface MindNode {
  id: string;
  text: string;
  children: MindNode[];
  color?: string;
  collapsed?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  color?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface ViewState {
  offsetX: number;
  offsetY: number;
  scale: number;
}
