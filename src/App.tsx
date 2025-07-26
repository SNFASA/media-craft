import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import NewsIndex from "./pages/admin/news/NewsIndex";
import CreateNews from "./pages/admin/news/CreateNews";
import ViewNews from "./pages/admin/news/ViewNews";
import EventsIndex from "./pages/admin/events/EventsIndex";
import CreateEvent from "./pages/admin/events/CreateEvent";
import ViewEvent from "./pages/admin/events/ViewEvent";
import GalleryIndex from "./pages/admin/gallery/GalleryIndex";
import MediaIndex from "./pages/admin/media/MediaIndex";
import DeanOrganization from "./pages/admin/organization/DeanOrganization";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          } />
          <Route path="/admin/news" element={
            <AdminLayout>
              <NewsIndex />
            </AdminLayout>
          } />
          <Route path="/admin/news/create" element={
            <AdminLayout>
              <CreateNews />
            </AdminLayout>
          } />
          <Route path="/admin/news/:id" element={
            <AdminLayout>
              <ViewNews />
            </AdminLayout>
          } />
          <Route path="/admin/news/:id/edit" element={
            <AdminLayout>
              <CreateNews />
            </AdminLayout>
          } />
          
          {/* Events Routes */}
          <Route path="/admin/events" element={
            <AdminLayout>
              <EventsIndex />
            </AdminLayout>
          } />
          <Route path="/admin/events/create" element={
            <AdminLayout>
              <CreateEvent />
            </AdminLayout>
          } />
          <Route path="/admin/events/:id" element={
            <AdminLayout>
              <ViewEvent />
            </AdminLayout>
          } />
          <Route path="/admin/events/:id/edit" element={
            <AdminLayout>
              <CreateEvent />
            </AdminLayout>
          } />
          <Route path="/admin/gallery" element={
            <AdminLayout>
              <GalleryIndex />
            </AdminLayout>
          } />
          <Route path="/admin/media" element={
            <AdminLayout>
              <MediaIndex />
            </AdminLayout>
          } />
          <Route path="/admin/organization/dean" element={
            <AdminLayout>
              <DeanOrganization />
            </AdminLayout>
          } />
          <Route path="/admin/organization/itc" element={
            <AdminLayout>
              <DeanOrganization />
            </AdminLayout>
          } />

          {/* Redirect root to admin */}
          <Route path="/" element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          } />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
