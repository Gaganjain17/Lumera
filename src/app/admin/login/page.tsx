'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useUserAuth } from '@/context/user-auth-context'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, profile, user, isLoading: authLoading } = useUserAuth()
  const router = useRouter()

  // Auto-redirect if already logged in as admin
  useEffect(() => {
    if (!authLoading && user && profile?.is_admin) {
      router.push('/admin')
    }
  }, [user, profile, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Step 1: Sign in
      const { error: signInError } = await signIn(email, password)
      
      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
        return
      }

      // Step 2: Wait for profile to load (with timeout)
      const waitForProfile = new Promise<boolean>((resolve, reject) => {
        let attempts = 0
        const maxAttempts = 20 // 10 seconds max (500ms * 20)
        
        const checkProfile = setInterval(() => {
          attempts++
          
          // Get fresh auth state from context
          const currentProfile = profile
          
          console.log(`Attempt ${attempts}: Profile =`, currentProfile) // Debug log
          
          if (currentProfile) {
            clearInterval(checkProfile)
            
            if (currentProfile.is_admin) {
              resolve(true)
            } else {
              reject(new Error('Access denied. Admin privileges required.'))
            }
          } else if (attempts >= maxAttempts) {
            clearInterval(checkProfile)
            reject(new Error('Profile loading timeout. Please try again.'))
          }
        }, 500)
      })

      // Wait for profile check
      await waitForProfile
      
      // If we reach here, user is admin - redirect
      router.push('/admin')
      
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'An unexpected error occurred')
      setIsLoading(false)
    }
  }

  // Show loading state if already authenticated
  if (!authLoading && user && profile?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to admin panel...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lumera.com"
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Test Credentials:</p>
            <p>Email: admin@lumera.com</p>
            <p>Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Eye, EyeOff, Lock, User } from 'lucide-react';
// import { useAdminAuth } from '@/context/admin-auth-context';

// export default function AdminLoginPage() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const { login } = useAdminAuth();
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       const success = await login(username, password);
//       if (success) {
//         router.push('/admin');
//       } else {
//         setError('Invalid username or password');
//       }
//     } catch (error) {
//       setError('An error occurred during login');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md shadow-xl">
//         <CardHeader className="text-center space-y-2">
//           <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
//             <Lock className="w-8 h-8 text-primary-foreground" />
//           </div>
//           <CardTitle className="text-2xl font-bold text-gray-900">
//             Admin Login
//           </CardTitle>
//           <CardDescription className="text-gray-600">
//             Access your Lumera admin panel
//           </CardDescription>
//         </CardHeader>
        
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {error && (
//               <Alert variant="destructive">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}
            
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="username"
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   placeholder="Enter your username"
//                   className="pl-10"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="password"
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter your password"
//                   className="pl-10 pr-10"
//                   required
//                   disabled={isLoading}
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={isLoading}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4 text-gray-400" />
//                   ) : (
//                     <Eye className="h-4 w-4 text-gray-400" />
//                   )}
//                 </Button>
//               </div>
//             </div>
            
//             <Button
//               type="submit"
//               className="w-full"
//               disabled={isLoading}
//             >
//               {isLoading ? 'Signing in...' : 'Sign In'}
//             </Button>
//           </form>
          
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Default credentials: <br />
//               <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
//                 admin / admin123
//               </span>
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }























