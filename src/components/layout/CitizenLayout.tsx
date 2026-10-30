import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/authContext';
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
  HelpCircle,
  LogOut,
  User,
  Sparkles,
  PhoneCall,
  ExternalLink,
  Scale
} from 'lucide-react';
import { clsx } from 'clsx';

export const CitizenLayout: React.FC = () => {
  const { t } = useI18n();
  const { user, profile, role, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [tourOpen, setTourOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const navLinks = [
    { to: '/', label: t.navHome, icon: <Building2 className="w-4 h-4" /> },
    { to: '/report', label: t.navReport, icon: <PlusCircle className="w-4 h-4" />, highlight: true },
    { to: '/my-reports', label: t.navMyReports, icon: <FileText className="w-4 h-4" /> },
    { to: '/track', label: t.navTrack, icon: <Search className="w-4 h-4" /> },
  ];

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await signOut();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F5] text-[#253342]">
      {/* Accessible Skip to Content Link (WCAG 2.2 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#294563] focus:text-white focus:font-semibold focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Top Notice Bar */}
      <div className="bg-[#294563] text-white/90 text-xs py-1.5 px-4 border-b border-[#294563]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#7C9B85]" />
            <span className="font-semibold text-white tracking-wide">CIVICLENS AI</span>
            <span className="hidden sm:inline text-white/70">| {t.tagline}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTourOpen(true)}
              aria-label="Open Interactive Platform Tour"
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7E9E5] shadow-soft-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#294563] text-white flex items-center justify-center shadow-soft-sm group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-[#8EA8C2]" />
            </div>
            <div>
              <div className="text-xl font-bold font-heading tracking-tight text-[#294563]">
                CIVIC<span className="text-[#7189A4]">LENS</span>
                <span className="ml-1 text-xs px-1.5 py-0.5 rounded-md bg-[#294563]/10 text-[#294563] font-mono font-semibold">
                  AI
                </span>
              </div>
              <div className="text-[10px] text-[#687887] tracking-wider uppercase font-medium -mt-1 hidden sm:block">
                Civic Intelligence & Public Services
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
                    'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all min-h-[42px]',
                    link.highlight
                      ? 'bg-[#294563] text-white hover:bg-[#1f344b] shadow-soft-sm ml-2 font-semibold'
                      : isActive
                        ? 'bg-[#F1F3EF] text-[#294563] font-semibold border border-[#E7E9E5]'
                        : 'text-[#687887] hover:text-[#253342] hover:bg-[#F8F8F5]'
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

            {/* Auth User Status or Sign-in button */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="User account menu"
                  aria-expanded={userDropdownOpen}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E7E9E5] bg-white hover:bg-[#F1F3EF] transition-all text-xs font-semibold text-[#253342] shadow-soft-sm min-h-[40px]"
                >
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={`${profile.fullName || 'User'} profile avatar`}
                      width={24}
                      height={24}
                      loading="lazy"
                      decoding="async"
                      className="w-6 h-6 rounded-full object-cover border border-[#E7E9E5]"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#294563] text-white flex items-center justify-center text-[10px] font-bold">
                      {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {profile?.fullName || user.email?.split('@')[0]}
                  </span>
                  <span className={clsx(
                    'text-[10px] px-1.5 py-0.5 rounded font-mono',
                    role === 'officer' ? 'bg-[#1C2C3D] text-[#8EA8C2]' : 'bg-[#7C9B85]/20 text-[#4F8665]'
                  )}>
                    {role === 'officer' ? 'Officer' : 'Citizen'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E7E9E5] shadow-soft-lg py-2 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-[#E7E9E5]">
                      <div className="text-xs font-bold text-[#294563] truncate">
                        {profile?.fullName || 'Authenticated User'}
                      </div>
                      <div className="text-[11px] text-[#687887] truncate">
                        {user.email}
                      </div>
                    </div>

                    <Link
                      to="/my-reports"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs text-[#253342] hover:bg-[#F1F3EF] flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#7189A4]" />
                      <span>My Reports & Grievances</span>
                    </Link>

                    {role === 'officer' && (
                      <Link
                        to="/admin/overview"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-xs text-[#294563] font-semibold hover:bg-[#F1F3EF] flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#294563]" />
                        <span>Officer Command Centre</span>
                      </Link>
                    )}

                    <div className="border-t border-[#E7E9E5] mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-xs text-[#B85D5D] hover:bg-[#B85D5D]/10 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold text-[#294563] border border-[#7189A4]/30 bg-white hover:bg-[#F1F3EF] transition-all min-h-[40px] shadow-soft-sm"
              >
                {t.navLogin}
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#253342] hover:bg-[#F1F3EF] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#E7E9E5] bg-white px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-4 duration-150">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium min-h-[44px]',
                    link.highlight
                      ? 'bg-[#294563] text-white font-semibold'
                      : isActive
                        ? 'bg-[#F1F3EF] text-[#294563] font-semibold'
                        : 'text-[#687887] hover:bg-[#F8F8F5] text-[#253342]'
                  )}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#E7E9E5] flex gap-2">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold border border-[#E7E9E5] text-[#B85D5D]"
                >
                  Sign Out ({profile?.fullName || user.email?.split('@')[0]})
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold border border-[#E7E9E5] text-[#294563]"
                >
                  {t.navLogin}
                </Link>
              )}
              <Link
                to="/admin/overview"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold bg-[#1C2C3D] text-white"
              >
                {t.navAdmin}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 pb-16 md:pb-8 focus:outline-none">
        <Outlet />
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E7E9E5] px-2 py-1 shadow-lg flex items-center justify-around">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={clsx(
                'flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[11px] font-medium transition-colors min-h-[48px] min-w-[56px]',
                isActive
                  ? 'text-[#294563] font-semibold'
                  : 'text-[#687887] hover:text-[#253342]'
              )}
            >
              <div className={clsx(
                'p-1 rounded-lg mb-0.5',
                isActive ? 'bg-[#294563]/10 text-[#294563]' : ''
              )}>
                {link.icon}
              </div>
              <span className="truncate max-w-[68px]">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Professional Editorial Footer */}
      <footer className="bg-white border-t border-[#E7E9E5] pt-12 pb-8 text-xs text-[#687887]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Identity & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#294563]" />
                <span className="font-bold font-heading text-[#294563] text-sm">CIVICLENS AI</span>
              </div>
              <p className="text-xs leading-relaxed text-[#687887]">
                AI-powered Civic Intelligence and Public Issue Resolution Platform. Transforming citizen complaints into explainable, prioritized municipal actions.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-[#7189A4]">
                <Scale className="w-3.5 h-3.5" />
                <span>Sakala Services Act Compliant</span>
              </div>
            </div>

            {/* Col 2: Citizen Portals */}
            <div className="space-y-2">
              <div className="font-bold text-xs uppercase tracking-wider text-[#294563]">
                Citizen Services
              </div>
              <ul className="space-y-1.5">
                <li><Link to="/report" className="hover:text-[#294563] hover:underline">Lodge Civic Grievance</Link></li>
                <li><Link to="/track" className="hover:text-[#294563] hover:underline">Track Complaint by Token</Link></li>
                <li><Link to="/my-reports" className="hover:text-[#294563] hover:underline">My Tracked Issues</Link></li>
                <li><Link to="/login" className="hover:text-[#294563] hover:underline">Citizen Sign In (Google / Email)</Link></li>
              </ul>
            </div>

            {/* Col 3: Official State Portals */}
            <div className="space-y-2">
              <div className="font-bold text-xs uppercase tracking-wider text-[#294563]">
                Karnataka Portals
              </div>
              <ul className="space-y-1.5">
                <li>
                  <a href="https://sevasindhu.karnataka.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#294563] hover:underline inline-flex items-center gap-1">
                    <span>Seva Sindhu</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="http://sakala.kar.nic.in" target="_blank" rel="noreferrer" className="hover:text-[#294563] hover:underline inline-flex items-center gap-1">
                    <span>Sakala Mission</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="https://bhoomi.karnataka.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#294563] hover:underline inline-flex items-center gap-1">
                    <span>Bhoomi Land Records</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="https://kaveri.karnataka.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#294563] hover:underline inline-flex items-center gap-1">
                    <span>Kaveri 2.0 Registration</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Municipal Triage & Helplines */}
            <div className="space-y-2">
              <div className="font-bold text-xs uppercase tracking-wider text-[#294563]">
                Emergency Helplines
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#4F8665]" />
                  <span>Police / Emergency: <strong>112</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#7189A4]" />
                  <span>BBMP Sahaya 2.0: <strong>1533 / 1902</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#B9853F]" />
                  <span>Sakala Help Desk: <strong>080 4455 4455</strong></span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin/overview"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#294563] hover:underline"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Officer Command Centre</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E7E9E5] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#687887]">
            <p>
              CivicLens AI • Designed with WCAG 2.2 AA accessibility, bilingual English & Kannada support, and explainable AI prioritization.
            </p>
            <p className="opacity-80">
              © {new Date().getFullYear()} CivicLens AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Interactive Platform Tour Modal */}
      <PlatformTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  );
};
