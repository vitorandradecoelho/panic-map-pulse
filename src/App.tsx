import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import VehicleDashboardPage from "./pages/VehicleDashboardPage";
import AlertsMonitoring from "./pages/AlertsMonitoring";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Não tentar novamente em casos de 401 ou 403
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    },
  },
});

// Componente interno que usa o contexto de autenticação
const AppContent = () => {
  const { login, isLoading, error, clearError } = useAuthContext();

  useEffect(() => {
    // Inicializar aplicação tentando autenticar
    const initializeApp = async () => {
      try {
        const success = await login();
        if (!success) {
          console.log("🔄 Executando em modo demo sem autenticação");
        }
      } catch (error) {
        console.error("❌ Erro na inicialização:", error);
        // App continua funcionando em modo demo
      }
    };

    initializeApp();
  }, [login]);

  // Mostrar tela de loading durante inicialização
  if (isLoading) {
    return <LoadingScreen message="Inicializando sistema..." />;
  }

  // Mostrar tela de erro se houver erro crítico
  if (error && error.includes('crítico')) {
    return (
      <ErrorScreen 
        message={error} 
        onRetry={() => {
          clearError();
          window.location.reload();
        }}
      />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboardPanico" element={<VehicleDashboardPage />} />
        <Route path="/alertas" element={<AlertsMonitoring />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
