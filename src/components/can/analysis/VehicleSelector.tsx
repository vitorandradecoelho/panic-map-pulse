import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "@/hooks/useTranslation";
import { CANVehicleData } from "@/data/canMockData";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t('can.analysis.vehicleSelection')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicle-serial">{t('can.analysis.vehicleSerial')}</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedSerial || t('can.analysis.selectVehicle')}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder={t('can.analysis.searchVehicle')} />
                <CommandList>
                  <CommandEmpty>{t('can.analysis.noVehicleFound')}</CommandEmpty>
                  <CommandGroup>
                    {availableSerials.map((serial) => (
                      <CommandItem
                        key={serial}
                        value={serial}
                        onSelect={(currentValue) => {
                          onSerialChange(currentValue === selectedSerial ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedSerial === serial ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {serial}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
