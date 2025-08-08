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

  // Filter vehicles to only show panic alerts
  const panicVehicles = vehicles.filter(vehicle => vehicle.panico === true);

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

    // Create density grid for panic alerts
    const gridSize = 0.01; // Aproximadamente 1km
    const alertMap = new Map<string, { count: number, lat: number, lng: number, alerts: VehicleData[] }>();

    // Group panic alerts by grid cells
    panicVehicles.forEach(vehicle => {
      const [lng, lat] = vehicle.gps.coordinates;
      const gridLat = Math.floor(lat / gridSize) * gridSize;
      const gridLng = Math.floor(lng / gridSize) * gridSize;
      const key = `${gridLat},${gridLng}`;
      
      const existing = alertMap.get(key) || { count: 0, lat: gridLat, lng: gridLng, alerts: [] };
      existing.count += 1;
      existing.alerts.push(vehicle);
      alertMap.set(key, existing);
    });

    // Create heat circles for panic alerts
    alertMap.forEach(({ count, lat, lng, alerts }) => {
      const intensity = Math.min(count / 2, 1); // More sensitive for alerts
      
      // Calculate radius based on alert density
      const radius = Math.max(300, count * 200);
      
      // Use red tones for panic alerts, more intense with higher count
      const color = getPanicAlertColor(count);
      
      const heatCircle = L.circle([lat + gridSize/2, lng + gridSize/2], {
        color: color,
        fillColor: color,
        fillOpacity: 0.4 + (intensity * 0.4), // More opacity for higher alert density
        radius: radius,
        weight: 3,
        opacity: 0.8
      });

      // Add popup with alert info
      heatCircle.bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <strong>🚨 Alertas de Pânico</strong><br>
          <strong>Alertas:</strong> ${count}<br>
          <strong>Severidade:</strong> ${getAlertSeverityLabel(count)}<br>
          <strong>Últimos veículos:</strong> ${alerts.slice(0, 3).map(v => v.prefixoVeiculo).join(', ')}
        </div>
      `);

      heatmapGroup.current?.addLayer(heatCircle);
    });
  };

  const addAlertMarkers = () => {
    if (!map.current || !markersGroup.current) return;

    // Clear existing markers
    markersGroup.current.clearLayers();

    panicVehicles.forEach(vehicle => {
      const [lng, lat] = vehicle.gps.coordinates;
      const color = '#DC2626'; // Red for panic alerts
      
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

      // Create popup content for panic alert
      const popupContent = `
        <div style="font-family: system-ui; padding: 8px; min-width: 200px;">
          <div style="font-weight: bold; color: ${color}; margin-bottom: 8px; font-size: 14px;">
            🚨 ALERTA DE PÂNICO - Veículo ${vehicle.prefixoVeiculo}
          </div>
          <div style="font-size: 13px; line-height: 1.4;">
            <strong>Empresa:</strong> ${vehicle.empresaId}<br>
            <strong>Linha:</strong> ${vehicle.linha}<br>
            <strong>Motorista:</strong> ${vehicle.motorista || 'Não informado'}<br>
            <strong>Coordenadas:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}<br>
            <strong>Horário do alerta:</strong> ${transmissionDate.toLocaleString('pt-BR')}<br>
            <strong>Tipo:</strong> Assalto<br>
            ${vehicle.velocidadeMedia ? `<strong>Velocidade:</strong> ${parseFloat(vehicle.velocidadeMedia).toFixed(1)} km/h` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersGroup.current?.addLayer(marker);
    });
  };

  const getPanicAlertColor = (alertCount: number): string => {
    if (alertCount >= 3) return '#7F1D1D'; // Very dark red for high alert concentration
    if (alertCount >= 2) return '#991B1B'; // Dark red for medium alert concentration
    return '#DC2626'; // Red for single alerts
  };

  const getAlertSeverityLabel = (alertCount: number): string => {
    if (alertCount >= 3) return 'Crítica';
    if (alertCount >= 2) return 'Alta';
    return 'Moderada';
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
  }, [vehicles, panicVehicles]);

  return (
    <Card className="backdrop-blur-sm bg-card/80 border overflow-hidden">
      <div className="mb-4 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">🚨 Mapa de Alertas de Pânico</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#DC2626] opacity-70"></div>
              <span>Severidade Moderada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#991B1B] opacity-70"></div>
              <span>Severidade Alta</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#7F1D1D] opacity-70"></div>
              <span>Severidade Crítica</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Círculos maiores = mais alertas na região • Cores indicam severidade baseada na concentração de alertas
        </p>
      </div>
      <div ref={mapContainer} className="w-full h-[600px]" />
    </Card>
  );
};