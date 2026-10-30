import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from '@/lib/i18n';

// Layouts
import { CitizenLayout } from '@/components/layout/CitizenLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Citizen Pages
import { LandingPage } from '@/pages/citizen/LandingPage';
import { ReportPage } from '@/pages/citizen/ReportPage';
import { MyReportsPage } from '@/pages/citizen/MyReportsPage';
import { TrackReportPage } from '@/pages/citizen/TrackReportPage';
import { AuthPage } from '@/pages/citizen/AuthPage';

// Admin Pages
import { OverviewPage } from '@/pages/admin/OverviewPage';
import { ComplaintsQueuePage } from '@/pages/admin/ComplaintsQueuePage';
import { AdminMapPage } from '@/pages/admin/AdminMapPage';
import { IntelligenceBriefsPage } from '@/pages/admin/IntelligenceBriefsPage';
import { DuplicatesWorkbenchPage } from '@/pages/admin/DuplicatesWorkbenchPage';
import { HotspotsPage } from '@/pages/admin/HotspotsPage';
import { AssignmentsWorkflowPage } from '@/pages/admin/AssignmentsWorkflowPage';
import { AnalyticsPage } from '@/pages/admin/AnalyticsPage';

export function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
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
      </BrowserRouter>
    </I18nProvider>
  );
}

export default App;
