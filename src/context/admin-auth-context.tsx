'use client'

import React, { createContext, useContext } from 'react'
import { useUserAuth } from './user-auth-context'
import { useRouter } from 'next/navigation'

interface AdminAuthContextType {
  isAuthenticated: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  user: any
  isLoading: boolean
  logout: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut, isLoading } = useUserAuth()
  const router = useRouter()

  const isAdmin = profile?.is_admin ?? false
  const isSuperAdmin = profile?.role === 'super_admin'
  const isAuthenticated = !!user && isAdmin

  const logout = async () => {
    await signOut()
    router.push('/admin/login')
  }

  const value = {
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    user: user ? { 
      username: profile?.profile_data?.full_name || user.email, 
      role: profile?.role 
    } : null,
    isLoading,
    logout,
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}


// 'use client';

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { AdminUser } from '@/lib/auth';

// interface AdminAuthContextType {
//   user: AdminUser | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (username: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
// }

// const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// export function AdminAuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<AdminUser | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is logged in from localStorage
//     const storedUser = localStorage.getItem('admin_user');
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//       } catch (error) {
//         console.error('Error parsing stored user:', error);
//         localStorage.removeItem('admin_user');
//       }
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (username: string, password: string): Promise<boolean> => {
//     try {
//       // In a real app, this would be an API call
//       // For demo, we'll simulate the authentication
//       const response = await fetch('/api/admin/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       if (response.ok) {
//         const userData = await response.json();
//         setUser(userData);
//         localStorage.setItem('admin_user', JSON.stringify(userData));
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Login error:', error);
//       return false;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('admin_user');
//   };

//   const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
//     if (!user) return false;

//     try {
//       const response = await fetch('/api/admin/change-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           username: user.username, 
//           currentPassword, 
//           newPassword 
//         }),
//       });

//       return response.ok;
//     } catch (error) {
//       console.error('Change password error:', error);
//       return false;
//     }
//   };

//   const value: AdminAuthContextType = {
//     user,
//     isAuthenticated: !!user,
//     isLoading,
//     login,
//     logout,
//     changePassword,
//   };

//   return (
//     <AdminAuthContext.Provider value={value}>
//       {children}
//     </AdminAuthContext.Provider>
//   );
// }

// export function useAdminAuth() {
//   const context = useContext(AdminAuthContext);
//   if (context === undefined) {
//     throw new Error('useAdminAuth must be used within an AdminAuthProvider');
//   }
//   return context;
// }
