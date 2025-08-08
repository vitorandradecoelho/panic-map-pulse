export interface PanicAlert {
  id: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  address: string;
  neighborhood: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  responseTime?: number; // in minutes
}

export const mockPanicAlerts: PanicAlert[] = [
  {
    id: '1',
    vehicleId: 'VH001',
    latitude: -23.5505,
    longitude: -46.6333,
    timestamp: '2024-01-15T14:30:00Z',
    address: 'Av. Paulista, 1578',
    neighborhood: 'Bela Vista',
    severity: 'high',
    resolved: true,
    responseTime: 8
  },
  {
    id: '2',
    vehicleId: 'VH002',
    latitude: -23.5489,
    longitude: -46.6388,
    timestamp: '2024-01-15T15:45:00Z',
    address: 'R. Augusta, 2690',
    neighborhood: 'Jardins',
    severity: 'critical',
    resolved: true,
    responseTime: 5
  },
  {
    id: '3',
    vehicleId: 'VH003',
    latitude: -23.5635,
    longitude: -46.6544,
    timestamp: '2024-01-15T16:20:00Z',
    address: 'Av. Brasil, 2033',
    neighborhood: 'Jardim América',
    severity: 'medium',
    resolved: false
  },
  {
    id: '4',
    vehicleId: 'VH004',
    latitude: -23.5629,
    longitude: -46.6544,
    timestamp: '2024-01-15T17:10:00Z',
    address: 'R. Estados Unidos, 1425',
    neighborhood: 'Jardins',
    severity: 'high',
    resolved: true,
    responseTime: 12
  },
  {
    id: '5',
    vehicleId: 'VH005',
    latitude: -23.5475,
    longitude: -46.6361,
    timestamp: '2024-01-15T18:30:00Z',
    address: 'Al. Santos, 1940',
    neighborhood: 'Cerqueira César',
    severity: 'low',
    resolved: true,
    responseTime: 15
  },
  {
    id: '6',
    vehicleId: 'VH006',
    latitude: -23.5558,
    longitude: -46.6396,
    timestamp: '2024-01-15T19:15:00Z',
    address: 'R. Haddock Lobo, 595',
    neighborhood: 'Cerqueira César',
    severity: 'critical',
    resolved: false
  },
  {
    id: '7',
    vehicleId: 'VH007',
    latitude: -23.5506,
    longitude: -46.6370,
    timestamp: '2024-01-16T08:45:00Z',
    address: 'R. da Consolação, 3418',
    neighborhood: 'Cerqueira César',
    severity: 'medium',
    resolved: true,
    responseTime: 10
  },
  {
    id: '8',
    vehicleId: 'VH008',
    latitude: -23.5577,
    longitude: -46.6617,
    timestamp: '2024-01-16T10:20:00Z',
    address: 'Av. Faria Lima, 3064',
    neighborhood: 'Itaim Bibi',
    severity: 'high',
    resolved: true,
    responseTime: 7
  },
  {
    id: '9',
    vehicleId: 'VH009',
    latitude: -23.5506,
    longitude: -46.6409,
    timestamp: '2024-01-16T11:30:00Z',
    address: 'Av. Paulista, 726',
    neighborhood: 'Bela Vista',
    severity: 'critical',
    resolved: false
  },
  {
    id: '10',
    vehicleId: 'VH010',
    latitude: -23.5468,
    longitude: -46.6348,
    timestamp: '2024-01-16T13:45:00Z',
    address: 'R. Oscar Freire, 909',
    neighborhood: 'Jardins',
    severity: 'low',
    resolved: true,
    responseTime: 20
  },
  {
    id: '11',
    vehicleId: 'VH011',
    latitude: -23.5489,
    longitude: -46.6388,
    timestamp: '2024-01-16T14:20:00Z',
    address: 'R. Augusta, 2690',
    neighborhood: 'Jardins',
    severity: 'medium',
    resolved: true,
    responseTime: 9
  },
  {
    id: '12',
    vehicleId: 'VH012',
    latitude: -23.5577,
    longitude: -46.6617,
    timestamp: '2024-01-16T16:10:00Z',
    address: 'Av. Faria Lima, 3064',
    neighborhood: 'Itaim Bibi',
    severity: 'high',
    resolved: false
  },
  {
    id: '13',
    vehicleId: 'VH013',
    latitude: -23.5629,
    longitude: -46.6544,
    timestamp: '2024-01-17T09:30:00Z',
    address: 'R. Estados Unidos, 1425',
    neighborhood: 'Jardins',
    severity: 'critical',
    resolved: true,
    responseTime: 4
  },
  {
    id: '14',
    vehicleId: 'VH014',
    latitude: -23.5558,
    longitude: -46.6396,
    timestamp: '2024-01-17T12:15:00Z',
    address: 'R. Haddock Lobo, 595',
    neighborhood: 'Cerqueira César',
    severity: 'medium',
    resolved: true,
    responseTime: 11
  },
  {
    id: '15',
    vehicleId: 'VH015',
    latitude: -23.5506,
    longitude: -46.6409,
    timestamp: '2024-01-17T15:45:00Z',
    address: 'Av. Paulista, 726',
    neighborhood: 'Bela Vista',
    severity: 'high',
    resolved: false
  }
];

export const getUniqueNeighborhoods = (): string[] => {
  return [...new Set(mockPanicAlerts.map(alert => alert.neighborhood))].sort();
};

export const getAlertsInDateRange = (startDate: Date, endDate: Date): PanicAlert[] => {
  return mockPanicAlerts.filter(alert => {
    const alertDate = new Date(alert.timestamp);
    return alertDate >= startDate && alertDate <= endDate;
  });
};

export const getAlertsByNeighborhood = (neighborhood: string): PanicAlert[] => {
  return mockPanicAlerts.filter(alert => alert.neighborhood === neighborhood);
};