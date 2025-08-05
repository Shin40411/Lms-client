import { UniqueIdentifier } from '@dnd-kit/core';
import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  channel: (params?: string) => `/api/v1/channels${params}`,
  availableUsers: (id: string, groupId: UniqueIdentifier, query?: string) => `/api/v1/channels/${id}/available-users?groupId=${groupId}${query}`,
  studyGroup: (params?: string) => `/api/v1/study-groups${params}`,
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  conversation: {
    list: '/api/v1/conversations',
    byId: (id: string) => `/api/v1/conversations/${id}`
  },
  messages: {
    root: '/api/v1/messages',
    byId: (id: string) => `/api/v1/messages/${id}`
  },
  auth: {
    me: '/api/v1/auth/me',
    signIn: '/api/v1/auth/login',
    signUp: '/api/auth/sign-up',
    updateMe: '/api/v1/auth/update-profile',
    updatePassword: '/api/v1/auth/change-password'
  },
  classes: {
    list: '/api/v1/classrooms',
    byId: (id: string) => `/api/v1/classrooms/${id}`,
    byKey: (key: string) => `/api/v1/classrooms/?search=${key}`,
    filter: (field: string, value: any) => `/api/v1/classrooms?${field}=${value}`,
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  users: {
    list: (params?: string) => `/api/v1/users${params}`,
    byId: (id: string) => `/api/v1/users/${id}`
  },
  roles: {
    list: '/api/v1/roles'
  },
  subjects: {
    list: (params?: string) => `/api/v1/subjects${params}`,
    byId: (id: string) => `/api/v1/subjects/${id}`
  }
};
