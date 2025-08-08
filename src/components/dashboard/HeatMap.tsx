import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { PanicAlert } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface HeatMapProps {
  alerts: PanicAlert[];
  className?: string;
}

export const HeatMap = ({ alerts, className }: HeatMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [tokenSet, setTokenSet] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-46.6333, -23.5505], // São Paulo center
        zoom: 12,
        pitch: 45,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        addHeatMapLayer();
        addAlertMarkers();
      });

      toast.success("Mapa carregado com sucesso!");
    } catch (error) {
      toast.error("Erro ao carregar o mapa. Verifique o token do Mapbox.");
    }
  };

  const addHeatMapLayer = () => {
    if (!map.current) return;

    const heatmapData = {
      type: 'FeatureCollection' as const,
      features: alerts.map(alert => ({
        type: 'Feature' as const,
        properties: {
          severity: alert.severity,
          weight: getSeverityWeight(alert.severity)
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [alert.longitude, alert.latitude]
        }
      }))
    };

    map.current.addSource('panic-alerts', {
      type: 'geojson',
      data: heatmapData
    });

    map.current.addLayer({
      id: 'panic-heatmap',
      type: 'heatmap',
      source: 'panic-alerts',
      maxzoom: 15,
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'weight'],
          0, 0,
          6, 1
        ],
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          15, 3
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0, 0, 255, 0)',
          0.2, 'rgb(65, 105, 225)',
          0.4, 'rgb(0, 255, 255)',
          0.6, 'rgb(255, 255, 0)',
          0.8, 'rgb(255, 165, 0)',
          1, 'rgb(255, 0, 0)'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          15, 20
        ],
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7, 1,
          15, 0
        ]
      }
    });
  };

  const addAlertMarkers = () => {
    if (!map.current) return;

    alerts.forEach(alert => {
      const color = getSeverityColor(alert.severity);
      
      const marker = new mapboxgl.Marker({
        color: color,
        scale: 0.8
      })
        .setLngLat([alert.longitude, alert.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2 text-sm">
              <div class="font-bold text-${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : alert.severity === 'medium' ? 'yellow' : 'green'}-500">
                Alerta ${alert.severity.toUpperCase()}
              </div>
              <div class="mt-1">
                <strong>Veículo:</strong> ${alert.vehicleId}<br>
                <strong>Endereço:</strong> ${alert.address}<br>
                <strong>Bairro:</strong> ${alert.neighborhood}<br>
                <strong>Horário:</strong> ${new Date(alert.timestamp).toLocaleString('pt-BR')}<br>
                <strong>Status:</strong> ${alert.resolved ? 'Resolvido' : 'Pendente'}
                ${alert.responseTime ? `<br><strong>Tempo resposta:</strong> ${alert.responseTime}min` : ''}
              </div>
            </div>
          `)
        )
        .addTo(map.current!);
    });
  };

  const getSeverityWeight = (severity: string): number => {
    switch (severity) {
      case 'critical': return 6;
      case 'high': return 4;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 1;
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff6b35';
      case 'medium': return '#f7931e';
      case 'low': return '#00ff00';
      default: return '#6b7280';
    }
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setTokenSet(true);
      initializeMap();
    } else {
      toast.error("Por favor, insira um token válido do Mapbox");
    }
  };

  useEffect(() => {
    if (tokenSet && map.current) {
      // Update map when alerts change
      if (map.current.getSource('panic-alerts')) {
        map.current.removeLayer('panic-heatmap');
        map.current.removeSource('panic-alerts');
      }
      
      // Clear existing markers
      document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());
      
      // Re-add layers and markers
      addHeatMapLayer();
      addAlertMarkers();
    }
  }, [alerts, tokenSet]);

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!tokenSet) {
    return (
      <Card className="p-6 backdrop-blur-sm bg-card/80 border h-[600px] flex flex-col items-center justify-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-warning" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Token Mapbox Necessário</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Para visualizar o mapa de calor, insira seu token público do Mapbox. 
            Você pode obtê-lo em{" "}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
        <div className="flex space-x-2 w-full max-w-md">
          <Input
            type="password"
            placeholder="Cole seu token público do Mapbox"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
          />
          <Button onClick={handleTokenSubmit}>Conectar</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-card/80 border overflow-hidden">
      <div ref={mapContainer} className="w-full h-[600px]" />
    </Card>
  );
};