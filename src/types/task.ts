export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  createdAt: number;
  /** timestamp in ms for a scheduled reminder */
  reminderAt?: number;
  /** notification identifier so it can be cancelled */
  notificationId?: string;
}
