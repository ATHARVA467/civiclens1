import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useI18n } from '@/lib/i18n';
import { Compass, ShieldCheck, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export const AuthPage: React.FC<{ isRegister?: boolean }> = ({ isRegister = false }) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [role, setRole] = useState<'citizen' | 'officer'>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'officer') {
      navigate('/admin/overview');
    } else {
      navigate('/my-reports');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Card className="p-6 sm:p-8 soft-card-elevated space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#294563] text-white mx-auto flex items-center justify-center shadow-soft-sm">
            <Compass className="w-6 h-6 text-[#8EA8C2]" />
          </div>
          <h1 className="text-2xl font-bold text-[#294563]">
            {isRegister ? 'Create CivicLens Account' : 'Sign In to CivicLens'}
          </h1>
          <p className="text-xs text-[#687786]">
            {role === 'citizen'
              ? 'Track private grievances and receive automated resolution alerts.'
              : 'Municipal officer credentials for administrative triage and action dispatch.'}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F0F2EF] border border-[#E3E7E8]">
          <button
            type="button"
            onClick={() => setRole('citizen')}
            className={clsx(
              'py-2 rounded-lg text-xs font-semibold transition-all min-h-[40px]',
              role === 'citizen'
                ? 'bg-white text-[#294563] shadow-soft-sm'
                : 'text-[#687786] hover:text-[#263442]'
            )}
          >
            Citizen
          </button>
          <button
            type="button"
            onClick={() => setRole('officer')}
            className={clsx(
              'py-2 rounded-lg text-xs font-semibold transition-all min-h-[40px]',
              role === 'officer'
                ? 'bg-[#1C2C3D] text-white shadow-soft-sm'
                : 'text-[#687786] hover:text-[#263442]'
            )}
          >
            Municipal Officer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#263442] uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ravi Kumar"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#E3E7E8] text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] min-h-[44px]"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#263442] uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'officer' ? 'officer@civiclens.gov' : 'citizen@example.com'}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#E3E7E8] text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] min-h-[44px]"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#263442] uppercase tracking-wider">
                Password
              </label>
              {!isRegister && (
                <a href="#reset" className="text-xs text-[#7189A4] hover:underline">
                  Forgot?
                </a>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#E3E7E8] text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] min-h-[44px]"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isRegister ? 'Register Account' : role === 'officer' ? 'Access Command Centre' : 'Sign In'}
          </Button>

          <div className="pt-2 text-center text-xs text-[#687786]">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#294563] underline">
                  Sign in
                </Link>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-[#294563] underline">
                  Register as Citizen
                </Link>
              </span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

