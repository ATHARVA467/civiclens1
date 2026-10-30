import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/lib/authContext';
import { Compass, ShieldCheck, UserCheck, ArrowRight, AlertCircle, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { clsx } from 'clsx';

export const AuthPage: React.FC<{ isRegister?: boolean }> = ({ isRegister = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithDemo, 
    error: authError, 
    clearError,
    isLoading 
  } = useAuth();

  const [role, setRole] = useState<'citizen' | 'officer'>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Determine return URL if passed in state
  const returnUrl = (location.state as { from?: string })?.from || (role === 'officer' ? '/admin/overview' : '/my-reports');

  const handleRoleChange = (newRole: 'citizen' | 'officer') => {
    setRole(newRole);
    clearError();
    setLocalError(null);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setLocalError(null);
    clearError();
    try {
      await signInWithGoogle(role, returnUrl);
      // If in demo/synthetic mode, redirect directly
      navigate(returnUrl, { replace: true });
    } catch (err: unknown) {
      console.error('Google sign-in error:', err);
      setLocalError(err instanceof Error ? err.message : 'Google sign-in was interrupted. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    setIsSubmitting(true);

    try {
      if (isRegister) {
        await signUpWithEmail(email, password, name || 'Citizen User', role);
      } else {
        await signInWithEmail(email, password, role);
      }
      navigate(returnUrl, { replace: true });
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (demoRole: 'citizen' | 'officer') => {
    signInWithDemo(demoRole);
    navigate(demoRole === 'officer' ? '/admin/overview' : '/my-reports', { replace: true });
  };

  const displayedError = localError || authError;

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <Card className="p-6 sm:p-8 soft-card-elevated space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#294563] text-white mx-auto flex items-center justify-center shadow-soft-sm">
            <Compass className="w-6 h-6 text-[#8EA8C2]" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-[#294563]">
            {isRegister ? 'Create CivicLens Account' : 'Sign In to CivicLens'}
          </h1>
          <p className="text-xs text-[#687887] max-w-sm mx-auto leading-relaxed">
            {role === 'citizen'
              ? 'Access welfare schemes, track public complaints, and receive AI-guided resolutions.'
              : 'Municipal officer credentials for intelligent triage, geospatial clusters, and action dispatch.'}
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F1F3EF] border border-[#E7E9E5]">
          <button
            type="button"
            onClick={() => handleRoleChange('citizen')}
            className={clsx(
              'py-2 px-3 rounded-lg text-xs font-semibold transition-all min-h-[42px] flex items-center justify-center gap-1.5',
              role === 'citizen'
                ? 'bg-white text-[#294563] shadow-soft-sm'
                : 'text-[#687887] hover:text-[#253342]'
            )}
          >
            <UserCheck className="w-4 h-4 text-[#7189A4]" />
            <span>Citizen Portal</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('officer')}
            className={clsx(
              'py-2 px-3 rounded-lg text-xs font-semibold transition-all min-h-[42px] flex items-center justify-center gap-1.5',
              role === 'officer'
                ? 'bg-[#1C2C3D] text-white shadow-soft-sm'
                : 'text-[#687887] hover:text-[#253342]'
            )}
          >
            <ShieldCheck className="w-4 h-4 text-[#8EA8C2]" />
            <span>Municipal Officer</span>
          </button>
        </div>

        {/* Error Notification Banner */}
        {displayedError && (
          <div className="p-3.5 rounded-xl bg-[#B85D5D]/10 border border-[#B85D5D]/25 text-[#B85D5D] text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-semibold">Sign In Alert:</strong>
              <span>{displayedError}</span>
            </div>
          </div>
        )}

        {/* Google OAuth Single Sign-On Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[#E7E9E5] bg-white text-sm font-semibold text-[#253342] shadow-soft-sm hover:bg-[#F1F3EF] hover:border-[#7189A4]/40 transition-all min-h-[46px] disabled:opacity-60"
            aria-label="Continue with Google"
          >
            {googleLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#294563] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>
              {googleLoading 
                ? 'Connecting to Google...' 
                : isRegister 
                  ? 'Sign up with Google' 
                  : 'Continue with Google'}
            </span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E7E9E5] w-full" />
            <span className="bg-white px-3 text-[11px] font-medium text-[#687887] uppercase tracking-wider relative shrink-0">
              or sign in with credentials
            </span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isRegister && (
            <div className="space-y-1 text-left">
              <label className="block text-xs font-semibold text-[#253342] uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ravi Kumar"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7E9E5] text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] focus:border-transparent min-h-[44px]"
              />
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="block text-xs font-semibold text-[#253342] uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'officer' ? 'officer.gowda@bbmp.gov.in' : 'citizen@karnataka.gov.in'}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7E9E5] text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] focus:border-transparent min-h-[44px]"
            />
          </div>

          <div className="space-y-1 text-left">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#253342] uppercase tracking-wider">
                Password
              </label>
              {!isRegister && (
                <span className="text-xs text-[#7189A4] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7E9E5] text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] focus:border-transparent min-h-[44px]"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? (
              'Authenticating...'
            ) : isRegister ? (
              'Register Account'
            ) : role === 'officer' ? (
              'Access Officer Command Centre'
            ) : (
              'Sign In as Citizen'
            )}
          </Button>

          <div className="pt-2 text-center text-xs text-[#687887]">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#294563] hover:underline">
                  Sign in
                </Link>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-[#294563] hover:underline">
                  Register as Citizen
                </Link>
              </span>
            )}
          </div>
        </form>

        {/* Quick Demo Access Bar for Evaluators */}
        <div className="pt-4 border-t border-[#E7E9E5] text-left space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#687887] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#7C9B85]" />
            <span>Instant Demo Access (No Password Required)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('citizen')}
              className="px-3 py-2 text-left rounded-lg border border-[#E7E9E5] bg-[#F1F3EF]/60 hover:bg-[#F1F3EF] transition-colors text-xs text-[#253342]"
            >
              <div className="font-semibold text-[#294563]">Citizen Demo</div>
              <div className="text-[10px] text-[#687887]">Track & file grievances</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('officer')}
              className="px-3 py-2 text-left rounded-lg border border-[#304153]/40 bg-[#1C2C3D] hover:bg-[#25394e] transition-colors text-xs text-white"
            >
              <div className="font-semibold text-[#8EA8C2]">Officer Demo</div>
              <div className="text-[10px] text-[#A8B5C1]">Admin triage & GIS map</div>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
