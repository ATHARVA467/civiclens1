import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from '@/lib/i18n';
import { AuthProvider } from '@/lib/authContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Layouts
import { CitizenLayout } from '@/components/layout/CitizenLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Eager load Homepage for instant First Contentful Paint (FCP / LCP)
import { LandingPage } from '@/pages/citizen/LandingPage';

// Lazy-load secondary citizen routes for optimal bundle code-splitting
const ReportPage = lazy(() => import('@/pages/citizen/ReportPage').then(m => ({ default: m.ReportPage })));
const MyReportsPage = lazy(() => import('@/pages/citizen/MyReportsPage').then(m => ({ default: m.MyReportsPage })));
const TrackReportPage = lazy(() => import('@/pages/citizen/TrackReportPage').then(m => ({ default: m.TrackReportPage })));
const AuthPage = lazy(() => import('@/pages/citizen/AuthPage').then(m => ({ default: m.AuthPage })));
const AuthCallbackPage = lazy(() => import('@/pages/citizen/AuthCallbackPage').then(m => ({ default: m.AuthCallbackPage })));

// Lazy-load admin command centre routes (eliminates Leaflet & Recharts from initial bundle)
const OverviewPage = lazy(() => import('@/pages/admin/OverviewPage').then(m => ({ default: m.OverviewPage })));
const ComplaintsQueuePage = lazy(() => import('@/pages/admin/ComplaintsQueuePage').then(m => ({ default: m.ComplaintsQueuePage })));
const AdminMapPage = lazy(() => import('@/pages/admin/AdminMapPage').then(m => ({ default: m.AdminMapPage })));
const IntelligenceBriefsPage = lazy(() => import('@/pages/admin/IntelligenceBriefsPage').then(m => ({ default: m.IntelligenceBriefsPage })));
const DuplicatesWorkbenchPage = lazy(() => import('@/pages/admin/DuplicatesWorkbenchPage').then(m => ({ default: m.DuplicatesWorkbenchPage })));
const HotspotsPage = lazy(() => import('@/pages/admin/HotspotsPage').then(m => ({ default: m.HotspotsPage })));
const AssignmentsWorkflowPage = lazy(() => import('@/pages/admin/AssignmentsWorkflowPage').then(m => ({ default: m.AssignmentsWorkflowPage })));
const AnalyticsPage = lazy(() => import('@/pages/admin/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));

// Accessible minimal fallback loader
const PageFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading page content"
    className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-3"
  >
    <div className="w-8 h-8 border-3 border-[#294563] border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-semibold text-[#7189A4]">Loading CivicLens AI...</span>
  </div>
);

export function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                {/* Dedicated OAuth Callback Route */}
                <Route path="/auth/callback" element={<AuthCallbackPage />} />

                {/* Citizen Portal (Light Neo-Minimalism Theme) */}
                <Route element={<CitizenLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/report" element={<ReportPage />} />
                  <Route path="/my-reports" element={<MyReportsPage />} />
                  <Route path="/track/:token" element={<TrackReportPage />} />
                  <Route path="/track" element={<TrackReportPage />} />
                  <Route path="/login" element={<AuthPage isRegister={false} />} />
                  <Route path="/register" element={<AuthPage isRegister={true} />} />
                </Route>

                {/* Admin Command Centre (Restrained Dark Theme) */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/overview" replace />} />
                  <Route path="overview" element={<OverviewPage />} />
                  <Route path="complaints" element={<ComplaintsQueuePage />} />
                  <Route path="map" element={<AdminMapPage />} />
                  <Route path="intelligence" element={<IntelligenceBriefsPage />} />
                  <Route path="duplicates" element={<DuplicatesWorkbenchPage />} />
                  <Route path="hotspots" element={<HotspotsPage />} />
                  <Route path="assignments" element={<AssignmentsWorkflowPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;
