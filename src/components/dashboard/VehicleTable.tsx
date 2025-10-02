import { VehicleData } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Truck, MapPin, Clock, Gauge } from "lucide-react";
import { useGeocoding } from "@/hooks/useGeocoding";
import { useTranslation } from "@/hooks/useTranslation";
import { useState, useEffect } from "react";

interface VehicleTableProps {
  vehicles: VehicleData[];
  className?: string;
  isLoading?: boolean;
}

const getSpeedStatus = (t: (key: string) => string, speed?: string) => {
  if (!speed) return { label: "N/A", variant: "secondary" as const, color: "text-muted-foreground" };
  
  const speedNum = parseFloat(speed);
  if (speedNum >= 60) return { label: t('dashboard.table.speed.high'), variant: "destructive" as const, color: "text-destructive" };
  if (speedNum >= 40) return { label: t('dashboard.table.speed.medium'), variant: "default" as const, color: "text-warning" };
  if (speedNum >= 20) return { label: t('dashboard.table.speed.normal'), variant: "secondary" as const, color: "text-success" };
  return { label: t('dashboard.table.speed.low'), variant: "outline" as const, color: "text-info" };
};

export const VehicleTable = ({ vehicles, className, isLoading = false }: VehicleTableProps) => {
  const { t } = useTranslation();
  const { getAddress } = useGeocoding();
  const [addresses, setAddresses] = useState<{ [key: string]: string }>({});

  // Sort vehicles by transmission time (most recent first)
  const sortedVehicles = [...vehicles].sort((a, b) => {
    const parseDate = (dateStr: string) => {
      const [datePart, timePart] = dateStr.split(' ');
      const [day, month, year] = datePart.split('/');
      return new Date(`${year}-${month}-${day}T${timePart}`);
    };
    return parseDate(b.dataTransmissaoS).getTime() - parseDate(a.dataTransmissaoS).getTime();
  });

  // Load addresses for visible vehicles
  useEffect(() => {
    const loadAddresses = async () => {
      const newAddresses: { [key: string]: string } = {};
      
      for (const vehicle of sortedVehicles.slice(0, 500)) { // Limit to first 50 for performance
        const lat = vehicle.gps.coordinates[1];
        const lng = vehicle.gps.coordinates[0];
        const key = vehicle._id;
        
        if (!addresses[key]) {
          try {
            const address = await getAddress(lat, lng);
            newAddresses[key] = address;
          } catch (error) {
            newAddresses[key] = `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`;
          }
        }
      }
      
      if (Object.keys(newAddresses).length > 0) {
        setAddresses(prev => ({ ...prev, ...newAddresses }));
      }
    };

    loadAddresses();
  }, [sortedVehicles, getAddress, addresses]);

  return (
    <Card className={`backdrop-blur-sm bg-card/80 border ${className}`}>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">Eventos de Pânico</h3>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Carregando..." : `${vehicles.length} evento${vehicles.length !== 1 ? 's' : ''} detectado${vehicles.length !== 1 ? 's' : ''}`}
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
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Evento</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Última Transmissão</span>
                  </div>
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Localidade</span>
                  </div>
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Linha</th>
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
                const speedStatus = getSpeedStatus(t, vehicle.velocidadeMedia);
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
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-card-foreground">{vehicle.prefixoVeiculo}</span>
                          {!vehicle.eventoFinalizado && (
                            <Badge variant="destructive" className="text-xs">Ativo</Badge>
                          )}
                          {!vehicle.lido && (
                            <Badge variant="secondary" className="text-xs">Novo</Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {vehicle.nomeEmpresa || `Empresa ${vehicle.empresaId}`}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-card-foreground text-sm">
                          {vehicle.nomeAlerta || "Pânico Ativo"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {vehicle.eventoFinalizado ? "Finalizado" : "Em andamento"}
                        </span>
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
                       <div className="flex flex-col max-w-[200px]">
                         <span className="text-sm text-card-foreground truncate" title={addresses[vehicle._id] || 'Carregando...'}>
                           {addresses[vehicle._id] || 'Carregando...'}
                         </span>
                         <span className="text-xs text-muted-foreground font-mono">
                           {vehicle.gps.coordinates[1].toFixed(4)}°, {vehicle.gps.coordinates[0].toFixed(4)}°
                         </span>
                       </div>
                     </td>
                    <td className="py-4 px-2">
                      <div className="flex flex-col">
                        <Badge variant="outline" className="font-mono w-fit">
                          {vehicle.linha}
                        </Badge>
                        {vehicle.linhaDescricao && (
                          <span className="text-xs text-muted-foreground mt-1 max-w-[150px] truncate" title={vehicle.linhaDescricao}>
                            {vehicle.linhaDescricao}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center h-full">
                        <Badge variant={speedStatus.variant} className="w-fit">
                          {vehicle.velocidadeMedia ? `${parseFloat(vehicle.velocidadeMedia).toFixed(1)} km/h` : speedStatus.label}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {vehicles.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum evento de pânico encontrado</p>
                <p className="text-xs mt-2">Experimente ajustar os filtros de data ou linha</p>
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <p>Carregando eventos de pânico...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};