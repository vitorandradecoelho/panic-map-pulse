import { useEffect, useRef, useState } from "react";
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
  const circleRadiusMap = useRef<Map<L.Circle, number>>(new Map());
  const currentZoomLevel = useRef<number>(12);
  
  // Estado para gerenciar eventos tratados e configurações
  const [treatedEvents, setTreatedEvents] = useState<Set<string>>(new Set());
  const [intensityFilter, setIntensityFilter] = useState<'all' | 'moderate' | 'high' | 'critical'>('all');
  const [clusteringEnabled, setClusteringEnabled] = useState<boolean>(true);
  const [radiusMultiplier, setRadiusMultiplier] = useState<number>(1);

  // Filter vehicles to only show panic alerts that haven't been treated
  const panicVehicles = vehicles.filter(vehicle => 
    vehicle.panico === true && !treatedEvents.has(vehicle._id)
  );

  // Apply intensity filter
  const getIntensityLevel = (alertCount: number): string => {
    if (alertCount >= 3) return 'critical';
    if (alertCount >= 2) return 'high';
    return 'moderate';
  };

  // Calculate dynamic grid size based on zoom level
  const getGridSizeForZoom = (zoom: number): number => {
    // More zoom = smaller grid (more detailed clustering)
    // Less zoom = larger grid (more grouped clustering)
    if (zoom >= 16) return 0.002; // Very detailed - ~200m
    if (zoom >= 14) return 0.005; // Detailed - ~500m  
    if (zoom >= 12) return 0.01;  // Medium - ~1km
    if (zoom >= 10) return 0.02;  // Grouped - ~2km
    if (zoom >= 8) return 0.05;   // Large groups - ~5km
    return 0.1; // Very large groups - ~10km
  };

  // Função para tratar um evento
  const handleTreatEvent = (vehicleId: string, vehiclePrefix: string) => {
    setTreatedEvents(prev => new Set([...prev, vehicleId]));
    toast.success(`Evento do veículo ${vehiclePrefix} foi tratado e removido do mapa`, {
      description: "O alerta de pânico foi resolvido pela equipe de segurança"
    });
    
    // Atualizar o mapa após tratar o evento
    setTimeout(() => {
      addHeatMapLayer();
      addAlertMarkers();
    }, 100);
  };

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

    // Add zoom and resize event handlers
    map.current.on('zoomend', () => {
      const newZoom = map.current?.getZoom() || 12;
      
      // Only recalculate clusters if zoom level changed significantly
      if (Math.abs(newZoom - currentZoomLevel.current) >= 1) {
        currentZoomLevel.current = newZoom;
        
        // Recalculate clustering with new grid size
        addHeatMapLayer();
        addAlertMarkers();
      }
      
      // Always invalidate size and update layer visibility
      map.current?.invalidateSize();
      updateLayersForZoom();
    });

    map.current.on('resize', () => {
      // Ensure map resizes properly
      map.current?.invalidateSize();
    });

    // Handle viewport changes
    map.current.on('viewreset', () => {
      map.current?.invalidateSize();
    });

    toast.success("Mapa carregado com sucesso!");
  };

  const addHeatMapLayer = () => {
    if (!map.current || !heatmapGroup.current) return;

    // Clear existing heatmap and radius map
    heatmapGroup.current.clearLayers();
    circleRadiusMap.current.clear();

    // Get current zoom level for dynamic clustering
    const currentZoom = map.current.getZoom();
    
    if (clusteringEnabled) {
      // CLUSTERING ENABLED - Group alerts by dynamic grid
      const gridSize = getGridSizeForZoom(currentZoom);
      
      // Create density grid for panic alerts with dynamic grid size
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

      // Create heat circles for clustered panic alerts
      alertMap.forEach(({ count, lat, lng, alerts }) => {
        const intensityLevel = getIntensityLevel(count);
        
        // Apply intensity filter
        if (intensityFilter !== 'all' && intensityLevel !== intensityFilter) {
          return; // Skip this cluster if it doesn't match the filter
        }
        
        const intensity = Math.min(count / 2, 1); // More sensitive for alerts
        
        // Dynamic radius based on alert count and zoom level
        const baseRadius = 50; // Base radius in meters
        const radiusClusterMultiplier = Math.min(count * 0.5, 3); // Scale with alert count, max 3x
        const zoomMultiplier = Math.max(0.5, currentZoom / 14); // Scale with zoom level
        const radius = baseRadius * radiusClusterMultiplier * zoomMultiplier * radiusMultiplier;
        
        // Use appropriate color for panic alerts
        const color = getPanicAlertColor(count);
        
        const heatCircle = L.circle([lat + gridSize/2, lng + gridSize/2], {
          color: color,
          fillColor: color,
          fillOpacity: 0.7 + (intensity * 0.2), // Opacidade mais alta para melhor visibilidade
          radius: radius,
          weight: 4, // Borda mais espessa
          opacity: 1 // Opacidade máxima da borda
        });

        // Store original radius for zoom adjustments
        circleRadiusMap.current.set(heatCircle, radius);

        // Add popup with alert info and treat option
        heatCircle.bindPopup(`
          <div style="font-family: system-ui; padding: 8px;">
            <strong>🚨 Alertas de Pânico (Cluster)</strong><br>
            <strong>Alertas:</strong> ${count}<br>
            <strong>Intensidade:</strong> ${getAlertIntensityLabel(count)}<br>
            <strong>Últimos veículos:</strong> ${alerts.slice(0, 3).map(v => v.prefixoVeiculo).join(', ')}<br>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #ccc;">
              <small style="color: #666;">Clique nos marcadores individuais para tratar eventos específicos</small>
            </div>
          </div>
        `);

        heatmapGroup.current?.addLayer(heatCircle);
      });
    } else {
      // CLUSTERING DISABLED - Show individual circles for each vehicle
      panicVehicles.forEach(vehicle => {
        const intensityLevel = getIntensityLevel(1); // Each vehicle is individual
        
        // Apply intensity filter (all individual alerts are moderate)
        if (intensityFilter !== 'all' && intensityLevel !== intensityFilter) {
          return;
        }
        
        const [lng, lat] = vehicle.gps.coordinates;
        
        // Fixed radius for individual alerts
        const baseRadius = 30; // Smaller base radius for individual alerts
        const zoomMultiplier = Math.max(0.5, currentZoom / 14);
        const radius = baseRadius * zoomMultiplier * radiusMultiplier;
        
        const color = getPanicAlertColor(1); // Individual alert color
        
        const heatCircle = L.circle([lat, lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.8, // Opacidade alta para alertas individuais
          radius: radius,
          weight: 4, // Borda mais espessa
          opacity: 1 // Opacidade máxima da borda
        });

        // Store original radius for zoom adjustments
        circleRadiusMap.current.set(heatCircle, radius);

        // Add popup with individual vehicle info
        const [datePart, timePart] = vehicle.dataTransmissaoS.split(' ');
        const [day, month, year] = datePart.split('/');
        const transmissionDate = new Date(`${year}-${month}-${day}T${timePart}`);

        heatCircle.bindPopup(`
          <div style="font-family: system-ui; padding: 8px; min-width: 200px;">
            <strong>🚨 Alerta Individual - ${vehicle.prefixoVeiculo}</strong><br>
            <strong>Empresa:</strong> ${vehicle.empresaId}<br>
            <strong>Linha:</strong> ${vehicle.linha}<br>
            <strong>Horário:</strong> ${transmissionDate.toLocaleString('pt-BR')}<br>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #ccc;">
              <button 
                onclick="window.treatPanicEvent('${vehicle.prefixoVeiculo}')"
                style="
                  background-color: #059669; 
                  color: white; 
                  border: none; 
                  padding: 6px 12px; 
                  border-radius: 4px; 
                  cursor: pointer; 
                  font-size: 12px;
                  width: 100%;
                "
              >
                ✅ Marcar como Tratado
              </button>
            </div>
          </div>
        `);

        heatmapGroup.current?.addLayer(heatCircle);
      });
    }
  };

  const addAlertMarkers = () => {
    if (!map.current || !markersGroup.current) return;

    // Clear existing markers
    markersGroup.current.clearLayers();

    // Only show individual markers at high zoom levels to avoid clutter
    const currentZoom = map.current.getZoom();
    if (currentZoom < 14) {
      return; // Don't show individual markers when zoomed out
    }

    panicVehicles.forEach(vehicle => {
      const [lng, lat] = vehicle.gps.coordinates;
      const color = 'hsl(var(--danger))'; // Using design system danger color
      
      // Scale marker size based on zoom
      const markerSize = Math.min(20, Math.max(12, currentZoom - 10));
      
      // Create custom colored marker with zoom-appropriate size
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color};
            width: ${markerSize}px;
            height: ${markerSize}px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            z-index: 1000;
          "></div>
        `,
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize/2, markerSize/2]
      });

      const marker = L.marker([lat, lng], {
        icon: customIcon,
        zIndexOffset: 1000 // Ensure markers appear above heatmap
      });

      // Parse transmission date
      const [datePart, timePart] = vehicle.dataTransmissaoS.split(' ');
      const [day, month, year] = datePart.split('/');
      const transmissionDate = new Date(`${year}-${month}-${day}T${timePart}`);

      // Create popup content for panic alert with treat button
      const popupContent = `
        <div style="font-family: system-ui; padding: 8px; min-width: 250px;">
          <div style="font-weight: bold; color: ${color}; margin-bottom: 8px; font-size: 14px;">
            🚨 ALERTA DE PÂNICO - Veículo ${vehicle.prefixoVeiculo}
          </div>
          <div style="font-size: 13px; line-height: 1.4; margin-bottom: 12px;">
            <strong>Empresa:</strong> ${vehicle.empresaId}<br>
            <strong>Linha:</strong> ${vehicle.linha}<br>
            <strong>Motorista:</strong> ${vehicle.motorista || 'Não informado'}<br>
            <strong>Coordenadas:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}<br>
            <strong>Horário do alerta:</strong> ${transmissionDate.toLocaleString('pt-BR')}<br>
            <strong>Tipo:</strong> Assalto<br>
            ${vehicle.velocidadeMedia ? `<strong>Velocidade:</strong> ${parseFloat(vehicle.velocidadeMedia).toFixed(1)} km/h` : ''}
          </div>
          <div style="border-top: 1px solid #eee; padding-top: 8px;">
            <button 
              onclick="window.treatPanicEvent('${vehicle.prefixoVeiculo}')"
              style="
                background-color: #059669; 
                color: white; 
                border: none; 
                padding: 8px 16px; 
                border-radius: 4px; 
                cursor: pointer; 
                font-size: 13px;
                font-weight: 500;
                width: 100%;
              "
              onmouseover="this.style.backgroundColor='#047857'"
              onmouseout="this.style.backgroundColor='#059669'"
            >
              ✅ Marcar como Tratado
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersGroup.current?.addLayer(marker);
    });
  };

  const getPanicAlertColor = (alertCount: number): string => {
    if (alertCount >= 3) return 'hsl(var(--heat-critical))'; // Crítico = Roxo
    if (alertCount >= 2) return 'hsl(var(--heat-high))'; // Alta = Vermelha  
    return 'hsl(var(--heat-moderate))'; // Moderada = Laranja
  };

  const getAlertIntensityLabel = (alertCount: number): string => {
    if (alertCount >= 3) return 'Crítica';
    if (alertCount >= 2) return 'Alta';
    return 'Moderada';
  };

  const updateLayersForZoom = () => {
    if (!map.current) return;
    
    const zoom = map.current.getZoom();
    
    // Show/hide different elements based on zoom level
    if (heatmapGroup.current) {
      // Adjust circle opacity and visibility based on zoom
      heatmapGroup.current.eachLayer((layer: any) => {
        if (layer instanceof L.Circle) {
          // Manter alta visibilidade em todos os zoom levels
          const opacity = zoom >= 15 ? 0.8 : zoom >= 13 ? 0.9 : 1;
          const fillOpacity = zoom >= 15 ? 0.6 : zoom >= 13 ? 0.7 : 0.8;
          
          layer.setStyle({
            opacity: opacity,
            fillOpacity: fillOpacity
          });
        }
      });
    }

    // Update marker visibility based on zoom (handled in addAlertMarkers)
    if (markersGroup.current) {
      const showMarkers = zoom >= 14;
      markersGroup.current.eachLayer((layer: any) => {
        if (showMarkers) {
          layer.setOpacity(1);
        } else {
          layer.setOpacity(0);
        }
      });
    }
  };

  useEffect(() => {
    initializeMap();

    // Expor função globalmente para ser chamada pelos popups
    (window as any).treatPanicEvent = (prefixo: string) => {
      const vehicle = panicVehicles.find(v => v.prefixoVeiculo === prefixo);
      if (vehicle) {
        handleTreatEvent(vehicle._id, prefixo);
      }
    };

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      // Limpar função global
      delete (window as any).treatPanicEvent;
    };
  }, []);

  useEffect(() => {
    if (map.current && heatmapGroup.current && markersGroup.current) {
      // Update both layers when vehicles or treated events change
      addHeatMapLayer();
      addAlertMarkers();
    }
  }, [vehicles, panicVehicles, treatedEvents, intensityFilter, clusteringEnabled, radiusMultiplier]);

  return (
    <Card className="backdrop-blur-sm bg-card/80 border overflow-hidden">
      <div className="mb-4 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              🚨 Mapa de Alertas de Pânico {clusteringEnabled ? '(Clustering Dinâmico)' : '(Alertas Individuais)'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {panicVehicles.length} alertas de pânico
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Clustering:</label>
              <input
                type="checkbox"
                checked={clusteringEnabled}
                onChange={(e) => setClusteringEnabled(e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Raio:</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={radiusMultiplier}
                onChange={(e) => setRadiusMultiplier(parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-xs text-muted-foreground w-8">{radiusMultiplier.toFixed(1)}x</span>
            </div>
            <select 
              value={intensityFilter}
              onChange={(e) => setIntensityFilter(e.target.value as any)}
              className="px-3 py-1 text-sm bg-input border border-border rounded-md"
            >
              <option value="all">Todas Intensidades</option>
              <option value="moderate">Intensidade Moderada</option>
              <option value="high">Intensidade Alta</option>
              <option value="critical">Intensidade Crítica</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{backgroundColor: 'hsl(var(--heat-moderate))', opacity: 0.7}}></div>
              <span>Intensidade Moderada (Laranja)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{backgroundColor: 'hsl(var(--heat-high))', opacity: 0.7}}></div>
              <span>Intensidade Alta (Vermelha)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{backgroundColor: 'hsl(var(--heat-critical))', opacity: 0.7}}></div>
              <span>Intensidade Crítica (Roxo)</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {clusteringEnabled 
              ? '🔍 Zoom IN: Divide áreas em clusters menores • Zoom OUT: Agrupa em áreas maiores • ✅ Clique nos marcadores para tratar eventos'
              : '📍 Modo Individual: Cada alerta é mostrado separadamente • ✅ Clique nos círculos para tratar eventos'
            }
          </p>
        </div>
      </div>
      <div ref={mapContainer} className="w-full h-[600px]" />
    </Card>
  );
};