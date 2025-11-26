export interface Project {
  id: number;
  name: string;
  createdAt: string;
}

export interface Board {
  id: number;
  projectId: number;
  name: string;
  order: number;
}

export interface Column {
  id: number;
  boardId: number;
  name: string;
  order: number;
  wipLimit?: number | null;
}

export interface Card {
  id: number;
  boardId: number;
  columnId: number;
  title: string;
  description?: string;
  assigneeId?: number | null;
  priority?: 'low' | 'medium' | 'high';
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}
