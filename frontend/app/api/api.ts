import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

const baseURL = (process.env.BACKEND_API_URL || 'http://localhost:3000') + '/api';

export const api = axios.create({
  baseURL,
});
