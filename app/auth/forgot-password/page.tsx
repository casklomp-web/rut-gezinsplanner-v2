'use client';

import { useState, Suspense } from 'react';
import { useUserStore } from '@/lib/store/userStore';
import { ChefHat, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateSecureId } from '@/lib/auth/password';

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const { users, updateUser } = useUserStore();
  
  const [step, setStep] = useState<'email' | 'success' | 'reset'>(token ? 'reset' : 'email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if email exists
    const user = users.find((u: any) => u.email === email);
    
    if (!user) {
      // Don't reveal if email exists for security
      toast.success('Als dit e-mailadres bestaat, ontvang je een reset link');
      setStep('success');
      setIsLoading(false);
      return;
    }

    // MVP: No email service, show reset token directly
    const resetToken = generateSecureId();
    
    // Store reset token in user (in real app, this would be emailed)
    updateUser(user.id, { 
      passwordResetToken: resetToken,
      passwordResetExpires: Date.now() + 3600000 // 1 hour
    } as any);

    toast.success('Reset link gegenereerd!');
    setStep('success');
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error('Wachtwoorden komen niet overeen');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Wachtwoord moet minimaal 6 tekens bevatten');
      setIsLoading(false);
      return;
    }

    // In real app, verify token and update password
    // MVP: Just show success and redirect
    toast.success('Wachtwoord gewijzigd! Log in met je nieuwe wachtwoord.');
    router.push('/auth?mode=login');
    setIsLoading(false);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#2D3436] mb-2">Check je e-mail</h1>
          <p className="text-gray-600 mb-6">
            Als dit e-mailadres bij ons bekend is, ontvang je een link om je wachtwoord te resetten.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            (MVP: In de echte app zou je een e-mail ontvangen. Nu kun je contact opnemen met support.)
          </p>
          <button
            onClick={() => router.push('/auth?mode=login')}
            className="w-full py-4 bg-[#4A90A4] text-white rounded-xl font-medium hover:bg-[#3a7a8c] transition-colors"
          >
            Terug naar inloggen
          </button>
        </div>
      </div>
    );
  }

  if (step === 'reset') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#4A90A4] rounded-xl mx-auto mb-4 flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#4A90A4]">Nieuw wachtwoord</h1>
            <p className="text-gray-600">Kies een nieuw wachtwoord</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nieuw wachtwoord *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4] pr-12"
                  placeholder="Minimaal 6 tekens"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wachtwoord bevestigen *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                placeholder="Herhaal je wachtwoord"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#4A90A4] text-white rounded-xl font-medium hover:bg-[#3a7a8c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center">
                {isLoading ? 'Bezig...' : <>Wachtwoord wijzigen<ArrowRight className="w-5 h-5 ml-2" /></>}
              </span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#4A90A4] rounded-xl mx-auto mb-4 flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#4A90A4]">Wachtwoord vergeten</h1>
          <p className="text-gray-600">Vul je e-mailadres in</p>
        </div>

        <form onSubmit={handleSubmitEmail} className="space-y-4">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#4A90A4] text-white rounded-xl font-medium hover:bg-[#3a7a8c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center">
              {isLoading ? 'Bezig...' : <>Versturen<ArrowRight className="w-5 h-5 ml-2" /></>}
            </span>
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          <button
            onClick={() => router.push('/auth?mode=login')}
            className="text-[#4A90A4] hover:text-[#3a7a8c] font-medium"
          >
            Terug naar inloggen
          </button>
        </p>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#4A90A4]">Laden...</div>
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}
