import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PanicAlert } from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertsTableProps {
  alerts: PanicAlert[];
  className?: string;
}

const severityConfig = {
  low: { label: 'Baixo', variant: 'secondary' as const, color: 'text-success' },
  medium: { label: 'Médio', variant: 'default' as const, color: 'text-warning' },
  high: { label: 'Alto', variant: 'destructive' as const, color: 'text-danger' },
  critical: { label: 'Crítico', variant: 'destructive' as const, color: 'text-danger' }
};

export const AlertsTable = ({ alerts, className }: AlertsTableProps) => {
  const sortedAlerts = [...alerts].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card className={cn("backdrop-blur-sm bg-card/80 border", className)}>
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold flex items-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          Alertas Recentes
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {alerts.length} alertas encontrados
        </p>
      </div>
      
      <div className="overflow-auto max-h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Veículo</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Bairro</TableHead>
              <TableHead>Severidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tempo Resposta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAlerts.map((alert) => (
              <TableRow key={alert.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {alert.vehicleId}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(alert.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start space-x-2 max-w-xs">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm truncate">{alert.address}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{alert.neighborhood}</span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={severityConfig[alert.severity].variant}
                    className={cn("text-xs", severityConfig[alert.severity].color)}
                  >
                    {severityConfig[alert.severity].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {alert.resolved ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm text-success">Resolvido</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-danger" />
                        <span className="text-sm text-danger">Pendente</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {alert.responseTime ? (
                    <span className="text-sm text-muted-foreground">
                      {alert.responseTime}min
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};