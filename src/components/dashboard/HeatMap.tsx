import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PanicAlert } from "@/data/mockData";
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
  alerts: PanicAlert[];
  className?: string;
}

export const HeatMap = ({ alerts, className }: HeatMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const heatmapGroup = useRef<L.LayerGroup | null>(null);
  const markersGroup = useRef<L.LayerGroup | null>(null);

  const initializeMap = () => {
    if (!mapContainer.current) return;

    // Initialize map with OpenStreetMap
    map.current = L.map(mapContainer.current, {
      center: [-23.5505, -46.6333], // São Paulo center
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
    const densityMap = new Map<string, { count: number, severitySum: number, lat: number, lng: number }>();

    // Group alerts by grid cells
    alerts.forEach(alert => {
      const gridLat = Math.floor(alert.latitude / gridSize) * gridSize;
      const gridLng = Math.floor(alert.longitude / gridSize) * gridSize;
      const key = `${gridLat},${gridLng}`;
      
      const existing = densityMap.get(key) || { count: 0, severitySum: 0, lat: gridLat, lng: gridLng };
      existing.count += 1;
      existing.severitySum += getSeverityWeight(alert.severity);
      densityMap.set(key, existing);
    });

    // Create heat circles
    densityMap.forEach(({ count, severitySum, lat, lng }) => {
      const avgSeverity = severitySum / count;
      const intensity = Math.min(count / 3, 1); // Normalize intensity
      
      // Calculate radius based on density
      const radius = Math.max(200, count * 150);
      
      // Calculate color based on average severity
      const color = getHeatColor(avgSeverity);
      
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
          <strong>Densidade de Alertas</strong><br>
          <strong>Alertas:</strong> ${count}<br>
          <strong>Severidade Média:</strong> ${getSeverityLabel(avgSeverity)}<br>
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

    alerts.forEach(alert => {
      const color = getSeverityColor(alert.severity);
      
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

      const marker = L.marker([alert.latitude, alert.longitude], {
        icon: customIcon,
        zIndexOffset: 1000 // Ensure markers appear above heatmap
      });

      // Create popup content
      const popupContent = `
        <div style="font-family: system-ui; padding: 8px; min-width: 200px;">
          <div style="font-weight: bold; color: ${color}; margin-bottom: 8px; font-size: 14px;">
            🚨 Alerta ${alert.severity.toUpperCase()}
          </div>
          <div style="font-size: 13px; line-height: 1.4;">
            <strong>Veículo:</strong> ${alert.vehicleId}<br>
            <strong>Endereço:</strong> ${alert.address}<br>
            <strong>Bairro:</strong> ${alert.neighborhood}<br>
            <strong>Horário:</strong> ${new Date(alert.timestamp).toLocaleString('pt-BR')}<br>
            <strong>Status:</strong> <span style="color: ${alert.resolved ? '#10B981' : '#EF4444'}">${alert.resolved ? '✅ Resolvido' : '⏳ Pendente'}</span>
            ${alert.responseTime ? `<br><strong>Tempo resposta:</strong> ${alert.responseTime}min` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersGroup.current?.addLayer(marker);
    });
  };

  const getSeverityWeight = (severity: string): number => {
    switch (severity) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 1;
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'high': return '#EF4444';
      case 'medium': return '#F97316';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getHeatColor = (avgSeverity: number): string => {
    if (avgSeverity >= 3.5) return '#DC2626'; // Critical
    if (avgSeverity >= 2.5) return '#EF4444'; // High
    if (avgSeverity >= 1.5) return '#F97316'; // Medium
    return '#10B981'; // Low
  };

  const getSeverityLabel = (avgSeverity: number): string => {
    if (avgSeverity >= 3.5) return 'Crítica';
    if (avgSeverity >= 2.5) return 'Alta';
    if (avgSeverity >= 1.5) return 'Média';
    return 'Baixa';
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
      // Update both layers when alerts change
      addHeatMapLayer();
      addAlertMarkers();
    }
  }, [alerts]);

  return (
    <Card className="backdrop-blur-sm bg-card/80 border overflow-hidden">
      <div className="mb-4 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Mapa de Calor - Densidade de Alertas</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#10B981] opacity-70"></div>
              <span>Baixa</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#F97316] opacity-70"></div>
              <span>Média</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#EF4444] opacity-70"></div>
              <span>Alta</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#DC2626] opacity-70"></div>
              <span>Crítica</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Círculos maiores = maior densidade • Cores mais intensas = maior severidade
        </p>
      </div>
      <div ref={mapContainer} className="w-full h-[600px]" />
    </Card>
  );
};