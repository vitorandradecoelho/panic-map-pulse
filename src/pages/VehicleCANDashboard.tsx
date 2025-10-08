import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useTranslation } from "@/hooks/useTranslation";
import { CANVehicleData } from "@/data/canMockData";
import { fetchCANDataByDate } from "@/services/canDataApi";
import { VehicleSelector } from "@/components/can/analysis/VehicleSelector";
import { AnalysisKPIs } from "@/components/can/analysis/AnalysisKPIs";
import { TimeSeriesChart } from "@/components/can/analysis/TimeSeriesChart";
import { SystemEventsPanel } from "@/components/can/analysis/SystemEventsPanel";
import { ComfortPanel } from "@/components/can/analysis/ComfortPanel";
import { EnergyConsumptionPanel } from "@/components/can/analysis/EnergyConsumptionPanel";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorScreen from "@/components/ErrorScreen";
import { useToast } from "@/hooks/use-toast";

// Lista de seriais disponíveis
const VEHICLE_SERIALS = [
  "0014004A48", "0014004A4B", "0014004ABD", "00B8003D22", "00B8003D2B", "00B8003D2E",
  "00B8003D36", "00B8003D38", "00B8003D44", "00B8003D48", "00B8003D49", "00B8003D5C",
  "00B8003D5E", "00B8003D62", "00B8003D6F", "00B8003D72", "00B8003D78", "00B8003D7D",
  "00B8003D9D", "00B8003D9E", "00B8003DD1", "00B8003DD5", "00B8003DD6", "00B8003DD8",
  "00B8003DD9", "00B8003DDA", "00B8003DDC", "00B8003DE3", "00B8003DEE", "00B8003DF5",
  "00B8003DF6", "00B8003DF8", "00B8003DFE", "00B8003E03", "00B8003E05", "00B8003E06",
  "00B8003E07", "00B8003E0C", "00B8003E0D", "00B8003E18", "00B8003E1E", "00B8003E24",
  "00B8003E25", "00B8003E26", "00B8003E27", "00B8003E2E", "00B8003E33", "00B8003E39",
  "00B8003E3C", "00B8003E3F", "00B8003E41", "00B8003E4A", "00B8003E56", "00B8003E57",
  "00B8003E5F", "00B8003E64", "00B8003E65", "00B8003E66", "00B8003E6B", "00B8003E6C",
  "00B8003E6E", "00B8003E6F", "00B8003E74", "00B8003E7B", "00B8003E7D", "00B8004120",
  "00B8004139", "00B8004143", "00B8004145", "00B8004148", "00B800414A", "00B800414C",
  "00B8004150", "00B8004161", "00B8004164", "00B8004166", "00B800416A", "00B8004183",
  "00B800418B", "00B800418E", "00B8004191", "00B80041A0", "00B80041A1", "00B80041C4",
  "00B80041C5", "00B80041CF", "00B80041D4", "00B80041D7", "00B80041DB", "00B80041DE",
  "00B80041EE", "00B80041F0", "00B80041F3", "00B80041F9", "00B8004203", "00B8004208",
  "00B800420A", "00B800420E", "00B8004210", "00B8004218", "00B800421C", "00B8004221",
  "00B800422E", "00B8004233", "00B8004234", "00B8004239", "00B800423D", "00B800423F",
  "00B8004245", "00B8004248", "00B8004249", "00B800424A", "00B8004250", "00B8004251",
  "00B8004252", "00B8004255", "00B800425A", "00B80042EC", "00B8004312", "00B8004313",
  "00B800431E", "00B8004324", "00B8004328", "00B8004332", "00B800433E", "00B800433F",
  "00B8004340", "00B800437D", "00B8004384", "00B800438C", "00B800438D", "00B8004390",
  "00B8004397", "00B8004398", "00B800439A", "00B800439C", "00B8004880", "00B8004882",
  "00B8004887", "00B800488F", "00B8004895", "00B8004897", "00B800489C", "00B80048A2",
  "00B80048BD", "00B80048C5", "00B80048D6", "00B80048E5", "00B80048EA", "00B8004901",
  "00B8004965", "00B8004973", "00B80049AE", "00B80049B6", "00B80049BE", "00B8005A77",
  "00B8005A7F", "00B8005A84", "00B800673C", "00B8006743", "00B8006749", "00B800675A",
  "00B800676A", "00B8006770", "00B8006786", "00B80067F7", "00B8006802"
];

