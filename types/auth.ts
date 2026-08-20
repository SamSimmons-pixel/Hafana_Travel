// types/auth.ts
export interface GroupInfo {
  id: number;
  nama_group: string;
  keterangan?: string | null;
}

export interface User {
  id: number;
  name: string;
  nomor_visa: string;
  tanggal_lahir: string;
  nomor_paspor?: string | null;
  no_hp?: string | null;
  group_id?: number | null;
  group?: GroupInfo | null;
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