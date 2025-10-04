import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";
import { CANVehicleData } from "@/data/canMockData";
import { format } from "date-fns";

interface VehicleSelectorProps {
  vehicles: CANVehicleData[];
  selectedVehicle: CANVehicleData;
  onVehicleChange: (vehicle: CANVehicleData) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const VehicleSelector = ({
  vehicles,
  selectedVehicle,
  onVehicleChange,
  selectedDate,
  onDateChange,
}: VehicleSelectorProps) => {
  const { t } = useTranslation();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t('can.analysis.vehicleSelection')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicle-prefix">{t('can.analysis.vehiclePrefix')}</Label>
          <Select
            value={selectedVehicle._id}
            onValueChange={(id) => {
              const vehicle = vehicles.find(v => v._id === id);
              if (vehicle) onVehicleChange(vehicle);
            }}
          >
            <SelectTrigger id="vehicle-prefix">
              <SelectValue>{selectedVehicle.prefixoVeiculo}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {vehicles.map(vehicle => (
                <SelectItem key={vehicle._id} value={vehicle._id}>
                  {vehicle.prefixoVeiculo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('can.analysis.line')}</Label>
          <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center text-sm">
            {selectedVehicle.linha}
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('can.analysis.driver')}</Label>
          <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center text-sm">
            {selectedVehicle.motorista}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">{t('can.analysis.period')}</Label>
          <Input
            id="period"
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => onDateChange(new Date(e.target.value))}
          />
        </div>
      </div>
    </Card>
  );
};
