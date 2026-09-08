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
  summaries?: Summary[];
  markers?: string[]; // Array of marker IDs
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  color?: string;
}

export interface Summary {
  id: string;
  topicIds: string[]; // IDs of the nodes being summarized
  text: string;
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
