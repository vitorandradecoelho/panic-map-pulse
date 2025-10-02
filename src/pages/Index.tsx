import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Truck, BarChart3, Gauge } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle query string redirection
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const page = urlParams.get('pg');

    if (page) {
      // Map page codes to actual routes
      const pageRoutes = {
        'dashboardPanico': '/dashboardPanico',
        'dashboardCAN': '/dashboardCAN',
        'alertas': '/alertas'
      };

      const targetRoute = pageRoutes[page as keyof typeof pageRoutes];
      if (targetRoute) {
        // Remove 'pg' parameter and keep all others
        urlParams.delete('pg');
        const remainingParams = urlParams.toString();
        const finalRoute = remainingParams ? `${targetRoute}?${remainingParams}` : targetRoute;

        console.log(`🔄 Redirecionando para: ${finalRoute}`);
        navigate(finalRoute);
      }
    }
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Sistema de Monitoramento</h1>
          <p className="text-lg text-muted-foreground">Gerencie e monitore veículos e alertas de segurança</p>
        </div>

        {/* Menu Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => navigate("/dashboardPanico")}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Dashboard de Pânico</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Monitore eventos de pânico e localização dos veículos em tempo real
              </p>
              <Button className="w-full">
                Acessar Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => navigate("/dashboardCAN")}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mb-4">
                <Gauge className="h-8 w-8 text-info" />
              </div>
              <CardTitle className="text-xl">Dashboard CAN (Volvo)</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Monitore RPM, torque, temperaturas e indicadores do motor
              </p>
              <Button className="w-full" variant="secondary">
                Acessar CAN
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => navigate("/alertas")}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl">Alertas de Pânico</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Gerencie alertas de emergência e monitore situações críticas
              </p>
              <Button className="w-full" variant="destructive">
                Acessar Alertas
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm">Sistema integrado de monitoramento e segurança</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
