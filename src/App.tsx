import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
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
import ItcOrganization from "./pages/admin/organization/ItcOrganization";
import CreateGallery from "./pages/admin/gallery/CreateGallery";
import ViewGallery from "./pages/admin/gallery/ViewGallery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Login Route */}
            <Route path="/login" element={<Login />} />
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/news" element={
              <ProtectedRoute>
                <AdminLayout>
                  <NewsIndex />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/news/create" element={
              <ProtectedRoute>
                <AdminLayout>
                  <CreateNews />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/news/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ViewNews />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/news/:id/edit" element={
              <ProtectedRoute>
                <AdminLayout>
                  <CreateNews />
                </AdminLayout>
              </ProtectedRoute>
            } />
          
            {/* Events Routes */}
            <Route path="/admin/events" element={
              <ProtectedRoute>
                <AdminLayout>
                  <EventsIndex />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events/create" element={
              <ProtectedRoute>
                <AdminLayout>
                  <CreateEvent />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ViewEvent />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events/:id/edit" element={
              <ProtectedRoute>
                <AdminLayout>
                  <CreateEvent />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/gallery" element={
              <ProtectedRoute>
                <AdminLayout>
                  <GalleryIndex />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/gallery/create" element={
              <ProtectedRoute>
                <AdminLayout>
                  <CreateGallery />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/gallery/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ViewGallery />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/gallery/:id/edit" element={
              <ProtectedRoute>
                <AdminLayout>
                  <CreateGallery />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/media" element={
              <ProtectedRoute>
                <AdminLayout>
                  <MediaIndex />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/organization/dean" element={
              <ProtectedRoute>
                <AdminLayout>
                  <DeanOrganization />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/organization/itc" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ItcOrganization />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* Redirect root to admin */}
            <Route path="/" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
