import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Compass, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Verifying your credentials and establishing a secure session...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Guard against double invocation in React 18 StrictMode
  const exchangeAttemptedRef = useRef(false);

  useEffect(() => {
    if (exchangeAttemptedRef.current) return;
    exchangeAttemptedRef.current = true;

    async function handleAuthCallback() {
      try {
        // 1. Check for errors in the query params (e.g. cancelled Google login)
        const searchParams = new URLSearchParams(location.search);
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (errorParam || errorDescription) {
          const userReadableError = errorDescription
            ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
            : 'Authentication was cancelled or declined by the provider.';
          setStatus('error');
          setErrorMessage(userReadableError);
          return;
        }

        // 2. Check for PKCE authorization code (?code=...)
        const code = searchParams.get('code');

        if (code && isSupabaseConfigured && supabase) {
          setMessage('Exchanging authorization code for an encrypted session token...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('Supabase code exchange error:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Failed to exchange authentication code with Supabase.');
            return;
          }

          if (data?.session) {
            setStatus('success');
            setMessage('Session established! Redirecting to your dashboard...');
            
            const intendedRole = sessionStorage.getItem('civiclens_auth_role') || 'citizen';
            const defaultRedirect = intendedRole === 'officer' ? '/admin/overview' : '/my-reports';
            const redirectUrl = sessionStorage.getItem('civiclens_auth_return_url') || defaultRedirect;

            // Clean up session storage
            sessionStorage.removeItem('civiclens_auth_return_url');

            // Brief delay for visual confirmation and smooth state sync
            setTimeout(() => {
              navigate(redirectUrl, { replace: true });
            }, 600);
            return;
          }
        }

        // 3. Check for implicit grant token in hash fragment (#access_token=...)
        if (location.hash && isSupabaseConfigured && supabase) {
          setMessage('Parsing token fragment...');
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            setStatus('error');
            setErrorMessage(error.message);
            return;
          }

          if (session) {
            setStatus('success');
            setMessage('Authenticated! Redirecting...');
            const intendedRole = sessionStorage.getItem('civiclens_auth_role') || 'citizen';
            const defaultRedirect = intendedRole === 'officer' ? '/admin/overview' : '/my-reports';
            const redirectUrl = sessionStorage.getItem('civiclens_auth_return_url') || defaultRedirect;
            sessionStorage.removeItem('civiclens_auth_return_url');

            setTimeout(() => {
              navigate(redirectUrl, { replace: true });
            }, 600);
            return;
          }
        }

        // 4. If Supabase is not configured or running in demonstration mode
        if (!isSupabaseConfigured) {
          setStatus('success');
          setMessage('Synthetic authentication verified. Redirecting to your portal...');
          const intendedRole = sessionStorage.getItem('civiclens_auth_role') || 'citizen';
          const defaultRedirect = intendedRole === 'officer' ? '/admin/overview' : '/my-reports';
          const redirectUrl = sessionStorage.getItem('civiclens_auth_return_url') || defaultRedirect;

          setTimeout(() => {
            navigate(redirectUrl, { replace: true });
          }, 600);
          return;
        }

        // 5. Fallback: check if session already exists
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setStatus('success');
            setMessage('Active session confirmed. Redirecting...');
            const intendedRole = sessionStorage.getItem('civiclens_auth_role') || 'citizen';
            const defaultRedirect = intendedRole === 'officer' ? '/admin/overview' : '/my-reports';
            const redirectUrl = sessionStorage.getItem('civiclens_auth_return_url') || defaultRedirect;
            setTimeout(() => {
              navigate(redirectUrl, { replace: true });
            }, 500);
            return;
          }
        }

        // If reached here with no code, hash, or session:
        setStatus('error');
        setErrorMessage('No authentication credentials found in the callback request.');
      } catch (err: unknown) {
        console.error('Auth callback fatal exception:', err);
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'An unexpected authentication error occurred.');
      }
    }

    handleAuthCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <Card className="max-w-md w-full p-8 text-center space-y-6 soft-card-elevated">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#294563] text-white flex items-center justify-center shadow-soft">
          <Compass className="w-7 h-7 text-[#8EA8C2]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold font-heading text-[#294563]">
            {status === 'processing' && 'Authenticating with CivicLens'}
            {status === 'success' && 'Authentication Successful'}
            {status === 'error' && 'Authentication Issue'}
          </h1>
          <p className="text-sm text-[#687887] leading-relaxed">
            {message}
          </p>
        </div>

        {status === 'processing' && (
          <div className="py-6 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#294563] animate-spin" />
            <span className="text-xs font-medium text-[#7189A4]">
              Securing municipal session with PKCE encryption...
            </span>
          </div>
        )}

        {status === 'success' && (
          <div className="py-4 flex flex-col items-center justify-center gap-2 text-[#4F8665]">
            <CheckCircle2 className="w-10 h-10" />
            <span className="text-xs font-semibold">Redirecting automatically...</span>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 pt-2">
            <div className="p-3.5 rounded-xl bg-[#B85D5D]/10 border border-[#B85D5D]/20 text-[#B85D5D] text-xs text-left flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Sign-in Notice:</strong>
                <span>{errorMessage || 'Unable to complete sign-in. Please try again.'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                onClick={() => navigate('/login', { replace: true })}
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Return to Sign In
              </Button>
              <Link
                to="/"
                className="text-xs text-[#687887] hover:text-[#294563] hover:underline"
              >
                Go to CivicLens Homepage
              </Link>
            </div>
          </div>
        )}

        <div className="border-t border-[#E7E9E5] pt-4 text-[11px] text-[#687887]">
          CivicLens AI • Secure Single Sign-On (Google & Supabase Auth)
        </div>
      </Card>
    </div>
  );
};

