import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Truck, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Sistema de Monitoramento</h1>
          <p className="text-lg text-muted-foreground">Gerencie e monitore veículos e alertas de segurança</p>
        </div>

        {/* Menu Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => navigate("/dashboard")}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Dashboard de Veículos</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Monitore localização, status e desempenho dos veículos em tempo real
              </p>
              <Button className="w-full">
                Acessar Dashboard
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
