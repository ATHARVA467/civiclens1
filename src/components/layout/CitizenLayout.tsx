import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { ConnectionStatusPill } from '@/components/common/ConnectionStatusPill';
import { PlatformTourModal } from '@/components/common/PlatformTourModal';
import { 
  Building2, 
  PlusCircle, 
  Search, 
  FileText, 
  ShieldCheck, 
  Menu, 
  X,
  Compass,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { clsx } from 'clsx';

export const CitizenLayout: React.FC = () => {
  const { t } = useI18n();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [tourOpen, setTourOpen] = React.useState(false);

  const navLinks = [
    { to: '/', label: t.navHome, icon: <Building2 className="w-4 h-4" /> },
    { to: '/report', label: t.navReport, icon: <PlusCircle className="w-4 h-4" />, highlight: true },
    { to: '/my-reports', label: t.navMyReports, icon: <FileText className="w-4 h-4" /> },
    { to: '/track', label: t.navTrack, icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F5] text-[#263442]">
      {/* Top Notice Bar */}
      <div className="bg-[#294563] text-white/90 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#7C9B85]" />
            <span className="font-medium text-white">CIVICLENS AI</span>
            <span className="hidden sm:inline text-white/70">| {t.tagline}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTourOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors border border-white/20"
              title="Interactive Platform Walkthrough"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#8EA8C2]" />
              <span>Platform Tour</span>
            </button>
            <ConnectionStatusPill />
            <Link
              to="/admin/overview"
              className="inline-flex items-center gap-1 text-white/80 hover:text-white font-medium hover:underline pl-2 text-[11px]"
            >
              <span>{t.navAdmin}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E3E7E8] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#294563] text-white flex items-center justify-center shadow-soft-sm group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-[#8EA8C2]" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-[#294563]">
                CIVIC<span className="text-[#7189A4]">LENS</span>
                <span className="ml-1 text-xs px-1.5 py-0.5 rounded bg-[#294563]/10 text-[#294563] font-mono font-semibold">
                  AI
                </span>
              </div>
              <div className="text-[10px] text-[#687786] tracking-wider uppercase font-medium -mt-1 hidden sm:block">
                Municipal Intelligence Platform
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={clsx(
                    'inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px]',
                    link.highlight
                      ? 'bg-[#294563] text-white hover:bg-[#1f344b] shadow-soft-sm ml-2'
                      : isActive
                        ? 'bg-[#F0F2EF] text-[#294563] font-semibold border border-[#E3E7E8]'
                        : 'text-[#687786] hover:text-[#263442] hover:bg-[#F8F8F5]'
                  )}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            <LanguageToggle />
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-xs font-semibold text-[#294563] border border-[#7189A4]/30 hover:bg-[#7189A4]/10 min-h-[40px]"
            >
              {t.navLogin}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#263442] hover:bg-[#F0F2EF] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#E3E7E8] bg-white px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-4 duration-150">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium min-h-[44px]',
                    link.highlight
                      ? 'bg-[#294563] text-white font-semibold'
                      : isActive
                        ? 'bg-[#F0F2EF] text-[#294563] font-semibold'
                        : 'text-[#687786] hover:bg-[#F8F8F5] text-[#263442]'
                  )}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#E3E7E8] flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-lg text-sm font-semibold border border-[#E3E7E8] text-[#294563]"
              >
                {t.navLogin}
              </Link>
              <Link
                to="/admin/overview"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-lg text-sm font-semibold bg-[#1C2C3D] text-white"
              >
                {t.navAdmin}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile Sticky Bottom Navigation (Mobile-First UX) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E3E7E8] px-2 py-1 shadow-lg flex items-center justify-around">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={clsx(
                'flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[11px] font-medium transition-colors min-h-[48px] min-w-[56px]',
                isActive
                  ? 'text-[#294563] font-semibold'
                  : 'text-[#687786] hover:text-[#263442]'
              )}
            >
              <div className={clsx(
                'p-1 rounded-md mb-0.5',
                isActive ? 'bg-[#294563]/10 text-[#294563]' : ''
              )}>
                {link.icon}
              </div>
              <span className="truncate max-w-[68px]">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Citizen Portal Footer */}
      <footer className="bg-white border-t border-[#E3E7E8] py-8 text-xs text-[#687786]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#294563]" />
              <span className="font-bold text-[#294563]">CIVICLENS AI</span>
              <span>— {t.tagline}</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/report" className="hover:text-[#294563] hover:underline">{t.navReport}</Link>
              <Link to="/track" className="hover:text-[#294563] hover:underline">{t.navTrack}</Link>
              <Link to="/login" className="hover:text-[#294563] hover:underline">Officer Login</Link>
              <Link to="/admin/overview" className="hover:text-[#294563] hover:underline font-semibold text-[#294563]">
                Admin Command Centre
              </Link>
            </div>
          </div>
          <div className="border-t border-[#E3E7E8] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <p>
              Designed for municipal grievance redressal with WCAG 2.2 AA accessibility, bilingual English & Kannada support, and explainable AI prioritization.
            </p>
            <p className="opacity-75">
              Phase 1 Architecture • Database & AI Integration Ready
            </p>
          </div>
        </div>
      </footer>

      {/* Interactive Platform Tour Modal */}
      <PlatformTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  );
};

