// utils/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken, deleteToken } from './secureStorage';
import { navigationRef } from './RootNavigation.js';

const api = axios.create({
  baseURL: 'https://10.122.122.128:8000/api',
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await deleteToken();
      // navigate to login — see section 7 for the typed nav ref
      navigationRef.reset({ routes: [{ name: 'signIn' }] });
    }
    return Promise.reject(error);
  }
);

export default api;