'use client';

import { useState, useEffect, Suspense } from 'react';
import { useUserStore } from '@/lib/store/userStore';
import { ChefHat, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import { useSearchParams, useRouter } from 'next/navigation';

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const isRegister = mode === 'register';
  
  const { registerUser, loginUser, isAuthenticated } = useUserStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/home');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isRegister) {
      // Validate register form
      if (!name || !email || !password || !familyName) {
        toast.error('Vul alle verplichte velden in');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Wachtwoorden komen niet overeen');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error('Wachtwoord moet minimaal 6 tekens bevatten');
        setIsLoading(false);
        return;
      }

      const result = await registerUser(name, email, password, familyName);
      
      if (result.success) {
        toast.success('Account aangemaakt! Welkom bij Rut.');
        router.push('/home');
      } else {
        toast.error(result.error || 'Er is iets misgegaan');
      }
    } else {
      // Login
      if (!email || !password) {
        toast.error('Vul je e-mailadres en wachtwoord in');
        setIsLoading(false);
        return;
      }

      const result = await loginUser(email, password);
      
      if (result.success) {
        toast.success('Welkom terug!');
        router.push('/home');
      } else {
        toast.error(result.error || 'Er is iets misgegaan');
      }
    }

    setIsLoading(false);
  };

  const toggleMode = () => {
    const newMode = isRegister ? 'login' : 'register';
    router.push(`/auth?mode=${newMode}`);
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#4A90A4] rounded-xl mx-auto mb-4 flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#4A90A4]">
            {isRegister ? 'Maak je account' : 'Welkom terug'}
          </h1>
          <p className="text-gray-600">
            {isRegister ? 'Start met Rut voor je gezin' : 'Log in om verder te gaan'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name - only for register */}
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jouw naam *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                placeholder="Bijv. Jan"
                required={isRegister}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mailadres *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
              placeholder="jan@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wachtwoord *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4] pr-12"
                placeholder={isRegister ? 'Minimaal 6 tekens' : 'Je wachtwoord'}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password - only for register */}
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wachtwoord bevestigen *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4] pr-12"
                  placeholder="Herhaal je wachtwoord"
                  required={isRegister}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Family Name - only for register */}
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gezinsnaam *
              </label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                placeholder="Bijv. Het gezin van Jan"
                required={isRegister}
              />
            </div>
          )}

          {/* Remember me - only for login */}
          {!isRegister && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#4A90A4] border-gray-300 rounded focus:ring-[#4A90A4]"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                Blijf ingelogd
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#4A90A4] text-white rounded-xl font-medium hover:bg-[#3a7a8c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center">
              {isLoading ? (
                'Bezig...'
              ) : isRegister ? (
                <>
                  Account aanmaken
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Inloggen
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </span>
          </button>
        </form>

        {/* Forgot password - only for login */}
        {!isRegister && (
          <div className="text-center mt-4">
            <button
              onClick={handleForgotPassword}
              className="text-sm text-gray-500 hover:text-[#4A90A4]"
            >
              Wachtwoord vergeten?
            </button>
          </div>
        )}

        {/* Toggle mode */}
        <p className="text-center mt-6 text-sm text-gray-600">
          {isRegister ? 'Heb je al een account?' : 'Nog geen account?'}{' '}
          <button
            onClick={toggleMode}
            className="text-[#4A90A4] hover:text-[#3a7a8c] font-medium"
          >
            {isRegister ? 'Log in' : 'Maak een account'}
          </button>
        </p>

        <p className="text-xs text-gray-400 text-center mt-6">
          Door verder te gaan accepteer je onze voorwaarden
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#4A90A4]">Laden...</div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
