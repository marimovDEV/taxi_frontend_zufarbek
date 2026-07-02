/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Django REST backend bilan ishlash uchun yengil fetch wrapper.
// Token-based autentifikatsiya: login qilingandan keyin token localStorage'da
// saqlanadi va har bir so'rovda Authorization headerda yuboriladi.
// Bu cross-origin (turli domen) muammolarini hal qiladi.

export const API_BASE: string =
  (import.meta as any).env?.VITE_API_BASE_URL || 'https://taxi.ardentsoft.uz/api';

const TOKEN_KEY = 'auth_token';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  // Token mavjud bo'lsa Authorization headerga qo'shamiz
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    method,
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    throw new ApiError(res.status, 'Avtorizatsiyadan o\'tilmagan');
  }

  if (!res.ok) {
    let detail = `So'rov muvaffaqiyatsiz tugadi (${res.status})`;
    try {
      const body = await res.json();
      detail = body.detail || JSON.stringify(body);
    } catch {
      /* javob json emas */
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// --- Auth ---
export async function login(username: string, password: string): Promise<{ username: string; is_staff: boolean }> {
  const data = await apiFetch<{ username: string; is_staff: boolean; token: string }>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  // Backend'dan kelgan tokenni saqlaymiz
  if (data.token) {
    setToken(data.token);
  }
  return { username: data.username, is_staff: data.is_staff };
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/auth/logout/', { method: 'POST' });
  } catch {
    /* xatolik bo'lsa ham tokenni tozalaymiz */
  }
  clearToken();
}

export async function fetchMe(): Promise<{ username: string; is_staff: boolean }> {
  return apiFetch('/auth/me/');
}

// --- Resurslar (paginatsiyasiz DRF javobi: massiv yoki {results: [...]}) ---
function unwrapList<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

export async function fetchUsers(): Promise<any[]> {
  return unwrapList(await apiFetch('/users/'));
}

export async function fetchTrips(): Promise<any[]> {
  return unwrapList(await apiFetch('/trips/'));
}

export async function fetchOrders(): Promise<any[]> {
  return unwrapList(await apiFetch('/orders/'));
}

export async function fetchBroadcasts(): Promise<any[]> {
  return unwrapList(await apiFetch('/broadcasts/'));
}

export async function fetchBlacklist(): Promise<any[]> {
  return unwrapList(await apiFetch('/blacklist/'));
}

export async function fetchBotSettings(): Promise<any[]> {
  return unwrapList(await apiFetch('/settings/'));
}

export async function fetchStats(): Promise<any> {
  return apiFetch('/stats/');
}

export async function fetchDailyStats(): Promise<any[]> {
  return apiFetch('/stats/daily/');
}

export async function fetchTopRoutes(): Promise<any[]> {
  return apiFetch('/stats/routes/');
}

export async function fetchTopDrivers(): Promise<any[]> {
  return apiFetch('/stats/drivers/');
}

// --- Yozish amallari ---
export async function patchUser(telegramId: string | number, data: Record<string, any>): Promise<any> {
  return apiFetch(`/users/${telegramId}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function patchTrip(tripId: string | number, data: Record<string, any>): Promise<any> {
  return apiFetch(`/trips/${tripId}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function patchOrder(orderId: string | number, data: Record<string, any>): Promise<any> {
  return apiFetch(`/orders/${orderId}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function createBlacklistEntry(data: Record<string, any>): Promise<any> {
  return apiFetch('/blacklist/', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteBlacklistEntry(id: string | number): Promise<void> {
  await apiFetch(`/blacklist/${id}/`, { method: 'DELETE' });
}

export async function createBroadcast(data: Record<string, any>): Promise<any> {
  return apiFetch('/broadcasts/', { method: 'POST', body: JSON.stringify(data) });
}

export async function sendBroadcast(id: string | number): Promise<any> {
  return apiFetch(`/broadcasts/${id}/send/`, { method: 'POST' });
}

export async function upsertBotSetting(key: string, value: string, description?: string): Promise<any> {
  // BotSetting PK = key, shu sababli mavjud bo'lsa PUT, bo'lmasa POST.
  try {
    return await apiFetch(`/settings/${key}/`, {
      method: 'PUT',
      body: JSON.stringify({ key, value, description: description || '' }),
    });
  } catch (e) {
    return apiFetch('/settings/', {
      method: 'POST',
      body: JSON.stringify({ key, value, description: description || '' }),
    });
  }
}
