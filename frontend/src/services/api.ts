/**
 * SmartProcure API Client Service
 * Connects frontend to the FastAPI Backend (/api/v1).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

class ApiService {
  private token: string | null = localStorage.getItem('smartprocure_token');

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('smartprocure_token', token);
    } else {
      localStorage.removeItem('smartprocure_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const json = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: json.error || { code: 'HTTP_ERROR', message: `Server returned HTTP ${response.status}` },
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

  // Auth endpoints
  public async login(phone: string, role: string) {
    return this.request<{ access_token: string; refresh_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, role }),
    });
  }

  public async getMe() {
    return this.request<any>('/auth/me');
  }

  // Centre endpoints
  public async getCentres() {
    return this.request<any[]>('/centres');
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

  // Queue Management
  public async getLiveQueue(centreId: string) {
    return this.request<any[]>(`/queue/current?centre_id=${centreId}`);
  }

  public async callNextToken(centreId: string, counterId: string) {
    return this.request<any>(`/queue/call`, {
      method: 'POST',
      body: JSON.stringify({ centre_id: centreId, counter_id: counterId }),
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

  // Analytics
  public async getAdminAnalytics() {
    return this.request<any>('/admin/analytics/procurement');
  }
}

export const api = new ApiService();
