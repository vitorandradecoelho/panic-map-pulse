import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { fetchLines, fetchCompanies, LineData, CompanyData } from "@/services/filtersApi";
import { getClienteLocalStorage } from "@/services/auth";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: selectedDateRange.start || undefined,
    to: selectedDateRange.end || undefined,
  });
  
  const [lines, setLines] = useState<LineData[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loadingLines, setLoadingLines] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  useEffect(() => {
    const loadFiltersData = async () => {
      console.log("🔄 Iniciando carregamento dos filtros...");
      
      try {
        const cliente = getClienteLocalStorage();
        console.log("👤 Cliente obtido:", {
          idCliente: cliente.idCliente,
          empresas: cliente.empresas
        });
        
        // Only try to fetch if we have a valid client ID
        if (cliente.idCliente && cliente.idCliente > 0) {
          console.log("🌐 Fazendo chamadas para linhas e empresas...");
          
          const [linesData, companiesData] = await Promise.all([
            fetchLines().then(data => {
              console.log("✅ Linhas carregadas:", data);
              return data;
            }).catch(err => {
              console.error("❌ Erro ao carregar linhas:", err);
              return [];
            }),
            fetchCompanies(cliente.idCliente.toString()).then(data => {
              console.log("✅ Empresas carregadas:", data);
              return data;
            }).catch(err => {
              console.error("❌ Erro ao carregar empresas:", err);
              return [];
            })
          ]);
          
          setLines(Array.isArray(linesData) ? linesData : []);
          setCompanies(Array.isArray(companiesData) ? companiesData : []);
          console.log("✅ Filtros configurados com sucesso");
        } else {
          console.warn("⚠️ Cliente ID não disponível - usando filtros vazios");
          setLines([]);
          setCompanies([]);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar dados dos filtros:", error);
        setLines([]);
        setCompanies([]);
      } finally {
        setLoadingLines(false);
        setLoadingCompanies(false);
        console.log("🏁 Carregamento dos filtros finalizado");
      }
    };

    loadFiltersData();
  }, []);

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
            <h3 className="text-lg font-semibold text-card-foreground">{t('dashboard.filters.title')}</h3>
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
              {t('dashboard.filters.clear')}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Line Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">{t('dashboard.filters.line')}</label>
            <Select
              value={selectedLine || "all"}
              onValueChange={(value) => onLineChange(value === "all" ? null : value)}
              disabled={loadingLines}
            >
              <SelectTrigger className="bg-background border-border">
                {loadingLines ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>{t('common.loading')}</span>
                  </>
                ) : (
                  <SelectValue placeholder={t('dashboard.filters.allLines')} />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('dashboard.filters.allLines')}</SelectItem>
                {lines.map((line) => (
                  <SelectItem key={line.id} value={line.id}>
                    {t('dashboard.filters.line')} {line.nome || line.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Company Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">{t('dashboard.filters.company')}</label>
            <Select
              value={selectedCompany?.toString() || "all"}
              onValueChange={(value) => onCompanyChange(value === "all" ? null : parseInt(value))}
              disabled={loadingCompanies}
            >
              <SelectTrigger className="bg-background border-border">
                {loadingCompanies ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>{t('common.loading')}</span>
                  </>
                ) : (
                  <SelectValue placeholder={t('dashboard.filters.allCompanies')} />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('dashboard.filters.allCompanies')}</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id.toString()}>
                    {company.nome || `${t('dashboard.filters.company')} ${company.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">{t('dashboard.filters.period')}</label>
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
                    <span>{t('dashboard.filters.selectPeriod')}</span>
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