import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { VehicleData } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface HeatMapProps {
  vehicles: VehicleData[];
  className?: string;
}

export const HeatMap = ({ vehicles, className }: HeatMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const heatmapGroup = useRef<L.LayerGroup | null>(null);
  const markersGroup = useRef<L.LayerGroup | null>(null);

  const initializeMap = () => {
    if (!mapContainer.current) return;

    // Initialize map with OpenStreetMap
    map.current = L.map(mapContainer.current, {
      center: [-3.74, -38.52], // Fortaleza center (based on your coordinates)
      zoom: 12,
      zoomControl: true,
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map.current);

    // Initialize layer groups
    heatmapGroup.current = L.layerGroup().addTo(map.current);
    markersGroup.current = L.layerGroup().addTo(map.current);

    // Add layers
    addHeatMapLayer();
    addAlertMarkers();

    toast.success("Mapa carregado com sucesso!");
  };

  const addHeatMapLayer = () => {
    if (!map.current || !heatmapGroup.current) return;

    // Clear existing heatmap
    heatmapGroup.current.clearLayers();

    // Create density grid
    const gridSize = 0.01; // Aproximadamente 1km
    const densityMap = new Map<string, { count: number, speedSum: number, lat: number, lng: number }>();

    // Group vehicles by grid cells
    vehicles.forEach(vehicle => {
      const [lng, lat] = vehicle.gps.coordinates;
      const gridLat = Math.floor(lat / gridSize) * gridSize;
      const gridLng = Math.floor(lng / gridSize) * gridSize;
      const key = `${gridLat},${gridLng}`;
      
      const existing = densityMap.get(key) || { count: 0, speedSum: 0, lat: gridLat, lng: gridLng };
      existing.count += 1;
      existing.speedSum += getSpeedWeight(vehicle.velocidadeMedia);
      densityMap.set(key, existing);
    });

    // Create heat circles
    densityMap.forEach(({ count, speedSum, lat, lng }) => {
      const avgSpeed = speedSum / count;
      const intensity = Math.min(count / 3, 1); // Normalize intensity
      
      // Calculate radius based on density
      const radius = Math.max(200, count * 150);
      
      // Calculate color based on average speed
      const color = getHeatColor(avgSpeed);
      
      const heatCircle = L.circle([lat + gridSize/2, lng + gridSize/2], {
        color: color,
        fillColor: color,
        fillOpacity: 0.3 + (intensity * 0.4), // More opacity for higher density
        radius: radius,
        weight: 2,
        opacity: 0.6
      });

      // Add popup with density info
      heatCircle.bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <strong>Densidade de Veículos</strong><br>
          <strong>Veículos:</strong> ${count}<br>
          <strong>Velocidade Média:</strong> ${getSpeedLabel(avgSpeed)}<br>
          <strong>Intensidade:</strong> ${Math.round(intensity * 100)}%
        </div>
      `);

      heatmapGroup.current?.addLayer(heatCircle);
    });
  };

  const addAlertMarkers = () => {
    if (!map.current || !markersGroup.current) return;

    // Clear existing markers
    markersGroup.current.clearLayers();

    vehicles.forEach(vehicle => {
      const [lng, lat] = vehicle.gps.coordinates;
      const color = getSpeedColor(vehicle.velocidadeMedia);
      
      // Create custom colored marker
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            z-index: 1000;
          "></div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker([lat, lng], {
        icon: customIcon,
        zIndexOffset: 1000 // Ensure markers appear above heatmap
      });

      // Parse transmission date
      const [datePart, timePart] = vehicle.dataTransmissaoS.split(' ');
      const [day, month, year] = datePart.split('/');
      const transmissionDate = new Date(`${year}-${month}-${day}T${timePart}`);

      // Create popup content
      const popupContent = `
        <div style="font-family: system-ui; padding: 8px; min-width: 200px;">
          <div style="font-weight: bold; color: ${color}; margin-bottom: 8px; font-size: 14px;">
            🚍 Veículo ${vehicle.prefixoVeiculo}
          </div>
          <div style="font-size: 13px; line-height: 1.4;">
            <strong>Empresa:</strong> ${vehicle.empresaId}<br>
            <strong>Linha:</strong> ${vehicle.linha}<br>
            <strong>Motorista:</strong> ${vehicle.motorista || 'Não informado'}<br>
            <strong>Coordenadas:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}<br>
            <strong>Última transmissão:</strong> ${transmissionDate.toLocaleString('pt-BR')}<br>
            ${vehicle.velocidadeMedia ? `<strong>Velocidade:</strong> ${parseFloat(vehicle.velocidadeMedia).toFixed(1)} km/h` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersGroup.current?.addLayer(marker);
    });
  };

  const getSpeedWeight = (speed?: string): number => {
    if (!speed) return 1;
    const speedNum = parseFloat(speed);
    if (speedNum >= 60) return 4; // High speed
    if (speedNum >= 40) return 3; // Medium speed
    if (speedNum >= 20) return 2; // Normal speed
    return 1; // Low speed
  };

  const getSpeedColor = (speed?: string): string => {
    if (!speed) return '#6B7280';
    const speedNum = parseFloat(speed);
    if (speedNum >= 60) return '#DC2626'; // Red for high speed
    if (speedNum >= 40) return '#F97316'; // Orange for medium speed
    if (speedNum >= 20) return '#10B981'; // Green for normal speed
    return '#3B82F6'; // Blue for low speed
  };

  const getHeatColor = (avgSpeed: number): string => {
    if (avgSpeed >= 3.5) return '#DC2626'; // High speed areas
    if (avgSpeed >= 2.5) return '#F97316'; // Medium speed areas
    if (avgSpeed >= 1.5) return '#10B981'; // Normal speed areas
    return '#3B82F6'; // Low speed areas
  };

  const getSpeedLabel = (avgSpeed: number): string => {
    if (avgSpeed >= 3.5) return 'Alta velocidade';
    if (avgSpeed >= 2.5) return 'Velocidade média';
    if (avgSpeed >= 1.5) return 'Velocidade normal';
    return 'Baixa velocidade';
  };

  useEffect(() => {
    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (map.current && heatmapGroup.current && markersGroup.current) {
      // Update both layers when vehicles change
      addHeatMapLayer();
      addAlertMarkers();
    }
  }, [vehicles]);

  return (
    <Card className="backdrop-blur-sm bg-card/80 border overflow-hidden">
      <div className="mb-4 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Mapa de Calor - Densidade de Veículos</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#3B82F6] opacity-70"></div>
              <span>Baixa velocidade</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#10B981] opacity-70"></div>
              <span>Normal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#F97316] opacity-70"></div>
              <span>Média</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#DC2626] opacity-70"></div>
              <span>Alta velocidade</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Círculos maiores = maior densidade • Cores indicam velocidade média dos veículos
        </p>
      </div>
      <div ref={mapContainer} className="w-full h-[600px]" />
    </Card>
  );
};