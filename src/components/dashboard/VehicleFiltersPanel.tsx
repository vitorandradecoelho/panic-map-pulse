import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { getUniqueLines, getUniqueCompanies } from "@/data/mockData";

interface VehicleFiltersPanelProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  onLineChange: (line: string | null) => void;
  onCompanyChange: (company: number | null) => void;
  selectedDateRange: { start: Date | null; end: Date | null };
  selectedLine: string | null;
  selectedCompany: number | null;
}

export const VehicleFiltersPanel = ({
  onDateRangeChange,
  onLineChange,
  onCompanyChange,
  selectedDateRange,
  selectedLine,
  selectedCompany,
}: VehicleFiltersPanelProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: selectedDateRange.start || undefined,
    to: selectedDateRange.end || undefined,
  });

  const lines = getUniqueLines();
  const companies = getUniqueCompanies();

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    onDateRangeChange(range?.from || null, range?.to || null);
  };

  const clearAllFilters = () => {
    setDateRange(undefined);
    onDateRangeChange(null, null);
    onLineChange(null);
    onCompanyChange(null);
  };

  const activeFiltersCount = 
    (selectedDateRange.start || selectedDateRange.end ? 1 : 0) +
    (selectedLine ? 1 : 0) +
    (selectedCompany ? 1 : 0);

  return (
    <Card className="backdrop-blur-sm bg-card/80 border mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-card-foreground">Filtros</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-card-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Line Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Linha</label>
            <Select
              value={selectedLine || "all"}
              onValueChange={(value) => onLineChange(value === "all" ? null : value)}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Todas as linhas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as linhas</SelectItem>
                {lines.map((line) => (
                  <SelectItem key={line} value={line}>
                    Linha {line}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Company Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Empresa</label>
            <Select
              value={selectedCompany?.toString() || "all"}
              onValueChange={(value) => onCompanyChange(value === "all" ? null : parseInt(value))}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Todas as empresas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as empresas</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company.toString()}>
                    Empresa {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Período</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-background border-border"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecionar período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </Card>
  );
};