export interface VehicleData {
  _id: string;
  empresaId: number;
  prefixoVeiculo: string;
  dataTransmissaoS: string;
  gps: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  motorista: string;
  linha: string;
  velocidadeMedia?: string;
  panico?: boolean; // Flag para alertas de assalto
}

export const mockVehicleData: VehicleData[] = [
  {
    "_id": "6895fa0ad065117d9e2a40bc",
    "empresaId": 2040,
    "prefixoVeiculo": "30557",
    "dataTransmissaoS": "08/08/2025 10:22:15",
    "gps": {
      "type": "Point",
      "coordinates": [-38.485416666666666, -3.7383944444444444]
    },
    "motorista": "0",
    "linha": "810",
    "panico": true
  },
  {
    "_id": "6895f484d065117d9e2a3ea5",
    "empresaId": 2037,
    "prefixoVeiculo": "35309",
    "dataTransmissaoS": "08/08/2025 09:58:40",
    "gps": {
      "type": "Point",
      "coordinates": [-38.50364444444445, -3.724325]
    },
    "motorista": "",
    "linha": "120",
    "velocidadeMedia": "19.36318407960199"
  },
  {
    "_id": "6895edbed065117d9e2a3c45",
    "empresaId": 2039,
    "prefixoVeiculo": "12611",
    "dataTransmissaoS": "08/08/2025 09:29:46",
    "gps": {
      "type": "Point",
      "coordinates": [-38.54645555555555, -3.760825]
    },
    "motorista": "",
    "linha": "73",
    "velocidadeMedia": "18.036082474226806"
  },
  {
    "_id": "6895dc27d065117d9e2a3481",
    "empresaId": 2040,
    "prefixoVeiculo": "30557",
    "dataTransmissaoS": "08/08/2025 08:14:45",
    "gps": {
      "type": "Point",
      "coordinates": [-38.452083333333334, -3.743825]
    },
    "motorista": "",
    "linha": "810",
    "velocidadeMedia": "17.78421052631579",
    "panico": true
  },
  {
    "_id": "6895d889d065117d9e2a333d",
    "empresaId": 2040,
    "prefixoVeiculo": "30557",
    "dataTransmissaoS": "08/08/2025 07:59:19",
    "gps": {
      "type": "Point",
      "coordinates": [-38.48180833333333, -3.74165]
    },
    "motorista": "",
    "linha": "810",
    "velocidadeMedia": "16.106382978723403"
  },
  {
    "_id": "6895d4a2d065117d9e2a31bf",
    "empresaId": 2039,
    "prefixoVeiculo": "12611",
    "dataTransmissaoS": "08/08/2025 07:42:39",
    "gps": {
      "type": "Point",
      "coordinates": [-38.58094722222222, -3.784875]
    },
    "motorista": "",
    "linha": "73",
    "velocidadeMedia": "15.658767772511847"
  },
  {
    "_id": "6895d323d065117d9e2a3130",
    "empresaId": 2040,
    "prefixoVeiculo": "30557",
    "dataTransmissaoS": "08/08/2025 07:36:16",
    "gps": {
      "type": "Point",
      "coordinates": [-38.47743611111111, -3.740388888888889]
    },
    "motorista": "",
    "linha": "810",
    "velocidadeMedia": "8.07865168539326"
  },
  {
    "_id": "6895cf36d065117d9e2a2fc2",
    "empresaId": 2040,
    "prefixoVeiculo": "30557",
    "dataTransmissaoS": "08/08/2025 07:19:29",
    "gps": {
      "type": "Point",
      "coordinates": [-38.453891666666664, -3.748925]
    },
    "motorista": "",
    "linha": "810",
    "velocidadeMedia": "17.605"
  },
  {
    "_id": "6895c937d065117d9e2a2d53",
    "empresaId": 2040,
    "prefixoVeiculo": "30563",
    "dataTransmissaoS": "08/08/2025 06:53:55",
    "gps": {
      "type": "Point",
      "coordinates": [-38.48526666666667, -3.7374444444444443]
    },
    "motorista": "0",
    "linha": "841",
    "velocidadeMedia": "8.866310160427808"
  },
  {
    "_id": "6895c895d065117d9e2a2d0f",
    "empresaId": 2039,
    "prefixoVeiculo": "12331",
    "dataTransmissaoS": "08/08/2025 06:51:14",
    "gps": {
      "type": "Point",
      "coordinates": [-38.611475, -3.798125]
    },
    "motorista": "",
    "linha": "393",
    "velocidadeMedia": "13.98913043478261",
    "panico": true
  },
  // Additional mock data to provide more variety
  {
    "_id": "6895c123d065117d9e2a2c01",
    "empresaId": 2037,
    "prefixoVeiculo": "35310",
    "dataTransmissaoS": "08/08/2025 11:15:30",
    "gps": {
      "type": "Point",
      "coordinates": [-38.520833, -3.735611]
    },
    "motorista": "João Silva",
    "linha": "125",
    "velocidadeMedia": "22.5"
  },
  {
    "_id": "6895c456d065117d9e2a2c02",
    "empresaId": 2039,
    "prefixoVeiculo": "12612",
    "dataTransmissaoS": "08/08/2025 11:45:20",
    "gps": {
      "type": "Point",
      "coordinates": [-38.565278, -3.772222]
    },
    "motorista": "Maria Santos",
    "linha": "74",
    "velocidadeMedia": "18.8",
    "panico": true
  }
];

export const getUniqueLines = (): string[] => {
  return [...new Set(mockVehicleData.map(vehicle => vehicle.linha))].sort();
};

export const getUniqueCompanies = (): number[] => {
  return [...new Set(mockVehicleData.map(vehicle => vehicle.empresaId))].sort();
};

export const getVehiclesInDateRange = (startDate: Date, endDate: Date): VehicleData[] => {
  return mockVehicleData.filter(vehicle => {
    // Parse the Brazilian date format DD/MM/YYYY HH:mm:ss
    const [datePart, timePart] = vehicle.dataTransmissaoS.split(' ');
    const [day, month, year] = datePart.split('/');
    const vehicleDate = new Date(`${year}-${month}-${day}T${timePart}`);
    return vehicleDate >= startDate && vehicleDate <= endDate;
  });
};

export const getVehiclesByLine = (linha: string): VehicleData[] => {
  return mockVehicleData.filter(vehicle => vehicle.linha === linha);
};

export const getVehiclesByCompany = (empresaId: number): VehicleData[] => {
  return mockVehicleData.filter(vehicle => vehicle.empresaId === empresaId);
};