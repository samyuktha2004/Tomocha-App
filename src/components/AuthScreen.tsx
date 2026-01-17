import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, User, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Check, Phone, Users, Shield } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import Group from '../imports/Group2.tsx';

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void;
  onSkip: () => void;
}

export default function AuthScreen({ onAuthSuccess, onSkip }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Signup step management
  const [signupStep, setSignupStep] = useState(1);
  const totalSteps = 4;
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state - Step 1
  const [signupEmail, setSignupEmail] = useState('');
  
  // Signup form state - Step 2
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Signup form state - Step 3 (Optional)
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  
  // Signup form state - Step 4 (Emergency Contacts - Optional)
  const [emergencyContact1Name, setEmergencyContact1Name] = useState('');
  const [emergencyContact1Phone, setEmergencyContact1Phone] = useState('');
  const [emergencyContact1Relationship, setEmergencyContact1Relationship] = useState('');
  const [emergencyContact2Name, setEmergencyContact2Name] = useState('');
  const [emergencyContact2Phone, setEmergencyContact2Phone] = useState('');
  const [emergencyContact2Relationship, setEmergencyContact2Relationship] = useState('');

  // Validation helpers
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };
  
  const validatePhone = (phone: string) => {
    // Basic phone validation - at least 10 digits
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(loginEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call - Replace with actual backend call later
    setTimeout(() => {
      // Check if user exists in localStorage (mock authentication)
      const storedUser = localStorage.getItem('tomochaUser');
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === loginEmail) {
          // In production, verify password with backend
          toast.success('Welcome back! 💜');
          onAuthSuccess(user);
        } else {
          toast.error('Invalid email or password');
        }
      } else {
        toast.error('No account found. Please sign up first!');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  // Handle Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupEmail || !signupPassword || !confirmPassword) {
      toast.error('Please fill in the required fields');
      return;
    }
    
    if (!validateEmail(signupEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (!validatePassword(signupPassword)) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call - Replace with actual backend call later
    setTimeout(() => {
      // Parse firstName and lastName from name field
      const fullName = name || 'Friend';
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const newUser = {
        email: signupEmail,
        name: fullName,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: age ? new Date(new Date().getFullYear() - parseInt(age), 0, 1).toISOString().split('T')[0] : '',
        emergencyContacts: [
          {
            name: emergencyContact1Name,
            phone: emergencyContact1Phone,
            relationship: emergencyContact1Relationship
          },
          {
            name: emergencyContact2Name,
            phone: emergencyContact2Phone,
            relationship: emergencyContact2Relationship
          }
        ],
        isGuest: false,
        createdAt: new Date().toISOString()
      };
      
      // Store user in localStorage (mock database)
      localStorage.setItem('tomochaUser', JSON.stringify(newUser));
      localStorage.setItem('isAuthenticated', 'true');
      // Also save firstName separately for quick access
      localStorage.setItem('userFirstName', firstName);
      
      toast.success('Welcome to Tomocha! 🎉');
      onAuthSuccess(newUser);
      setIsLoading(false);
    }, 1000);
  };

  // Handle Skip/Guest Mode
  const handleSkip = () => {
    toast.success('Welcome! You can create an account anytime from Settings', {
      duration: 4000
    });
    
    // Set guest user
    const guestUser = {
      email: 'guest',
      name: 'Guest',
      firstName: 'Friend',
      isGuest: true,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('tomochaUser', JSON.stringify(guestUser));
    localStorage.setItem('isAuthenticated', 'true');
    // Don't save userFirstName for guest - let the utility function handle it
    onSkip();
  };

  // Handle step navigation
  const handleNextStep = () => {
    if (signupStep === 1) {
      if (!signupEmail) {
        toast.error('Please enter your email');
        return;
      }
      if (!validateEmail(signupEmail)) {
        toast.error('Please enter a valid email address');
        return;
      }
    }
    
    if (signupStep === 2) {
      if (!signupPassword || !confirmPassword) {
        toast.error('Please fill in both password fields');
        return;
      }
      if (!validatePassword(signupPassword)) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      if (signupPassword !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }
    
    setSignupStep(signupStep + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-purple-50 dark:from-[#1a1625] dark:via-[#231d2e] dark:to-[#2d2438] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-300 dark:bg-purple-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300 dark:bg-pink-600 rounded-full opacity-20 blur-3xl animate-pulse delay-75"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200 dark:bg-purple-700 rounded-full opacity-10 blur-2xl animate-pulse delay-150"></div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100 transition-colors flex items-center gap-2 bg-white/50 dark:bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-purple-200 dark:border-purple-700/30 hover:border-purple-400 dark:hover:border-purple-500 z-20"
        aria-label="Skip authentication and continue as guest"
      >
        <span>Continue as Guest</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Static Logo on the Left */}
      <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
        <div className="w-14 h-12">
          <Group />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 mt-20">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h1 className="text-purple-900 dark:text-purple-100 mb-2">Welcome to Tomocha</h1>
          <p className="text-purple-600 dark:text-purple-300">
            Your safe space for mental wellness 💜
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border-2 border-purple-200 dark:border-purple-700/30 shadow-2xl bg-white/80 dark:bg-[#2d2438]/80 backdrop-blur-lg">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 bg-purple-100 dark:bg-purple-900/30">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-purple-900 dark:text-purple-100">Welcome Back! 👋</CardTitle>
                <CardDescription className="text-purple-600 dark:text-purple-400">
                  We're happy to see you again. Let's continue your wellness journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-purple-900 dark:text-purple-200">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 border-2 border-purple-200 dark:border-purple-700/30 focus:border-purple-500 dark:focus:border-purple-500"
                        required
                        aria-label="Email address for login"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-purple-900 dark:text-purple-200">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 pr-10 border-2 border-purple-200 dark:border-purple-700/30 focus:border-purple-500 dark:focus:border-purple-500"
                        required
                        aria-label="Password for login"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                    disabled={isLoading}
                    aria-label="Login to your account"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="truncate">Logging in...</span>
                      </div>
                    ) : (
                      'Login'
                    )}
                  </Button>

                  <p className="text-center text-purple-600 dark:text-purple-400 text-sm">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('signup')}
                      className="text-purple-700 dark:text-purple-300 hover:underline"
                    >
                      Sign up here
                    </button>
                  </p>
                </form>
              </CardContent>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="text-purple-900 dark:text-purple-100">Start Your Journey ✨</CardTitle>
                <CardDescription className="text-purple-600 dark:text-purple-400">
                  {signupStep === 1 && "Let's start with your email address"}
                  {signupStep === 2 && "Create a secure password"}
                  {signupStep === 3 && "Tell us a bit about yourself (optional)"}
                  {signupStep === 4 && "Add emergency contacts (optional)"}
                </CardDescription>
                
                {/* Step Progress Indicator */}
                <div className="flex items-center justify-center gap-2 pt-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex items-center ${step < 4 ? 'gap-2' : ''}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                          step < signupStep
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : step === signupStep
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white ring-4 ring-purple-200 dark:ring-purple-700/30'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-400 dark:text-purple-500'
                        }`}
                        aria-label={`Step ${step} of ${totalSteps}`}
                      >
                        {step < signupStep ? <Check className="w-4 h-4" /> : step}
                      </div>
                      {step < 4 && (
                        <div
                          className={`w-8 h-0.5 ${
                            step < signupStep
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                              : 'bg-purple-200 dark:bg-purple-700/30'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Step 1: Email */}
                  {signupStep === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-purple-900 dark:text-purple-200">
                          Email <span className="text-pink-500">*</span>
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="your@email.com"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            className="pl-10 border-2 border-purple-200 dark:border-purple-700/30 focus:border-purple-500 dark:focus:border-purple-500"
                            required
                            aria-label="Email address for signup"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Password */}
                  {signupStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-purple-900 dark:text-purple-200">
                          Password <span className="text-pink-500">*</span>
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                          <Input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="At least 6 characters"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            className="pl-10 pr-10 border-2 border-purple-200 dark:border-purple-700/30 focus:border-purple-500 dark:focus:border-purple-500"
                            required
                            minLength={6}
                            aria-label="Create a password (at least 6 characters)"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-purple-500 dark:text-purple-400">
                          Use 6+ characters for security
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-purple-900 dark:text-purple-200">
                          Confirm Password <span className="text-pink-500">*</span>
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                          <Input
                            id="confirm-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Type password again"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 border-2 border-purple-200 dark:border-purple-700/30 focus:border-purple-500 dark:focus:border-purple-500"
                            required
                            aria-label="Confirm your password"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Optional Fields */}
                  {signupStep === 3 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-purple-900 dark:text-purple-200">
                          Name (or nickname)
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="What should we call you?"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10 border-2 border-purple-200 dark:border-purple-700/30 focus:border-purple-500 dark:focus:border-purple-500"
                            aria-label="Your name or preferred nickname (optional)"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age" className="text-purple-900 dark:text-purple-200">
                          Age
                        </Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Your age (optional)"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          min="13"
                          max="120"
                          className="border-2 border-purple-200 dark:border-purple-700/30 focus:border-purple-500 dark:focus:border-purple-500"
                          aria-label="Your age (optional, for age-appropriate content)"
                        />
                        <p className="text-xs text-purple-500 dark:text-purple-400">
                          Helps us provide age-appropriate support
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Emergency Contacts */}
                  {signupStep === 4 && (
                    <div className="space-y-4">
                      {/* Informational Banner */}
                      <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700/30 rounded-xl p-4 flex items-start gap-3">
                        <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-purple-900 dark:text-purple-200">
                            <span className="font-semibold">Your Safety Matters</span>
                          </p>
                          <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                            Add trusted contacts who can support you during difficult moments. This information is kept private and only used if you activate SOS features.
                          </p>
                        </div>
                      </div>

                      {/* Emergency Contact 1 */}
                      <div className="space-y-3 p-4 bg-white dark:bg-[#1a1625] rounded-xl border-2 border-purple-100 dark:border-purple-800/30">
                        <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-200 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Emergency Contact 1
                        </h4>
                        
                        <div className="space-y-2">
                          <Label htmlFor="emergency-contact1-name" className="text-purple-900 dark:text-purple-200">
                            Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                            <Input
                              id="emergency-contact1-name"
                              type="text"
                              placeholder="e.g., Mom, Best Friend, Partner"
                              value={emergencyContact1Name}
                              onChange={(e) => setEmergencyContact1Name(e.target.value)}
                              className="pl-10 border-2 border-purple-200 dark:border-purple-700/30 focus:border-purple-500 dark:focus:border-purple-500"
                              aria-label="Name of your first emergency contact"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emergency-contact1-phone" className="text-purple-900 dark:text-purple-200">
                            Phone Number
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                            <Input
                              id="emergency-contact1-phone"
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              value={emergencyContact1Phone}
                              onChange={(e) => setEmergencyContact1Phone(e.target.value)}
                              className="pl-10 border-2 border-purple-200 dark:border-purple-700/30 focus:border-purple-500 dark:focus:border-purple-500"
                              aria-label="Phone number of your first emergency contact"
                            />
                          </div>
                          {emergencyContact1Phone && (
                            <p className={`text-xs ${validatePhone(emergencyContact1Phone) ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                              {validatePhone(emergencyContact1Phone) ? '✓ Valid phone number' : '⚠ Please enter at least 10 digits'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emergency-contact1-relationship" className="text-purple-900 dark:text-purple-200">
                            Relationship
                          </Label>
                          <Input
                            id="emergency-contact1-relationship"
                            type="text"
                            placeholder="e.g., Parent, Friend, Sibling"
                            value={emergencyContact1Relationship}
                            onChange={(e) => setEmergencyContact1Relationship(e.target.value)}
                            className="border-2 border-purple-200 dark:border-purple-700/30 focus:border-purple-500 dark:focus:border-purple-500"
                            aria-label="Relationship with your first emergency contact"
                          />
                        </div>
                      </div>

                      {/* Emergency Contact 2 */}
                      <div className="space-y-3 p-4 bg-white dark:bg-[#1a1625] rounded-xl border-2 border-purple-100 dark:border-purple-800/30">
                        <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-200 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Emergency Contact 2 (Optional)
                        </h4>
                        
                        <div className="space-y-2">
                          <Label htmlFor="emergency-contact2-name" className="text-purple-900 dark:text-purple-200">
                            Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                            <Input
                              id="emergency-contact2-name"
                              type="text"
                              placeholder="e.g., Therapist, Counselor, Trusted Friend"
                              value={emergencyContact2Name}
                              onChange={(e) => setEmergencyContact2Name(e.target.value)}
                              className="pl-10 border-2 border-purple-200 dark:border-purple-700/30 focus:border-purple-500 dark:focus:border-purple-500"
                              aria-label="Name of your second emergency contact"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emergency-contact2-phone" className="text-purple-900 dark:text-purple-200">
                            Phone Number
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                            <Input
                              id="emergency-contact2-phone"
                              type="tel"
                              placeholder="+1 (555) 987-6543"
                              value={emergencyContact2Phone}
                              onChange={(e) => setEmergencyContact2Phone(e.target.value)}
                              className="pl-10 border-2 border-purple-200 dark:border-purple-700/30 focus:border-purple-500 dark:focus:border-purple-500"
                              aria-label="Phone number of your second emergency contact"
                            />
                          </div>
                          {emergencyContact2Phone && (
                            <p className={`text-xs ${validatePhone(emergencyContact2Phone) ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                              {validatePhone(emergencyContact2Phone) ? '✓ Valid phone number' : '⚠ Please enter at least 10 digits'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emergency-contact2-relationship" className="text-purple-900 dark:text-purple-200">
                            Relationship
                          </Label>
                          <Input
                            id="emergency-contact2-relationship"
                            type="text"
                            placeholder="e.g., Therapist, Counselor, Friend"
                            value={emergencyContact2Relationship}
                            onChange={(e) => setEmergencyContact2Relationship(e.target.value)}
                            className="border-2 border-purple-200 dark:border-purple-700/30 focus:border-purple-500 dark:focus:border-purple-500"
                            aria-label="Relationship with your second emergency contact"
                          />
                        </div>
                      </div>

                      <p className="text-xs text-purple-600 dark:text-purple-400 italic text-center">
                        💡 You can always add or update emergency contacts later in your account settings
                      </p>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className={`flex mt-4 ${signupStep === 1 ? 'justify-end' : 'justify-between'}`}>
                    {signupStep > 1 && (
                      <Button
                        type="button"
                        onClick={() => setSignupStep(signupStep - 1)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                        aria-label="Go to previous step"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                      </Button>
                    )}
                    
                    {signupStep < totalSteps && (
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                        aria-label="Go to next step"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                    
                    {signupStep === totalSteps && (
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                        disabled={isLoading}
                        aria-label="Create your Tomocha account"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="truncate">Creating account...</span>
                          </div>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <span className="truncate">Create Account</span>
                            <Sparkles className="w-4 h-4 flex-shrink-0" />
                          </span>
                        )}
                      </Button>
                    )}
                  </div>

                  <p className="text-center text-purple-600 dark:text-purple-400 text-sm">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-purple-700 dark:text-purple-300 hover:underline"
                    >
                      Login here
                    </button>
                  </p>

                  <p className="text-center text-xs text-purple-500 dark:text-purple-400 mt-4">
                    By signing up, you agree to use Tomocha responsibly. 
                    Remember, this is a supportive tool, not a replacement for professional help. 💜
                  </p>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Bottom Message */}
        <p className="text-center text-purple-600 dark:text-purple-300 mt-6 text-sm">
          Your data is safe with us. We respect your privacy and never share your information. 🔒
        </p>
      </div>
    </div>
  );
}