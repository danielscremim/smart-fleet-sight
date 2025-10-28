
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TruckProvider } from "@/contexts/TruckContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import Home from './pages/Home';
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/Inicio";
import DashboardPage from "./pages/DashboardPage";
import PlateReaderPage from "./pages/PlateReaderPage";
import RealTimePlateReader from "./pages/RealTimePlateReader";
import Inicio from "./pages/Inicio";
import ApiDocs from './pages/ApiDocs';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <TruckProvider>
          <BrowserRouter>
            <Routes>
              {/* Página institucional pública */}
              <Route path="/" element={<Home />} />

              {/* Página de autenticação */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Redirecionamentos para rotas antigas de login/registro */}
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              <Route path="/register" element={<Navigate to="/auth" replace />} />

              {/* Home interna protegida */}
              <Route path="/inicio" element={
                <ProtectedRoute>
                  <Layout>
                    <Inicio />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/plate-reader" element={
                <ProtectedRoute>
                  <Layout>
                    <PlateReaderPage />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/real-time-reader" element={
                <ProtectedRoute>
                  <Layout>
                    <RealTimePlateReader />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Página não encontrada */}
              <Route path="*" element={<NotFound />} />
              <Route path="/api-docs" element={<ApiDocs />} />
            </Routes>
          </BrowserRouter>
        </TruckProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
