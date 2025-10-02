import VehicleDashboard from "./VehicleDashboard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Home } from "lucide-react";

const VehicleDashboardPage = () => {
  const navigate = useNavigate();

  return ( <VehicleDashboard />);
};

export default VehicleDashboardPage;