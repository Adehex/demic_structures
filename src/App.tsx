import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SiteContentProvider } from './contexts/SiteContentContext';
import { Home } from './pages/Home';
import { AdminPortal } from './pages/admin/AdminPortal';
import { Overview } from './pages/admin/Overview';
import { MediaLibrary } from './pages/admin/MediaLibrary';
import { InquiriesViewer } from './pages/admin/InquiriesViewer';
import { SitesEditor } from './pages/admin/SitesEditor';
import { ProjectsEditor } from './pages/admin/ProjectsEditor';
import { BusinessEditor } from './pages/admin/BusinessEditor';
import { ServicesEditor } from './pages/admin/ServicesEditor';

export function App() {
  return (
    <SiteContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/ademola" element={<AdminPortal />}>
            <Route index element={<Overview />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="inquiries" element={<InquiriesViewer />} />
            <Route path="sites" element={<SitesEditor />} />
            <Route path="projects" element={<ProjectsEditor />} />
            <Route path="business" element={<BusinessEditor />} />
            <Route path="services" element={<ServicesEditor />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </SiteContentProvider>
  );
}