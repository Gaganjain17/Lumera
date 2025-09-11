export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  password?: string; // Optional for OTP-only users
  role: 'admin' | 'user';
  createdAt: number;
  updatedAt: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'lumera_auth_v1';
const USERS_STORAGE_KEY = 'lumera_users_v1';
const OTP_STORAGE_KEY = 'lumera_otps_v1';

// Default admin user
export const defaultUsers: User[] = [
  { 
    id: 'admin-1', 
    fullName: 'Admin User', 
    email: 'admin@lumera.com', 
    mobile: '+919999999999',
    password: 'admin123', 
    role: 'admin', 
    createdAt: Date.now(), 
    updatedAt: Date.now() 
  }
];

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function getUsers(): User[] {
  if (!isBrowser()) return defaultUsers;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return defaultUsers;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultUsers;
  } catch {
    return defaultUsers;
  }
}

export function saveUsers(users: User[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

export function getAuthState(): AuthState {
  if (!isBrowser()) return { user: null, token: null, isAuthenticated: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null, isAuthenticated: false };
    const parsed = JSON.parse(raw);
    return parsed as AuthState;
  } catch {
    return { user: null, token: null, isAuthenticated: false };
  }
}

export function setAuthState(authState: AuthState): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
  } catch {
    // ignore
  }
}

export function clearAuthState(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateMobile(mobile: string): boolean {
  const mobileRegex = /^(\+91|91)?[6-9]\d{9}$/;
  return mobileRegex.test(mobile.replace(/\s/g, ''));
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function saveOTP(mobile: string, otp: string): void {
  if (!isBrowser()) return;
  try {
    const otps = getOTPs();
    otps[mobile] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 minutes
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otps));
  } catch {
    // ignore
  }
}

export function getOTPs(): Record<string, { otp: string; expiresAt: number }> {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(OTP_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function verifyOTP(mobile: string, otp: string): boolean {
  const otps = getOTPs();
  const stored = otps[mobile];
  if (!stored || stored.expiresAt < Date.now()) {
    return false;
  }
  return stored.otp === otp;
}

export function clearOTP(mobile: string): void {
  if (!isBrowser()) return;
  try {
    const otps = getOTPs();
    delete otps[mobile];
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otps));
  } catch {
    // ignore
  }
}

export function findUserByEmail(email: string): User | null {
  const users = getUsers();
  return users.find(u => u.email === email) || null;
}

export function findUserByMobile(mobile: string): User | null {
  const users = getUsers();
  return users.find(u => u.mobile === mobile) || null;
}

export function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
  const users = getUsers();
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  return newUser;
}




