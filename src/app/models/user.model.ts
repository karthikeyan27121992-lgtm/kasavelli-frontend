export interface User {
  id: number;
  phone_number: string;
  name: string;
  email?: string;
  role: 'user' | 'admin';
  date_joined: string;
  spin_discount_pct: number;
  spin_discount_expires_at: string | null;
}

export interface LoginRequest {
  phone_number: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterRequest {
  phone_number: string;
  name: string;
  email?: string;
  password: string;
}

// Made with Bob
