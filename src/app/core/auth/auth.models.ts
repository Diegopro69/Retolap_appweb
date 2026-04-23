export type UserRole = 'estudiante' | 'empresa';

export interface AuthUserRecord {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  accountNumber?: string;
}

export interface AuthSession {
  name: string;
  email: string;
  role: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  accountNumber?: string;
}

export interface AuthResult {
  ok: boolean;
  message: string;
  session?: AuthSession;
}
