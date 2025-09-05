import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { initGetLocalStorage } from "@/services/auth";
import Index from "./pages/Index";
import VehicleDashboardPage from "./pages/VehicleDashboardPage";
import AlertsMonitoring from "./pages/AlertsMonitoring";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Inicializar dados do usuário na abertura da aplicação
    const initializeApp = async () => {
      try {
        await initGetLocalStorage();
      } catch (error) {
        console.error("Erro ao inicializar dados do usuário:", error);
      }
    };

    initializeApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboardPanico" element={<VehicleDashboardPage />} />
            <Route path="/alertas" element={<AlertsMonitoring />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
