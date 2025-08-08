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
  const heatmapLayer = useRef<any>(null);
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

    // Initialize markers group
    markersGroup.current = L.layerGroup().addTo(map.current);

    // Load heatmap plugin dynamically
    loadHeatmapPlugin().then(() => {
      addHeatMapLayer();
      addAlertMarkers();
    });

    toast.success("Mapa carregado com sucesso!");
  };

  const loadHeatmapPlugin = async () => {
    // Load the heatmap plugin script
    return new Promise<void>((resolve) => {
      if ((window as any).L?.heatLayer) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  };

  const addHeatMapLayer = () => {
    if (!map.current || !(window as any).L?.heatLayer) return;

    // Prepare heatmap data
    const heatmapData = alerts.map(alert => [
      alert.latitude,
      alert.longitude,
      getSeverityWeight(alert.severity)
    ]);

    // Create heatmap layer
    heatmapLayer.current = (window as any).L.heatLayer(heatmapData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.0: '#3B82F6', // Blue (low)
        0.2: '#10B981', // Green 
        0.4: '#F59E0B', // Yellow (medium)
        0.6: '#F97316', // Orange
        0.8: '#EF4444', // Red (high)
        1.0: '#DC2626'  // Dark red (critical)
      }
    }).addTo(map.current);
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
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([alert.latitude, alert.longitude], {
        icon: customIcon
      });

      // Create popup content
      const popupContent = `
        <div style="font-family: system-ui; padding: 8px; min-width: 200px;">
          <div style="font-weight: bold; color: ${color}; margin-bottom: 8px;">
            Alerta ${alert.severity.toUpperCase()}
          </div>
          <div style="font-size: 14px; line-height: 1.4;">
            <strong>Veículo:</strong> ${alert.vehicleId}<br>
            <strong>Endereço:</strong> ${alert.address}<br>
            <strong>Bairro:</strong> ${alert.neighborhood}<br>
            <strong>Horário:</strong> ${new Date(alert.timestamp).toLocaleString('pt-BR')}<br>
            <strong>Status:</strong> ${alert.resolved ? 'Resolvido' : 'Pendente'}
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
      case 'critical': return 1.0;
      case 'high': return 0.8;
      case 'medium': return 0.5;
      case 'low': return 0.3;
      default: return 0.3;
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
    if (map.current && heatmapLayer.current && markersGroup.current) {
      // Update heatmap data
      const heatmapData = alerts.map(alert => [
        alert.latitude,
        alert.longitude,
        getSeverityWeight(alert.severity)
      ]);
      
      heatmapLayer.current.setLatLngs(heatmapData);
      
      // Update markers
      addAlertMarkers();
    }
  }, [alerts]);

  return (
    <Card className="backdrop-blur-sm bg-card/80 border overflow-hidden">
      <div ref={mapContainer} className="w-full h-[600px]" />
    </Card>
  );
};