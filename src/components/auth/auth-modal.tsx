'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { useUserAuth } from '@/context/user-auth-context'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signUp, signIn } = useUserAuth()
  const { toast } = useToast()
  
  // Registration form
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  })

  // Login form
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [regError, setRegError] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false)

  const handleRegister = async () => {
    setRegError('') // Clear previous errors
    
    if (!regForm.fullName || !regForm.email || !regForm.password) {
      setRegError('Please fill in all required fields.')
      return
    }

    if (regForm.password !== regForm.confirmPassword) {
      setRegError('Passwords do not match.')
      return
    }

    if (regForm.password.length < 6) {
      setRegError('Password must be at least 6 characters long.')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signUp(
        regForm.email,
        regForm.password,
        regForm.fullName,
        regForm.mobile
      )

      if (error) {
        console.error('Signup error:', error)
        setRegError(error.message)
        setIsLoading(false)
        return
      }

      // Success!
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully!',
      })

      // Reset form and close modal
      setRegForm({ fullName: '', email: '', mobile: '', password: '', confirmPassword: '' })
      setRegError('')
      onClose()
    } catch (error: any) {
      console.error('Signup exception:', error)
      setRegError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async () => {
    setLoginError('') // Clear previous errors
    
    if (!loginForm.email || !loginForm.password) {
      setLoginError('Please fill in all required fields.')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signIn(loginForm.email, loginForm.password)

      if (error) {
        console.error('Login error:', error)
        setLoginError(error.message || 'Invalid email or password.')
        setIsLoading(false)
        return
      }

      // Success!
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      })

      // Reset form and close modal
      setLoginForm({ email: '', password: '' })
      setLoginError('')
      onClose()
    } catch (error: any) {
      console.error('Login exception:', error)
      setLoginError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter key press
  const handleLoginKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEmailLogin()
    }
  }

  const handleRegisterKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRegister()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">
            Welcome to Luméra
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          {/* LOGIN TAB */}
          <TabsContent value="login" className="space-y-4">
            {loginError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  onKeyPress={handleLoginKeyPress}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    onKeyPress={handleLoginKeyPress}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    disabled={isLoading}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button 
                onClick={handleEmailLogin} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>
          </TabsContent>
          
          {/* REGISTER TAB */}
          <TabsContent value="register" className="space-y-4">
            {regError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{regError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reg-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  onKeyPress={handleRegisterKeyPress}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="your@email.com"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  onKeyPress={handleRegisterKeyPress}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-mobile">Mobile (Optional)</Label>
                <Input
                  id="reg-mobile"
                  type="tel"
                  placeholder="9876543210"
                  value={regForm.mobile}
                  onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value })}
                  onKeyPress={handleRegisterKeyPress}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password *</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Create a password (min 6 chars)"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    onKeyPress={handleRegisterKeyPress}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    disabled={isLoading}
                  >
                    {showRegPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-confirm-password">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="reg-confirm-password"
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    onKeyPress={handleRegisterKeyPress}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showRegConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleRegister}
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
