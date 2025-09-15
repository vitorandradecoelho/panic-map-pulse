import VehicleDashboard from "./VehicleDashboard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Home } from "lucide-react";

const VehicleDashboardPage = () => {
  console.log("🚗 VehicleDashboardPage: Componente iniciado");
  
  const navigate = useNavigate();
  console.log("🚗 VehicleDashboardPage: useNavigate inicializado");

  console.log("🚗 VehicleDashboardPage: Renderizando componente...");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Navigation Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Dashboard de Veículos</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Menu Principal</span>
              </Button>
              <Button
                onClick={() => navigate("/alertas")}
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Alertas de Pânico</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <VehicleDashboard />
    </div>
  );
};

export default VehicleDashboardPage;