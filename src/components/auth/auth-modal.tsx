'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUserAuth } from '@/context/user-auth-context';
import { 
  validateEmail, 
  validateMobile, 
  generateOTP, 
  saveOTP, 
  verifyOTP, 
  clearOTP,
  findUserByEmail,
  findUserByMobile,
  createUser,
  generateToken
} from '@/lib/user-auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useUserAuth();
  const { toast } = useToast();
  
  // Registration form
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [regOtp, setRegOtp] = useState('');
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regOtpVerified, setRegOtpVerified] = useState(false);

  // Login form
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: ''
  });

  // OTP form
  const [otpForm, setOtpForm] = useState({
    mobile: '',
    otp: ''
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!regForm.fullName || !regForm.email || !regForm.mobile || !regForm.password) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    if (!validateEmail(regForm.email)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive'
      });
      return;
    }

    if (!validateMobile(regForm.mobile)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid mobile number.',
        variant: 'destructive'
      });
      return;
    }

    if (regForm.password !== regForm.confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Passwords do not match.',
        variant: 'destructive'
      });
      return;
    }

    if (regForm.password.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive'
      });
      return;
    }

    if (!regOtpVerified) {
      toast({
        title: 'Mobile Verification Required',
        description: 'Please verify your mobile number via OTP before registering.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if user already exists
      if (findUserByEmail(regForm.email)) {
        toast({
          title: 'Registration Failed',
          description: 'An account with this email already exists.',
          variant: 'destructive'
        });
        return;
      }

      if (findUserByMobile(regForm.mobile)) {
        toast({
          title: 'Registration Failed',
          description: 'An account with this mobile number already exists.',
          variant: 'destructive'
        });
        return;
      }

      // Create new user
      const newUser = createUser({
        fullName: regForm.fullName,
        email: regForm.email,
        mobile: regForm.mobile,
        password: regForm.password,
        role: 'user'
      });

      const token = generateToken();
      login(newUser, token);

      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully!',
      });

      onClose();
      setRegForm({ fullName: '', email: '', mobile: '', password: '', confirmPassword: '' });
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!loginForm.identifier || !loginForm.password) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      let user = null as ReturnType<typeof findUserByEmail> | ReturnType<typeof findUserByMobile>;
      if (validateEmail(loginForm.identifier)) {
        user = findUserByEmail(loginForm.identifier);
      } else if (validateMobile(loginForm.identifier)) {
        user = findUserByMobile(loginForm.identifier);
      }

      if (!user || user.password !== loginForm.password) {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password.',
          variant: 'destructive'
        });
        return;
      }

      const token = generateToken();
      login(user, token);

      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });

      onClose();
      setLoginForm({ identifier: '', password: '' });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRegOTP = async () => {
    if (!validateMobile(regForm.mobile)) {
      toast({ title: 'Validation Error', description: 'Enter a valid mobile number.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const otp = generateOTP();
      saveOTP(regForm.mobile, otp);
      console.log(`Registration OTP for ${regForm.mobile}: ${otp}`);
      setRegOtpSent(true);
      toast({ title: 'OTP Sent', description: `OTP sent to ${regForm.mobile}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyRegOTP = async () => {
    if (!regOtp) {
      toast({ title: 'Validation Error', description: 'Enter the OTP.', variant: 'destructive' });
      return;
    }
    if (!verifyOTP(regForm.mobile, regOtp)) {
      toast({ title: 'OTP Verification Failed', description: 'Invalid or expired OTP.', variant: 'destructive' });
      return;
    }
    clearOTP(regForm.mobile);
    setRegOtpVerified(true);
    toast({ title: 'Mobile Verified', description: 'Your mobile number has been verified.' });
  };

  const handleSendOTP = async () => {
    if (!otpForm.mobile) {
      toast({
        title: 'Validation Error',
        description: 'Please enter your mobile number.',
        variant: 'destructive'
      });
      return;
    }

    if (!validateMobile(otpForm.mobile)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid mobile number.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const otp = generateOTP();
      saveOTP(otpForm.mobile, otp);
      
      // Simulate OTP sending
      console.log(`OTP for ${otpForm.mobile}: ${otp}`);
      
      setIsOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: `OTP has been sent to ${otpForm.mobile}`,
      });
    } catch (error) {
      toast({
        title: 'Failed to Send OTP',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPLogin = async () => {
    if (!otpForm.otp) {
      toast({
        title: 'Validation Error',
        description: 'Please enter the OTP.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      if (!verifyOTP(otpForm.mobile, otpForm.otp)) {
        toast({
          title: 'OTP Verification Failed',
          description: 'Invalid or expired OTP.',
          variant: 'destructive'
        });
        return;
      }

      let user = findUserByMobile(otpForm.mobile);
      
      // Create user if doesn't exist (OTP-only registration)
      if (!user) {
        user = createUser({
          fullName: 'User',
          email: '',
          mobile: otpForm.mobile,
          role: 'user'
        });
      }

      const token = generateToken();
      login(user, token);
      clearOTP(otpForm.mobile);

      toast({
        title: 'Login Successful',
        description: 'Welcome!',
      });

      onClose();
      setOtpForm({ mobile: '', otp: '' });
      setIsOtpSent(false);
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">Welcome to Luméra</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-identifier">Email or Mobile</Label>
                <Input
                  id="login-identifier"
                  type="text"
                  inputMode="email"
                  placeholder="Enter your email or mobile"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={loginForm.identifier}
                  onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                  <Button type="button" variant="outline" onClick={() => setShowLoginPassword((v) => !v)}>
                    {showLoginPassword ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>
              <Button 
                onClick={handleEmailLogin} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login with Email'}
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-mobile">Mobile Number</Label>
                <Input
                  id="otp-mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={otpForm.mobile}
                  onChange={(e) => setOtpForm({ ...otpForm, mobile: e.target.value })}
                  disabled={isOtpSent}
                />
              </div>
              
              {isOtpSent && (
                <div className="space-y-2">
                  <Label htmlFor="otp-code">Enter OTP</Label>
                  <Input
                    id="otp-code"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otpForm.otp}
                    onChange={(e) => setOtpForm({ ...otpForm, otp: e.target.value })}
                    maxLength={6}
                  />
                </div>
              )}
              
              <Button 
                onClick={isOtpSent ? handleOTPLogin : handleSendOTP} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : isOtpSent ? 'Verify OTP' : 'Send OTP'}
              </Button>
              
              {isOtpSent && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsOtpSent(false);
                    setOtpForm({ mobile: '', otp: '' });
                  }}
                  className="w-full"
                >
                  Change Mobile Number
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name *</Label>
                <Input
                  id="reg-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email *</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="Enter your email"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-mobile">Mobile Number *</Label>
                <Input
                  id="reg-mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={regForm.mobile}
                  onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value })}
                />
                <div className="flex items-center gap-2">
                  {!regOtpVerified && (
                    <>
                      <Button type="button" variant="outline" onClick={regOtpSent ? handleVerifyRegOTP : handleSendRegOTP} disabled={isLoading}>
                        {regOtpSent ? 'Verify OTP' : 'Send OTP'}
                      </Button>
                      {regOtpSent && (
                        <Input
                          id="reg-otp"
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter OTP"
                          value={regOtp}
                          onChange={(e) => setRegOtp(e.target.value)}
                          className="max-w-[180px]"
                        />
                      )}
                    </>
                  )}
                  {regOtpVerified && <span className="text-sm text-green-600">Verified</span>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  />
                  <Button type="button" variant="outline" onClick={() => setShowRegPassword((v) => !v)}>
                    {showRegPassword ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-confirm-password">Confirm Password *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="reg-confirm-password"
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                  />
                  <Button type="button" variant="outline" onClick={() => setShowRegConfirmPassword((v) => !v)}>
                    {showRegConfirmPassword ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>
              <Button 
                onClick={handleRegister} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
