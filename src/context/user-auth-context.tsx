'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

interface UserProfile {
  user_id: string
  role: 'user' | 'admin' | 'super_admin'
  is_admin: boolean
  profile_data: {
    full_name?: string
    mobile?: string
  }
  last_login?: string
}

interface UserAuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  isProfileLoading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string, fullName: string, mobile?: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithOTP: (mobile: string) => Promise<{ error: AuthError | null }>
  verifyOTP: (mobile: string, otp: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  updateUser: (data: { full_name?: string; mobile?: string }) => Promise<{ error: Error | null }>
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined)

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const router = useRouter()

  const fetchProfile = async (userId: string) => {
    setIsProfileLoading(true)
    try {
      console.log('Fetching profile for user:', userId)

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)

        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating...')

          const { data: { user } } = await supabase.auth.getUser()

          if (user) {
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert({
                user_id: userId,
                profile_data: {
                  full_name: user.user_metadata?.full_name || '',
                  mobile: user.user_metadata?.mobile || user.phone || '',
                },
                role: 'user',
                is_admin: false,
              })
              .select()
              .single()

            if (createError) {
              console.error('Error creating profile:', createError)
              // Set fallback profile
              setProfile({
                user_id: userId,
                role: 'user',
                is_admin: false,
                profile_data: {
                  full_name: user.user_metadata?.full_name || '',
                },
              } as UserProfile)
            } else {
              console.log('Profile created:', newProfile)
              setProfile(newProfile as UserProfile)
            }
          }
        } else {
          // Other error - set fallback profile
          setProfile({
            user_id: userId,
            role: 'user',
            is_admin: false,
            profile_data: {},
          } as UserProfile)
        }
      } else {
        console.log('Profile fetched:', data)

        // Update last_login (don't await to avoid delay)
        supabase
          .from('user_profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('user_id', userId)
          .then(() => console.log('Last login updated'))
          // .catch((err: any) => console.error('Error updating last_login:', err))

        setProfile(data as UserProfile)
      }
    } catch (error) {
      console.error('Exception fetching profile:', error)
      setProfile({
        user_id: userId,
        role: 'user',
        is_admin: false,
        profile_data: {},
      } as UserProfile)
    } finally {
      setIsProfileLoading(false)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.id)
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string, mobile?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          mobile: mobile || '',
          role: 'user',
        },
      },
    })

    if (data.user && !error) {
      await fetchProfile(data.user.id)
    }

    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (data.user && !error) {
      await fetchProfile(data.user.id)
    }

    return { error }
  }

  const signInWithOTP = async (mobile: string) => {
    const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`
    
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedMobile,
    })

    return { error }
  }

  const verifyOTP = async (mobile: string, otp: string) => {
    const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`
    
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedMobile,
      token: otp,
      type: 'sms',
    })

    if (data.user && !error) {
      await fetchProfile(data.user.id)
    }

    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
    router.push('/')
  }

  const updateUser = async (data: { full_name?: string; mobile?: string }) => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          profile_data: {
            ...profile?.profile_data,
            ...data,
          },
        })
        .eq('user_id', user.id)

      if (error) throw error

      await fetchProfile(user.id)

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const value = {
    user,
    profile,
    session,
    isLoading,
    isProfileLoading,
    isAdmin: profile?.is_admin ?? false,
    signUp,
    signIn,
    signInWithOTP,
    verifyOTP,
    signOut,
    updateUser,
  }

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
}

export function useUserAuth() {
  const context = useContext(UserAuthContext)
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider')
  }
  return context
}

// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { User, AuthState, getAuthState, setAuthState, clearAuthState, generateToken } from '@/lib/user-auth';

// interface UserAuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   token: string | null;
//   login: (user: User, token: string) => void;
//   logout: () => void;
//   updateUser: (user: User) => void;
// }

// const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

// export function UserAuthProvider({ children }: { children: React.ReactNode }) {
//   const [authState, setAuthStateLocal] = useState<AuthState>({ user: null, token: null, isAuthenticated: false });

//   useEffect(() => {
//     const savedAuth = getAuthState();
//     setAuthStateLocal(savedAuth);
//   }, []);

//   const login = (user: User, token: string) => {
//     const newAuthState: AuthState = {
//       user,
//       token,
//       isAuthenticated: true,
//     };
//     setAuthState(newAuthState);
//     setAuthStateLocal(newAuthState);
//   };

//   const logout = () => {
//     clearAuthState();
//     setAuthStateLocal({ user: null, token: null, isAuthenticated: false });
//   };

//   const updateUser = (user: User) => {
//     const newAuthState: AuthState = {
//       ...authState,
//       user,
//     };
//     setAuthState(newAuthState);
//     setAuthStateLocal(newAuthState);
//   };

//   return (
//     <UserAuthContext.Provider
//       value={{
//         user: authState.user,
//         isAuthenticated: authState.isAuthenticated,
//         token: authState.token,
//         login,
//         logout,
//         updateUser,
//       }}
//     >
//       {children}
//     </UserAuthContext.Provider>
//   );
// }

// export function useUserAuth() {
//   const context = useContext(UserAuthContext);
//   if (context === undefined) {
//     throw new Error('useUserAuth must be used within a UserAuthProvider');
//   }
//   return context;
// }




