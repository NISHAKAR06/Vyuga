/**
 * SmartProcure API Client Service
 * Connects frontend to the FastAPI Backend (/api/v1).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  message?: string;
}

export type RoleMapping = 'farmer' | 'officer' | 'admin' | 'FARMER' | 'PROCURER' | 'ADMIN';

class ApiService {
  private token: string | null = localStorage.getItem('smartprocure_token');
  private baseUrl: string = API_BASE_URL;

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('smartprocure_token', token);
    } else {
      localStorage.removeItem('smartprocure_token');
    }
  }

  public getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('smartprocure_token');
    }
    return this.token;
  }

  private mapRoleToBackend(role: string): string {
    const normalized = role.toLowerCase();
    if (normalized === 'farmer') return 'FARMER';
    if (normalized === 'officer' || normalized === 'procurer') return 'PROCURER';
    if (normalized === 'admin') return 'ADMIN';
    return 'FARMER';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const json = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: json.error || { code: 'HTTP_ERROR', message: json.detail || `Server returned HTTP ${response.status}` },
        };
      }
      return json;
    } catch (err: any) {
      // API Offline / Network failure fallback notice
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: err.message || 'Backend unreachable. Operating in local mode.',
        },
      };
    }
  }

  // Health check
  public async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch('/api/v1/openapi.json', { method: 'GET' });
      return response.ok;
    } catch {
      try {
        const fallback = await fetch('http://localhost:8000/api/v1/openapi.json', { method: 'GET' });
        if (fallback.ok) {
          this.baseUrl = 'http://localhost:8000/api/v1';
          return true;
        }
      } catch {
        // unreachable
      }
      return false;
    }
  }

  // Auth endpoints
  public async login(phone: string, role: RoleMapping) {
    const backendRole = this.mapRoleToBackend(role);
    const res = await this.request<{ access_token: string; refresh_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone: phone || '+91 98421 76540', role: backendRole }),
    });

    if (res.success && res.data?.access_token) {
      this.setToken(res.data.access_token);
    }
    return res;
  }

  public async getMe() {
    return this.request<any>('/auth/me');
  }

  // Centre endpoints
  public async getCentres() {
    return this.request<any[]>('/centres');
  }

  public async getCentre(centreId: string) {
    return this.request<any>(`/centres/${centreId}`);
  }

  // Procurement & Slots
  public async getSlots(centreId: string, date?: string) {
    const query = date ? `?date=${date}` : '';
    return this.request<any[]>(`/centres/${centreId}/slots${query}`);
  }

  public async createBooking(payload: { centre_id: string; slot_id: string; crop: string; quantity_kg: number }) {
    return this.request<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getMyBookings() {
    return this.request<any[]>('/bookings/my');
  }

  public async getBooking(bookingId: string) {
    return this.request<any>(`/bookings/${bookingId}`);
  }

  public async cancelBooking(bookingId: string) {
    return this.request<any>(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
    });
  }

  // Queue Management
  public async getLiveQueue(centreId: string = 'cnt-a') {
    return this.request<any[]>(`/queue/current?centre_id=${centreId}`);
  }

  public async callNextToken(bookingId: string) {
    return this.request<any>(`/queue/${bookingId}/call`, {
      method: 'POST',
    });
  }

  // Quality & Weighment
  public async recordQuality(bookingId: string, payload: { grade: string; moisture_percentage: number; remarks?: string }) {
    return this.request<any>(`/quality/${bookingId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async recordWeighment(bookingId: string, payload: { gross_weight_kg: number; tare_weight_kg: number }) {
    return this.request<any>(`/weighments/${bookingId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Payments
  public async getMyPayments() {
    return this.request<any[]>('/payments/my');
  }

  public async getPayment(paymentId: string) {
    return this.request<any>(`/payments/${paymentId}`);
  }

  // Analytics
  public async getAdminAnalytics() {
    return this.request<any>('/admin/analytics/procurement');
  }

  // WebSocket connection helper
  public createWebSocket(type: 'farmer' | 'centre', id: string): WebSocket | null {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws/${type}/${id}`;
      return new WebSocket(wsUrl);
    } catch {
      return null;
    }
  }
}

export const api = new ApiService();