const VehicleCANDashboard = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [selectedSerial, setSelectedSerial] = useState<string>(VEHICLE_SERIALS[0]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<'1h' | '4h' | '8h'>('4h');
  const [vehicleData, setVehicleData] = useState<CANVehicleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados da API
  const fetchData = async () => {
    if (!selectedSerial) {
      toast({
        title: t('can.analysis.selectVehicle'),
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Calcular período baseado no timeRange
      const dataFim = new Date(selectedDate);
      dataFim.setHours(23, 59, 59, 999);
      
      const dataInicio = new Date(selectedDate);
      const hoursBack = timeRange === '1h' ? 1 : timeRange === '4h' ? 4 : 8;
      dataInicio.setHours(dataInicio.getHours() - hoursBack);
      
      const data = await fetchCANDataByDate({
        serial: selectedSerial,
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString()
      });
      
      if (data && data.length > 0) {
        setVehicleData(data);
      } else {
        setError(t('can.analysis.noData'));
        toast({
          title: t('can.analysis.noData'),
          description: t('can.analysis.noDataDescription'),
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Erro ao buscar dados CAN:", err);
      setError(t('can.analysis.error'));
      toast({
        title: t('can.analysis.error'),
        description: t('can.analysis.errorDescription'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Pegar o último registro como veículo atual
  const currentVehicle = vehicleData.length > 0 ? vehicleData[vehicleData.length - 1] : null;

  if (isLoading && !currentVehicle) {
    return <LoadingScreen />;
  }

  if (error && !currentVehicle) {
    return <ErrorScreen message={error} />;
  }


  return (
    <div className="min-h-screen bg-background">
      <Header title={t('can.analysis.title')} />
      
      <main className="container mx-auto p-6 space-y-6">
        {/* Vehicle Selection */}
        <VehicleSelector
          availableSerials={VEHICLE_SERIALS}
          selectedSerial={selectedSerial}
          onSerialChange={setSelectedSerial}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          currentVehicle={currentVehicle}
          onConsultar={fetchData}
          isLoading={isLoading}
        />
        
        {!currentVehicle && !isLoading && (
          <p className="text-center text-muted-foreground py-8">{t('can.analysis.clickToSearch')}</p>
        )}

        {/* KPIs */}
        {currentVehicle && <AnalysisKPIs vehicle={currentVehicle} />}

        {/* Time Series Charts */}
        {currentVehicle && (
          <div className="space-y-6">
            <TimeSeriesChart
              title={t('can.analysis.rpmTimeline')}
              dataKey="rpm"
              vehicle={currentVehicle}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              unit="RPM"
              color="hsl(var(--primary))"
              historicalData={vehicleData}
            />

            <TimeSeriesChart
              title={t('can.analysis.torqueTimeline')}
              dataKey="torqueAtual"
              vehicle={currentVehicle}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              unit="%"
              color="hsl(var(--chart-2))"
              historicalData={vehicleData}
            />

            <TimeSeriesChart
              title={t('can.analysis.temperatureTimeline')}
              dataKey="tempAguaMotor"
              vehicle={currentVehicle}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              unit="°C"
              color="hsl(var(--chart-3))"
              historicalData={vehicleData}
            />
          </div>
        )}

        {/* Energy Consumption */}
        {currentVehicle && <EnergyConsumptionPanel vehicle={currentVehicle} />}

        {/* Events and Comfort */}
        {currentVehicle && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemEventsPanel vehicle={currentVehicle} />
            <ComfortPanel vehicle={currentVehicle} />
          </div>
        )}
      </main>
    </div>
  );
};

export default VehicleCANDashboard;
