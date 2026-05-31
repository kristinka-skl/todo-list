import axios, { type AxiosInstance } from 'axios';
import { Task, TaskFormData, UpdateTaskStatus } from '../../../../interfaces';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '') + '/api';

export const nextServer: AxiosInstance = axios.create({
  baseURL: BASE_URL,  
});


export async function getTasks(): Promise<Task[]> {
  const { data } = await nextServer.get<Task[]>(`/tasks`);
  return data;
}

export async function createTask(newTask: TaskFormData): Promise<Task> {
  const { data } = await nextServer.post<Task>(
    `/tasks`,
    newTask
  );
  return data;
}
export async function updateTaskStatus({
  id,
  isDone,
}: UpdateTaskStatus): Promise<Task> {
  const { data } = await nextServer.patch<Task>(
    `/tasks/${id}`,
    { isDone }
  );
  return data;
}

export async function deleteTask(
  id: string,  
): Promise<Task> {
  const { data } = await nextServer.delete<Task>(
    `/tasks/${id}`,
    
  );
  return data;
}
