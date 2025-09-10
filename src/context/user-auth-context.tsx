'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, getAuthState, setAuthState, clearAuthState, generateToken } from '@/lib/user-auth';

interface UserAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthStateLocal] = useState<AuthState>({ user: null, token: null, isAuthenticated: false });

  useEffect(() => {
    const savedAuth = getAuthState();
    setAuthStateLocal(savedAuth);
  }, []);

  const login = (user: User, token: string) => {
    const newAuthState: AuthState = {
      user,
      token,
      isAuthenticated: true,
    };
    setAuthState(newAuthState);
    setAuthStateLocal(newAuthState);
  };

  const logout = () => {
    clearAuthState();
    setAuthStateLocal({ user: null, token: null, isAuthenticated: false });
  };

  const updateUser = (user: User) => {
    const newAuthState: AuthState = {
      ...authState,
      user,
    };
    setAuthState(newAuthState);
    setAuthStateLocal(newAuthState);
  };

  return (
    <UserAuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        token: authState.token,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
}



