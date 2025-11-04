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
