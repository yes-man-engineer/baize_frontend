// API client for Baize backend
const API_BASE = import.meta.env.VITE_API_BASE || '';

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  if (data.code !== 0) throw new Error(data.message || 'API error');
  return data.data as T;
}

export interface IdeaItem {
  id: number;
  title: string;
  category: string;
  description: string;
  author: string;
  startup_cost: number;
  likes: number;
  comments: number;
  status: string;
  image?: string;
  created_at: string;
}

export interface FailureItem {
  id: number;
  title: string;
  company_name: string;
  category: string;
  story: string;
  lesson: string;
  startup_cost: number;
  money_burned: string;
  team_size: number;
  lifespan: number;
  likes: number;
  comments: number;
  status: string;
  created_at: string;
}

export interface OngoingItem {
  id: number;
  title: string;
  category: string;
  description: string;
  struggle: string;
  status: string;
  months: number;
  burn: string;
  team_size: number;
  votes: number;
  comments: number;
  created_at: string;
}

export interface PostItem {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  votes_up: number;
  votes_down: number;
  comments: number;
  created_at: string;
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  page_size: number;
}

export const apiClient = {
  ideas: (params?: string) => api<PageData<IdeaItem>>(`/api/v1/ideas${params || ''}`),
  failures: (params?: string) => api<PageData<FailureItem>>(`/api/v1/failures${params || ''}`),
  ongoing: (params?: string) => api<PageData<OngoingItem>>(`/api/v1/ongoing${params || ''}`),
  posts: (params?: string) => api<PageData<PostItem>>(`/api/v1/posts${params || ''}`),
};
