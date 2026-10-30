import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  MapPin, 
  Sparkles, 
  CopyCheck, 
  Flame, 
  Users, 
  BarChart3, 
  Compass, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Bell
} from 'lucide-react';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { ConnectionStatusPill } from '@/components/common/ConnectionStatusPill';
import { clsx } from 'clsx';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const adminRoutes = [
    {
      to: '/admin/overview',
      label: 'Overview & Triage',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: 'Live'
    },
    {
      to: '/admin/complaints',
      label: 'Complaint Queue',
      icon: <Inbox className="w-4 h-4" />,
      badge: '50'
    },
    {
      to: '/admin/map',
      label: 'Geographic GIS',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      to: '/admin/intelligence',
      label: 'AI Action Briefs',
      icon: <Sparkles className="w-4 h-4" />,
      highlight: true
    },
    {
      to: '/admin/duplicates',
      label: 'Duplicate Detector',
      icon: <CopyCheck className="w-4 h-4" />,
      badge: '4 pairs'
    },
    {
      to: '/admin/hotspots',
      label: 'Hotspots & Clusters',
      icon: <Flame className="w-4 h-4" />,
      badge: '3 zones'
    },
    {
      to: '/admin/assignments',
      label: 'Department Workflow',
      icon: <Users className="w-4 h-4" />,
    },
    {
      to: '/admin/analytics',
      label: 'Resolution Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="dark min-h-screen flex bg-[#111A24] text-[#F3F5F6] antialiased selection:bg-[#8EA8C2]/30 selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-[#172332] border-r border-[#304153] transition-all duration-300',
          mobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0',
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#304153]">
          <Link to="/admin/overview" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1C2C3D] border border-[#304153] text-[#8EA8C2] flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-[#8EA8C2]" />
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <div className="text-base font-bold tracking-tight text-[#F3F5F6] flex items-center gap-1.5">
                  CIVIC<span className="text-[#8EA8C2]">LENS</span>
                  <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-[#304153] text-[#8EA8C2]">
                    Ops
                  </span>
                </div>
                <div className="text-[10px] text-[#A8B5C1] tracking-wider uppercase font-medium truncate">
                  Command Centre
                </div>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-[#A8B5C1] hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-semibold text-[#A8B5C1] uppercase tracking-wider">
              Intelligence Operations
            </div>
          )}

          {adminRoutes.map((route) => {
            const isActive = location.pathname === route.to;
            return (
              <Link
                key={route.to}
                to={route.to}
                onClick={() => setMobileSidebarOpen(false)}
                title={sidebarCollapsed ? route.label : undefined}
                className={clsx(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group min-h-[44px]',
                  isActive
                    ? 'bg-[#1C2C3D] text-white border border-[#304153] shadow-sm'
                    : 'text-[#A8B5C1] hover:text-[#F3F5F6] hover:bg-[#1C2C3D]/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      'p-1 rounded-md transition-colors',
                      isActive ? 'text-[#8EA8C2]' : 'text-[#A8B5C1] group-hover:text-white'
                    )}
                  >
                    {route.icon}
                  </span>
                  {!sidebarCollapsed && <span className="truncate">{route.label}</span>}
                </div>

                {!sidebarCollapsed && route.badge && (
                  <span
                    className={clsx(
                      'text-[10px] font-mono px-2 py-0.5 rounded-full border',
                      route.badge === 'Live'
                        ? 'bg-[#7C9B85]/20 text-[#7C9B85] border-[#7C9B85]/40 animate-pulse'
                        : 'bg-[#304153] text-[#A8B5C1] border-[#304153]'
                    )}
                  >
                    {route.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#304153] space-y-2">
          <Link
            to="/"
            className={clsx(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#A8B5C1] hover:text-white hover:bg-[#1C2C3D] transition-colors min-h-[40px]',
              sidebarCollapsed ? 'justify-center' : ''
            )}
            title="Return to Citizen Portal"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-[#8EA8C2]" />
            {!sidebarCollapsed && <span>Citizen Portal</span>}
          </Link>

          {!sidebarCollapsed && (
            <div className="px-3 pt-2 border-t border-[#304153]/50 flex items-center justify-between text-[11px] text-[#A8B5C1]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7C9B85]" />
                Municipal Officer
              </span>
              <span className="font-mono text-[10px] opacity-75">v1.0.0</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={clsx(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        {/* Admin Top Header */}
        <header className="h-16 bg-[#172332] border-b border-[#304153] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#A8B5C1] hover:text-white hover:bg-[#1C2C3D] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-lg text-[#A8B5C1] hover:text-white hover:bg-[#1C2C3D] transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label="Toggle sidebar width"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-[#A8B5C1]">
              <span className="hidden sm:inline">Authority Command Centre</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#304153] hidden sm:inline" />
              <span className="text-white font-medium capitalize">
                {location.pathname.replace('/admin/', '').replace('-', ' ') || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ConnectionStatusPill isDark={true} />
            <LanguageToggle isDark={true} />
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8EA8C2] bg-[#1C2C3D] border border-[#304153] hover:bg-[#25394e] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
