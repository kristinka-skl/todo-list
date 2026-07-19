export interface Task {
  _id: string;
  name: string;
  priority: number,
  date: string;
  isDone: boolean;
}

export interface TaskFormData {
  name: string;
  priority: number,
  date: string;
}
export interface UpdateTaskStatus {
  id: string;
  isDone: boolean;
}
