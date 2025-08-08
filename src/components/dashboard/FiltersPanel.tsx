import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUniqueNeighborhoods } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

interface FiltersPanelProps {
  onDateRangeChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
  onNeighborhoodChange: (neighborhood: string | undefined) => void;
  onSeverityChange: (severity: string | undefined) => void;
  onStatusChange: (status: string | undefined) => void;
  startDate?: Date;
  endDate?: Date;
  selectedNeighborhood?: string;
  selectedSeverity?: string;
  selectedStatus?: string;
}

export const FiltersPanel = ({
  onDateRangeChange,
  onNeighborhoodChange,
  onSeverityChange,
  onStatusChange,
  startDate,
  endDate,
  selectedNeighborhood,
  selectedSeverity,
  selectedStatus
}: FiltersPanelProps) => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: startDate,
    to: endDate,
  });

  const neighborhoods = getUniqueNeighborhoods();
  const severities = [
    { value: 'low', label: 'Baixo' },
    { value: 'medium', label: 'Médio' },
    { value: 'high', label: 'Alto' },
    { value: 'critical', label: 'Crítico' }
  ];
  const statuses = [
    { value: 'resolved', label: 'Resolvido' },
    { value: 'pending', label: 'Pendente' }
  ];

  const handleDateSelect = (range: { from: Date | undefined; to: Date | undefined } | undefined) => {
    setDateRange(range || { from: undefined, to: undefined });
    onDateRangeChange(range?.from, range?.to);
  };

  const clearAllFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    onDateRangeChange(undefined, undefined);
    onNeighborhoodChange(undefined);
    onSeverityChange(undefined);
    onStatusChange(undefined);
  };

  const activeFiltersCount = [
    dateRange.from,
    selectedNeighborhood,
    selectedSeverity,
    selectedStatus
  ].filter(Boolean).length;

  return (
    <Card className="p-4 backdrop-blur-sm bg-card/80 border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filtros</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Período
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM", { locale: ptBR })} -{" "}
                      {format(dateRange.to, "dd/MM", { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                  )
                ) : (
                  "Selecionar período"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Neighborhood Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Bairro
          </label>
          <Select value={selectedNeighborhood} onValueChange={onNeighborhoodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os bairros" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os bairros</SelectItem>
              {neighborhoods.map((neighborhood) => (
                <SelectItem key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Severity Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Severidade
          </label>
          <Select value={selectedSeverity} onValueChange={onSeverityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas severidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas severidades</SelectItem>
              {severities.map((severity) => (
                <SelectItem key={severity.value} value={severity.value}>
                  {severity.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Status
          </label>
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};