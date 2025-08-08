import { VehicleData } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Truck, MapPin, Clock, Gauge } from "lucide-react";

interface VehicleTableProps {
  vehicles: VehicleData[];
  className?: string;
}

const getSpeedStatus = (speed?: string) => {
  if (!speed) return { label: "N/A", variant: "secondary" as const, color: "text-muted-foreground" };
  
  const speedNum = parseFloat(speed);
  if (speedNum >= 60) return { label: "Alta", variant: "destructive" as const, color: "text-destructive" };
  if (speedNum >= 40) return { label: "Média", variant: "default" as const, color: "text-warning" };
  if (speedNum >= 20) return { label: "Normal", variant: "secondary" as const, color: "text-success" };
  return { label: "Baixa", variant: "outline" as const, color: "text-info" };
};

export const VehicleTable = ({ vehicles, className }: VehicleTableProps) => {
  // Sort vehicles by transmission time (most recent first)
  const sortedVehicles = [...vehicles].sort((a, b) => {
    const parseDate = (dateStr: string) => {
      const [datePart, timePart] = dateStr.split(' ');
      const [day, month, year] = datePart.split('/');
      return new Date(`${year}-${month}-${day}T${timePart}`);
    };
    return parseDate(b.dataTransmissaoS).getTime() - parseDate(a.dataTransmissaoS).getTime();
  });

  return (
    <Card className={`backdrop-blur-sm bg-card/80 border ${className}`}>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">Veículos Monitorados</h3>
          <p className="text-sm text-muted-foreground">
            {vehicles.length} veículo{vehicles.length !== 1 ? 's' : ''} em tempo real
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4" />
                    <span>Veículo</span>
                  </div>
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Última Transmissão</span>
                  </div>
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Localização</span>
                  </div>
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Linha</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Motorista</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Gauge className="h-4 w-4" />
                    <span>Velocidade</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedVehicles.map((vehicle) => {
                const speedStatus = getSpeedStatus(vehicle.velocidadeMedia);
                const parseDate = (dateStr: string) => {
                  const [datePart, timePart] = dateStr.split(' ');
                  const [day, month, year] = datePart.split('/');
                  return new Date(`${year}-${month}-${day}T${timePart}`);
                };
                const transmissionDate = parseDate(vehicle.dataTransmissaoS);
                
                return (
                  <tr key={vehicle._id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-card-foreground">{vehicle.prefixoVeiculo}</span>
                        <span className="text-xs text-muted-foreground">Empresa {vehicle.empresaId}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex flex-col">
                        <span className="text-sm text-card-foreground">
                          {format(transmissionDate, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(transmissionDate, "HH:mm:ss", { locale: ptBR })}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex flex-col">
                        <span className="text-sm text-card-foreground font-mono">
                          {vehicle.gps.coordinates[1].toFixed(6)}°
                        </span>
                        <span className="text-sm text-card-foreground font-mono">
                          {vehicle.gps.coordinates[0].toFixed(6)}°
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <Badge variant="outline" className="font-mono">
                        {vehicle.linha}
                      </Badge>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-sm text-card-foreground">
                        {vehicle.motorista || "Não informado"}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex flex-col">
                        <Badge variant={speedStatus.variant} className="w-fit">
                          {speedStatus.label}
                        </Badge>
                        {vehicle.velocidadeMedia && (
                          <span className="text-xs text-muted-foreground mt-1">
                            {parseFloat(vehicle.velocidadeMedia).toFixed(1)} km/h
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {vehicles.length === 0 && (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum veículo encontrado</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};