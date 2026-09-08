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

export interface Position {
  x: number;
  y: number;
}

export interface ViewState {
  offsetX: number;
  offsetY: number;
  scale: number;
}
