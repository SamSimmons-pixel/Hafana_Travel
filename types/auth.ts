// types/auth.ts
export interface User {
  id: number;
  name: string;
  nomor_visa: string;
  tanggal_lahir: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  nomor_visa: string;
  tanggal_lahir: string;
}

export interface RegisterPayload {
  name: string;
  nomor_visa: string;
  tanggal_lahir: string;
  tanggal_lahir_confirmation: string;
}