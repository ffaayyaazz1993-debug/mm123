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
  
  // Insert features
  note?: string;
  label?: string;
  task?: TaskData;
  links?: LinkData[];
  attachments?: AttachmentData[];
  audioNote?: AudioNoteData;
  sticker?: string;
  illustration?: IllustrationData;
  equation?: string;
}

export interface TaskData {
  completed: boolean;
  dueDate?: string;
  assignee?: string;
}

export interface LinkData {
  id: string;
  type: 'webpage' | 'topic' | 'file' | 'folder';
  url: string;
  title?: string;
  topicId?: string; // For internal topic links
}

export interface AttachmentData {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl?: string; // Base64 for demo purposes
}

export interface AudioNoteData {
  id: string;
  duration: number; // seconds
  dataUrl?: string; // Base64 for demo purposes
  transcript?: string;
}

export interface IllustrationData {
  id: string;
  url: string;
  alt?: string;
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
