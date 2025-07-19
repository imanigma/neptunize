// API service for frontend-backend communication
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://neptunize-production.up.railway.app';

export interface ChatMessage {
  content: string;
}

export interface ChatResponse {
  content: string;
  options?: string[];
  suggested_topic?: string;
  suggested_type?: string;
}

export interface PodcastRequest {
  original_topic: string;
  podcast_type: string;
  target_duration: number;
  target_audience: string;
}

export interface PodcastResponse {
  id: number;
  status: string;
  original_topic: string;
  enhanced_script?: string;
  audio_file_url: string;
  created_at: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
}

class ApiService {
  private authToken: string | null = null;

  constructor() {
    // Load token from localStorage if available
    this.authToken = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: AuthCredentials): Promise<{ access_token: string }> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await this.request<{ access_token: string }>('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    this.authToken = response.access_token;
    localStorage.setItem('auth_token', this.authToken);
    return response;
  }

  async register(userData: AuthCredentials & { email: string }): Promise<User> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  logout(): void {
    this.authToken = null;
    localStorage.removeItem('auth_token');
  }

  // Chat methods
  async sendChatMessage(message: ChatMessage): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  // Podcast methods
  async createPodcast(podcastData: PodcastRequest): Promise<PodcastResponse> {
    return this.request<PodcastResponse>('/podcasts', {
      method: 'POST',
      body: JSON.stringify(podcastData),
    });
  }

  async getPodcast(podcastId: number): Promise<PodcastResponse> {
    return this.request<PodcastResponse>(`/podcasts/${podcastId}`);
  }

  async listPodcasts(): Promise<PodcastResponse[]> {
    return this.request<PodcastResponse[]>('/podcasts');
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.authToken;
  }
}

export const apiService = new ApiService();
