import axios, { isAxiosError, type AxiosInstance } from "axios";
import { Task, TaskFormData, UpdateTaskStatus } from "../../../../interfaces";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "") + "/api";

export const nextServer: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export async function getTasks(search?: string, status?: string, sorting?: string): Promise<Task[]> {
  try {
    const { data } = await nextServer.get<Task[]>(`/tasks`, {
      params: { search: search, status: status, sorting: sorting },
    });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.error || "Failed to fetch tasks");
    }
    throw new Error("Network error occurred");
  }
}

export async function createTask(newTask: TaskFormData): Promise<Task> {
  const { data } = await nextServer.post<Task>(`/tasks`, newTask);
  return data;
}
export async function updateTaskStatus({
  id,
  isDone,
}: UpdateTaskStatus): Promise<Task> {
  const { data } = await nextServer.patch<Task>(`/tasks/${id}`, { isDone });
  return data;
}

export async function deleteTask(id: string): Promise<Task> {
  const { data } = await nextServer.delete<Task>(`/tasks/${id}`);
  return data;
}
