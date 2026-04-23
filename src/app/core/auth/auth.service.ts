import { Injectable, computed, signal } from '@angular/core';
import { AuthResult, AuthSession, AuthUserRecord, RegisterPayload, UserRole } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usersKey = 'retolab.auth.users';
  private readonly sessionKey = 'retolab.auth.session';
  private readonly minPasswordLength = 6;
  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly accountPattern = /^\d{10,20}$/;

  private readonly sessionState = signal<AuthSession | null>(this.readSession());

  readonly session = computed(() => this.sessionState());

  isAuthenticated(): boolean {
    return this.sessionState() !== null;
  }

  currentRole(): UserRole | null {
    return this.sessionState()?.role ?? null;
  }

  redirectForRole(role: UserRole): string {
    return role === 'empresa' ? '/empresa' : '/estudiante';
  }

  redirectForCurrentUser(): string {
    const role = this.currentRole();
    return role ? this.redirectForRole(role) : '/';
  }

  currentUserAccountNumber(): string {
    const email = this.sessionState()?.email;

    if (!email) {
      return '';
    }

    const user = this.loadUsers().find((record) => record.email === email);
    return user?.accountNumber ?? '';
  }

  login(email: string, password: string): AuthResult {
    const normalizedEmail = this.normalizeEmail(email);
    const cleanPassword = password.trim();

    if (!normalizedEmail || !cleanPassword) {
      return {
        ok: false,
        message: 'Completa correo y contrasena para iniciar sesion.',
      };
    }

    if (!this.isValidEmail(normalizedEmail)) {
      return {
        ok: false,
        message: 'Ingresa un correo valido.',
      };
    }

    const users = this.loadUsers();
    const user = users.find(
      (record) => record.email === normalizedEmail && record.password === cleanPassword,
    );

    if (!user) {
      return {
        ok: false,
        message: 'Credenciales invalidas. Verifica tu correo y contrasena.',
      };
    }

    const session = this.activateSession(user);

    return {
      ok: true,
      message: 'Sesion iniciada correctamente.',
      session,
    };
  }

  register(payload: RegisterPayload): AuthResult {
    const normalizedEmail = this.normalizeEmail(payload.email);
    const cleanName = payload.name.trim();
    const cleanPassword = payload.password.trim();
    const cleanAccount = this.normalizeAccountNumber(payload.accountNumber);

    if (!cleanName || !normalizedEmail || !cleanPassword) {
      return {
        ok: false,
        message: 'Completa todos los campos para crear tu cuenta.',
      };
    }

    if (!this.isRoleValue(payload.role)) {
      return {
        ok: false,
        message: 'Selecciona si te registras como estudiante o empresa.',
      };
    }

    if (!this.isValidEmail(normalizedEmail)) {
      return {
        ok: false,
        message: 'Ingresa un correo valido.',
      };
    }

    if (cleanPassword.length < this.minPasswordLength) {
      return {
        ok: false,
        message: 'La contrasena debe tener al menos 6 caracteres.',
      };
    }

    if (!this.isValidAccountNumber(cleanAccount)) {
      return {
        ok: false,
        message: 'Ingresa un numero de cuenta valido (10 a 20 digitos).',
      };
    }

    const users = this.loadUsers();
    const exists = users.some((record) => record.email === normalizedEmail);

    if (exists) {
      return {
        ok: false,
        message: 'Ya existe una cuenta con ese correo.',
      };
    }

    const newUser: AuthUserRecord = {
      name: cleanName,
      email: normalizedEmail,
      password: cleanPassword,
      role: payload.role,
      accountNumber: payload.role === 'estudiante' ? cleanAccount : undefined,
    };

    this.saveUsers([...users, newUser]);
    const session = this.activateSession(newUser);

    return {
      ok: true,
      message: 'Cuenta creada correctamente.',
      session,
    };
  }

  logout(): void {
    this.sessionState.set(null);
    this.writeJson(this.sessionKey, null);
  }

  private activateSession(user: AuthUserRecord): AuthSession {
    const session: AuthSession = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    this.sessionState.set(session);
    this.writeJson(this.sessionKey, session);

    return session;
  }

  private loadUsers(): AuthUserRecord[] {
    const records = this.readJson<unknown>(this.usersKey, []);

    if (!Array.isArray(records)) {
      return [];
    }

    return records
      .filter((record): record is AuthUserRecord => this.isUserRecord(record))
      .map((record) => ({
        name: record.name.trim(),
        email: this.normalizeEmail(record.email),
        password: String(record.password),
        role: record.role,
        accountNumber: this.normalizeAccountNumber(record.accountNumber),
      }));
  }

  private saveUsers(users: AuthUserRecord[]): void {
    this.writeJson(this.usersKey, users);
  }

  private readSession(): AuthSession | null {
    const session = this.readJson<AuthSession | null>(this.sessionKey, null);

    if (!session) {
      return null;
    }

    const cleanName = typeof session.name === 'string' ? session.name.trim() : '';
    const normalizedEmail = typeof session.email === 'string' ? this.normalizeEmail(session.email) : '';

    if (!cleanName || !normalizedEmail || !this.isValidEmail(normalizedEmail) || !this.isRoleValue(session.role)) {
      return null;
    }

    return {
      name: cleanName,
      email: normalizedEmail,
      role: session.role,
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private isValidEmail(email: string): boolean {
    return this.emailPattern.test(email);
  }

  private normalizeAccountNumber(accountNumber: string | undefined): string {
    if (!accountNumber) {
      return '';
    }

    return accountNumber.replace(/\s+/g, '').trim();
  }

  private isValidAccountNumber(accountNumber: string): boolean {
    return this.accountPattern.test(accountNumber);
  }

  private isRoleValue(role: string): role is UserRole {
    return role === 'estudiante' || role === 'empresa';
  }

  private isUserRecord(value: unknown): value is AuthUserRecord {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const record = value as Partial<AuthUserRecord>;

    return (
      typeof record.name === 'string' &&
      record.name.trim().length > 0 &&
      typeof record.email === 'string' &&
      this.isValidEmail(this.normalizeEmail(record.email)) &&
      typeof record.password === 'string' &&
      record.password.length > 0 &&
      typeof record.role === 'string' &&
      this.isRoleValue(record.role) &&
      (typeof record.accountNumber === 'undefined' ||
        this.isValidAccountNumber(this.normalizeAccountNumber(record.accountNumber)))
    );
  }

  private readJson<T>(key: string, fallback: T): T {
    const storage = this.getStorage();

    if (!storage) {
      return fallback;
    }

    try {
      const raw = storage.getItem(key);
      if (!raw) {
        return fallback;
      }

      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private writeJson(key: string, value: unknown): void {
    const storage = this.getStorage();

    if (!storage) {
      return;
    }

    try {
      if (value === null) {
        storage.removeItem(key);
        return;
      }

      storage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage write errors to keep app usable.
    }
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage;
  }
}
