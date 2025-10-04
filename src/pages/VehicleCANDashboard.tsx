import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useTranslation } from "@/hooks/useTranslation";
import { mockCANVehicles, CANVehicleData } from "@/data/canMockData";
import { VehicleSelector } from "@/components/can/analysis/VehicleSelector";
import { AnalysisKPIs } from "@/components/can/analysis/AnalysisKPIs";
import { TimeSeriesChart } from "@/components/can/analysis/TimeSeriesChart";
import { SystemEventsPanel } from "@/components/can/analysis/SystemEventsPanel";
import { ComfortPanel } from "@/components/can/analysis/ComfortPanel";

const VehicleCANDashboard = () => {
  const { t } = useTranslation();
  const [selectedVehicle, setSelectedVehicle] = useState<CANVehicleData>(mockCANVehicles[0]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<'1h' | '4h' | '8h'>('4h');

  return (
    <div className="min-h-screen bg-background">
      <Header title={t('can.analysis.title')} />
      
      <main className="container mx-auto p-6 space-y-6">
        {/* Vehicle Selection */}
        <VehicleSelector
          vehicles={mockCANVehicles}
          selectedVehicle={selectedVehicle}
          onVehicleChange={setSelectedVehicle}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* KPIs */}
        <AnalysisKPIs vehicle={selectedVehicle} />

        {/* Time Series Charts */}
        <div className="space-y-6">
          <TimeSeriesChart
            title={t('can.analysis.rpmTimeline')}
            dataKey="rpm"
            vehicle={selectedVehicle}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            unit="RPM"
            color="hsl(var(--primary))"
          />

          <TimeSeriesChart
            title={t('can.analysis.torqueTimeline')}
            dataKey="torque"
            vehicle={selectedVehicle}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            unit="%"
            color="hsl(var(--chart-2))"
          />

          <TimeSeriesChart
            title={t('can.analysis.temperatureTimeline')}
            dataKey="temperature"
            vehicle={selectedVehicle}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            unit="°C"
            color="hsl(var(--chart-3))"
          />
        </div>

        {/* Events and Comfort */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemEventsPanel vehicle={selectedVehicle} />
          <ComfortPanel vehicle={selectedVehicle} />
        </div>
      </main>
    </div>
  );
};

export default VehicleCANDashboard;
