import { createHash } from 'crypto';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  createdAt: Date;
  lastLogin?: Date;
}

// In a real application, this would be stored in a database
// For demo purposes, we'll store it in memory (will reset on server restart)
let adminUsers: AdminUser[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@lumera.com',
    role: 'super_admin',
    createdAt: new Date('2024-01-01'),
  }
];

// Store hashed passwords (in real app, this would be in a secure database)
let adminPasswords: Record<string, string> = {
  'admin': hashPassword('admin123') // Default password: admin123
};

export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

export function createAdminUser(userData: Omit<AdminUser, 'id' | 'createdAt'>, password: string): AdminUser {
  const newUser: AdminUser = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date(),
  };
  
  adminUsers.push(newUser);
  adminPasswords[newUser.username] = hashPassword(password);
  
  return newUser;
}

export function authenticateAdmin(username: string, password: string): AdminUser | null {
  const user = adminUsers.find(u => u.username === username);
  if (!user) return null;
  
  const hashedPassword = adminPasswords[username];
  if (!hashedPassword || !verifyPassword(password, hashedPassword)) {
    return null;
  }
  
  // Update last login
  user.lastLogin = new Date();
  
  return user;
}

export function getAdminUser(username: string): AdminUser | null {
  return adminUsers.find(u => u.username === username) || null;
}

export function changeAdminPassword(username: string, newPassword: string): boolean {
  if (!adminPasswords[username]) return false;
  
  adminPasswords[username] = hashPassword(newPassword);
  return true;
}

export function getAllAdminUsers(): AdminUser[] {
  return adminUsers.map(user => ({ ...user }));
}

export function deleteAdminUser(username: string): boolean {
  const userIndex = adminUsers.findIndex(u => u.username === username);
  if (userIndex === -1) return false;
  
  adminUsers.splice(userIndex, 1);
  delete adminPasswords[username];
  return true;
}










