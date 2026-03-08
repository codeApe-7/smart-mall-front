import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@shared/types/common';

export interface ClientOptions {
  baseURL: string;
  tokenKey?: string;
  tokenHeader?: string;
}

export function createHttpClient({ baseURL, tokenKey, tokenHeader = 'adminToken' }: ClientOptions): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 20000
  });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (tokenKey && typeof window !== 'undefined') {
      const token = window.localStorage.getItem(tokenKey)?.replace(/^"|"$/g, '');
      if (token) {
        config.headers = config.headers ?? {};
        config.headers[tokenHeader] = token;
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      const payload = response.data as ApiResponse<unknown>;
      if (payload.code !== 200) {
        return Promise.reject(new Error(payload.info || payload.msg || '请求失败'));
      }
      response.data = payload.data;
      return response;
    },
    (error) => Promise.reject(error),
  );

  return instance;
}

export async function requestWithParams<T>(client: AxiosInstance, config: AxiosRequestConfig) {
  return client.request<never, T>(config);
}
