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
    <div className="min-h-screen flex flex-col bg-[#070B14] text-[#F3F4F6] selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Accessible Skip to Content Link (WCAG 2.2 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-slate-950 focus:font-bold focus:rounded-xl focus:shadow-[0_0_20px_rgba(6,182,212,0.6)] focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Futuristic Telemetry HUD Bar */}
      <div className="bg-[#0B0F19]/95 text-cyan-300/90 text-xs py-1.5 px-4 border-b border-cyan-500/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-mono font-bold text-white tracking-widest text-[11px]">CIVICLENS AI • v2030</span>
            <span className="hidden sm:inline text-cyan-400/60 font-mono text-[11px]">| LIVE SMART CITY TELEMETRY ACTIVE</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTourOpen(true)}
              aria-label="Open Interactive Platform Tour"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-[11px] font-mono transition-colors border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
              title="Interactive Platform Walkthrough"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Platform Tour</span>
            </button>
            <ConnectionStatusPill />
            <Link
              to="/admin/overview"
              className="inline-flex items-center gap-1 text-cyan-300/80 hover:text-cyan-200 font-mono hover:underline pl-2 text-[11px]"
            >
              <span>{t.navAdmin}</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Glass Header */}
      <header className="sticky top-0 z-40 bg-[#070B14]/85 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-violet-600/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all">
              <Compass className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="text-xl font-bold font-heading tracking-tight text-white flex items-center gap-1.5">
                <span>CIVIC<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">LENS</span></span>
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-cyan-400/40 bg-cyan-950/60 text-cyan-300 font-mono font-bold tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  AI
                </span>
              </div>
              <div className="text-[9px] text-cyan-400/60 tracking-widest uppercase font-mono hidden sm:block">
                Smart City Governance • Redressal HUD
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
                    'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono tracking-wide transition-all min-h-[42px]',
                    link.highlight
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] ml-2 border border-cyan-300/40'
                      : isActive
                        ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
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
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-[#0E1726]/80 hover:bg-[#162238] transition-all text-xs font-mono text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.1)] min-h-[40px]"
                >
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={`${profile.fullName || 'User'} profile avatar`}
                      width={24}
                      height={24}
                      loading="lazy"
                      decoding="async"
                      className="w-6 h-6 rounded-full object-cover border border-cyan-500/40"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-[10px] font-bold font-mono">
                      {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden sm:inline max-w-[120px] truncate text-slate-200">
                    {profile?.fullName || user.email?.split('@')[0]}
                  </span>
                  <span className={clsx(
                    'text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider',
                    role === 'officer' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                  )}>
                    {role === 'officer' ? 'Officer' : 'Citizen'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0E1726]/95 border border-cyan-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] py-2 z-50 backdrop-blur-xl animate-in fade-in-50 slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-cyan-500/20">
                      <div className="text-xs font-bold text-white truncate">
                        {profile?.fullName || 'Authenticated User'}
                      </div>
                      <div className="text-[11px] text-cyan-300/70 font-mono truncate">
                        {user.email}
                      </div>
                    </div>

                    <Link
                      to="/my-reports"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-cyan-950/40 flex items-center gap-2 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>My Reports & Grievances</span>
                    </Link>

                    {role === 'officer' && (
                      <Link
                        to="/admin/overview"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-xs text-cyan-300 font-semibold hover:bg-cyan-950/50 flex items-center gap-2 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Officer Command Centre</span>
                      </Link>
                    )}

                    <div className="border-t border-cyan-500/20 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 font-medium transition-colors"
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
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-mono font-bold text-cyan-300 border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 hover:border-cyan-400 transition-all min-h-[40px] shadow-[0_0_12px_rgba(6,182,212,0.15)]"
              >
                {t.navLogin}
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 min-h-[44px] min-w-[44px] flex items-center justify-center border border-cyan-500/20"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-cyan-500/20 bg-[#0B0F19]/95 px-4 pt-2 pb-4 space-y-1 backdrop-blur-xl animate-in slide-in-from-top-4 duration-150">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide min-h-[44px]',
                    link.highlight
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold'
                      : isActive
                        ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                  )}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-cyan-500/20 flex gap-2">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex-1 text-center py-2.5 rounded-xl text-xs font-mono font-semibold border border-rose-500/30 text-rose-400 bg-rose-950/20"
                >
                  Sign Out ({profile?.fullName || user.email?.split('@')[0]})
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl text-xs font-mono font-bold border border-cyan-500/40 text-cyan-300 bg-cyan-950/30"
                >
                  {t.navLogin}
                </Link>
              )}
              <Link
                to="/admin/overview"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl text-xs font-mono font-bold bg-[#1C2C3D] text-white border border-slate-700"
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070B14]/90 backdrop-blur-xl border-t border-cyan-500/20 px-2 py-1 shadow-2xl flex items-center justify-around">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={clsx(
                'flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-mono transition-colors min-h-[48px] min-w-[56px]',
                isActive
                  ? 'text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <div className={clsx(
                'p-1 rounded-lg mb-0.5',
                isActive ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : ''
              )}>
                {link.icon}
              </div>
              <span className="truncate max-w-[68px]">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Professional 2030 Futuristic Telemetry Footer */}
      <footer className="bg-[#0B0F19]/90 border-t border-cyan-500/20 pt-12 pb-8 text-xs text-slate-400 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Identity & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <span className="font-bold font-heading text-white text-sm tracking-wide">CIVICLENS AI • 2030</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Next-generation Smart City and Civic Governance Platform. Powered by explainable AI triage, geospatial DBSCAN telemetry, and automated citizen grievance redressal.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-cyan-300 font-mono">
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sakala Services Act Compliant</span>
              </div>
            </div>

            {/* Col 2: Citizen Portals */}
            <div className="space-y-2">
              <div className="font-mono font-bold text-xs uppercase tracking-wider text-cyan-400">
                Citizen Telemetry Portals
              </div>
              <ul className="space-y-1.5 font-mono text-[11px]">
                <li><Link to="/report" className="hover:text-cyan-300 hover:underline">Lodge Civic Grievance</Link></li>
                <li><Link to="/track" className="hover:text-cyan-300 hover:underline">Track Complaint by Token</Link></li>
                <li><Link to="/my-reports" className="hover:text-cyan-300 hover:underline">My Tracked Issues</Link></li>
                <li><Link to="/login" className="hover:text-cyan-300 hover:underline">Citizen Sign In (Google / Email)</Link></li>
              </ul>
            </div>

            {/* Col 3: Official State Portals */}
            <div className="space-y-2">
              <div className="font-mono font-bold text-xs uppercase tracking-wider text-cyan-400">
                Connected Karnataka Gateways
              </div>
              <ul className="space-y-1.5 font-mono text-[11px]">
                <li>
                  <a href="https://sevasindhu.karnataka.gov.in" target="_blank" rel="noreferrer" className="hover:text-cyan-300 hover:underline inline-flex items-center gap-1">
                    <span>Seva Sindhu</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="http://sakala.kar.nic.in" target="_blank" rel="noreferrer" className="hover:text-cyan-300 hover:underline inline-flex items-center gap-1">
                    <span>Sakala Mission</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="https://bhoomi.karnataka.gov.in" target="_blank" rel="noreferrer" className="hover:text-cyan-300 hover:underline inline-flex items-center gap-1">
                    <span>Bhoomi Land Records</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="https://kaveri.karnataka.gov.in" target="_blank" rel="noreferrer" className="hover:text-cyan-300 hover:underline inline-flex items-center gap-1">
                    <span>Kaveri 2.0 Registration</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Municipal Triage & Helplines */}
            <div className="space-y-2">
              <div className="font-mono font-bold text-xs uppercase tracking-wider text-cyan-400">
                Emergency Telemetry Nodes
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Police / Emergency: <strong className="text-white">112</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                  <span>BBMP Sahaya 2.0: <strong className="text-white">1533 / 1902</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sakala Help Desk: <strong className="text-white">080 4455 4455</strong></span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin/overview"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 hover:text-cyan-200 hover:underline"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Officer Command Centre</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-cyan-500/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
            <p>
              CivicLens AI • Designed for 2030 Smart City Governance • WCAG 2.2 AA • Kannada & English Bilingual
            </p>
            <p className="opacity-80">
              © {new Date().getFullYear()} CivicLens AI. All systems nominal.
            </p>
          </div>
        </div>
      </footer>

      {/* Interactive Platform Tour Modal */}
      <PlatformTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  );
};
