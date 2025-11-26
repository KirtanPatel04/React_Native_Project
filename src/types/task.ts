export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  createdAt: number;
}
