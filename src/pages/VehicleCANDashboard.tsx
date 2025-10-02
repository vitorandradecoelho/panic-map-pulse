import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useTranslation } from "@/hooks/useTranslation";
import { mockCANVehicles, CANVehicleData } from "@/data/canMockData";
import { StatusLights } from "@/components/can/StatusLights";
import { RPMGauge } from "@/components/can/RPMGauge";
import { TorqueGauge } from "@/components/can/TorqueGauge";
import { TemperatureChart } from "@/components/can/TemperatureChart";
import { ComfortIndicator } from "@/components/can/ComfortIndicator";
import { TripKPIs } from "@/components/can/TripKPIs";
import { CriticalVehiclesPanel } from "@/components/can/CriticalVehiclesPanel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const VehicleCANDashboard = () => {
  const { t } = useTranslation();
  const [selectedVehicle, setSelectedVehicle] = useState<CANVehicleData>(mockCANVehicles[0]);

  return (
    <div className="min-h-screen bg-background">
      <Header title={t('can.dashboard.title')} />
      
      <main className="container mx-auto p-6 space-y-6">
        {/* Vehicle Selector */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{t('can.dashboard.selectVehicle')}:</span>
            <Select
              value={selectedVehicle._id}
              onValueChange={(id) => {
                const vehicle = mockCANVehicles.find(v => v._id === id);
                if (vehicle) setSelectedVehicle(vehicle);
              }}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockCANVehicles.map(vehicle => (
                  <SelectItem key={vehicle._id} value={vehicle._id}>
                    {vehicle.prefixoVeiculo} - {t('can.critical.line')} {vehicle.linha} ({vehicle.motorista})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Status Lights */}
        <StatusLights
          motorLigado={selectedVehicle.motorLigado}
          checkEngine={selectedVehicle.checkEngine}
          luzPrecaucao={selectedVehicle.luzPrecaucao}
          luzAlerta={selectedVehicle.luzAlerta}
        />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Gauges */}
          <div className="space-y-6">
            <RPMGauge rpm={selectedVehicle.rpm} />
            <TorqueGauge 
              torqueAtual={selectedVehicle.torqueAtual}
              torqueSolicitado={selectedVehicle.torqueSolicitado}
            />
          </div>

          {/* Center - Temperature Chart */}
          <TemperatureChart
            temperaturaAgua={selectedVehicle.temperaturaAgua}
            temperaturaOleo={selectedVehicle.temperaturaOleo}
          />

          {/* Right Column - Comfort */}
          <ComfortIndicator
            temperaturaInterior={selectedVehicle.temperaturaInterior}
            temperaturaExterior={selectedVehicle.temperaturaExterior}
          />
        </div>

        {/* Trip KPIs */}
        <TripKPIs
          tempoMotorLigado={selectedVehicle.tempoMotorLigado}
          tempoSobreaquecimento={selectedVehicle.tempoSobreaquecimento}
          mediaRPM={selectedVehicle.mediaRPM}
          maximaRPM={selectedVehicle.maximaRPM}
          eventosTorqueMismatch={selectedVehicle.eventosTorqueMismatch}
          tempoMarchaLenta={selectedVehicle.tempoMarchaLenta}
          aceleracoesBruscas={selectedVehicle.aceleracoesBruscas}
          frenagensBruscas={selectedVehicle.frenagensBruscas}
        />

        {/* Critical Vehicles Panel */}
        <CriticalVehiclesPanel vehicles={mockCANVehicles} />
      </main>
    </div>
  );
};

export default VehicleCANDashboard;
