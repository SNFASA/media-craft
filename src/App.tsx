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
          
          {/* Placeholder for other admin routes */}
          <Route path="/admin/events" element={
            <AdminLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Events Management</h2>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </AdminLayout>
          } />
          <Route path="/admin/gallery" element={
            <AdminLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Gallery Management</h2>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </AdminLayout>
          } />
          <Route path="/admin/media" element={
            <AdminLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Media Manager</h2>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </AdminLayout>
          } />
          <Route path="/admin/organization/dean" element={
            <AdminLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Dean's Organization</h2>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </AdminLayout>
          } />
          <Route path="/admin/organization/itc" element={
            <AdminLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">ITC Organization</h2>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
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
