import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "@/hooks/useTranslation";
import { CANVehicleData } from "@/data/canMockData";

interface VehicleSelectorProps {
  availableSerials: string[];
  selectedSerial: string;
  onSerialChange: (serial: string) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  currentVehicle?: CANVehicleData | null;
  onConsultar: () => void;
  isLoading: boolean;
}

export const VehicleSelector = ({ 
  availableSerials,
  selectedSerial, 
  onSerialChange,
  selectedDate,
  onDateChange,
  currentVehicle,
  onConsultar,
  isLoading
}: VehicleSelectorProps) => {
  const { t } = useTranslation();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t('can.analysis.vehicleSelection')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicle-serial">{t('can.analysis.vehicleSerial')}</Label>
          <Select
            value={selectedSerial}
            onValueChange={onSerialChange}
          >
            <SelectTrigger id="vehicle-serial">
              <SelectValue placeholder={t('can.analysis.selectVehicle')} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {availableSerials.map((serial) => (
                <SelectItem key={serial} value={serial}>
                  {serial}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">{t('can.analysis.period')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="period"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onDateChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>&nbsp;</Label>
          <Button 
            onClick={onConsultar} 
            disabled={isLoading || !selectedSerial}
            className="w-full"
          >
            {isLoading ? t('can.analysis.searching') : t('can.analysis.search')}
          </Button>
        </div>
      </div>
    </Card>
  );
};
