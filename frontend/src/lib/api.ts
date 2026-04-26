const BASE_URL = '/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    login: (credentials: any) => request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    signup: (userData: any) => request<any>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    refresh: () => request<{ accessToken: string }>('/auth/refresh', { method: 'POST' }),
    logout: () => request('/auth/logout', { method: 'POST' }),
  },

  // Stories
  stories: {
    getAll: (page = 1, limit = 10, author?: string, search?: string, sort?: string) => {
      let url = `/stories?page=${page}&limit=${limit}`;
      if (author) url += `&author=${author}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (sort) url += `&sort=${sort}`;
      return request<{ stories: any[], total: number }>(url);
    },
    getById: (id: string) => request<any>(`/stories/${id}`),
    create: (storyData: any) => request('/stories', {
      method: 'POST',
      body: JSON.stringify(storyData),
    }),
    update: (id: string, storyData: any) => request(`/stories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(storyData),
    }),
  },

  // Checkout
  checkout: {
    createOrder: () => request<{ orderId: string, amount: number, currency: string, keyId: string }>('/checkout', { method: 'POST' }),
    verify: (paymentData: any) => request('/checkout/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),
  }
};
