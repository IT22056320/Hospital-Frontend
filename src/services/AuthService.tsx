import axios from 'axios';

interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    username: string;
    email: string;
  };
}

class AuthService {
  // Register a new user
  static async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('http://localhost:3000/api/v1/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  }

  // Login the user and store the token
  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('http://localhost:3000/api/v1/auth/login', {
      email,
      password,
    });
    const { token } = response.data;
    if (token) {
      this.setToken(token); // Store token in localStorage
    }
    return response.data;
  }

  // Get user profile using the stored token
  static async getProfile(): Promise<AuthResponse> {
    const token = this.getToken();
    if (!token) throw new Error('No token found, please login.');

    const response = await axios.get<AuthResponse>('http://localhost:3000/api/v1/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  // Logout by removing the token
  static logout(): void {
    localStorage.removeItem('token');
  }

  // Check if the user is authenticated by verifying the existence of a token
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Set the token in localStorage
  private static setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Get the token from localStorage
  private static getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check token validity (optional, if you want to check expiration server-side)
  static async isTokenValid(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await axios.post('http://localhost:3000/api/v1/auth/verify-token', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.isValid;
    } catch (error) {
      return false;
    }
  }

  // Refresh token functionality (if the backend supports token refresh)
  static async refreshToken(): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error('No token to refresh');

    const response = await axios.post<AuthResponse>('http://localhost:3000/api/v1/auth/refresh-token', null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.token) {
      this.setToken(response.data.token);
    }
  }
}

export default AuthService;
