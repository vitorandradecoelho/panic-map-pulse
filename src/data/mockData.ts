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
  }, {
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
    "panico": true,
    "velocidadeMedia": "19.36318407960199"
  },
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
      "panico": true,
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
    "panico": true,
    "velocidadeMedia": "17.78421052631579"
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
    "panico": true,
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
    "panico": true,
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
    "panico": true,
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
    "panico": true,
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
    "panico": true,
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
    "panico": true,
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
  },
  // Additional data from new dataset
  {
    "_id": "68960220d065117d9e2a43c7",
    "empresaId": 2040,
    "prefixoVeiculo": "30557",
    "dataTransmissaoS": "08/08/2025 10:56:46",
    "gps": {
      "type": "Point",
      "coordinates": [-38.46075833333333, -3.7483194444444443]
    },
    "motorista": "",
    "linha": "810"
  },
  {
    "_id": "6895c814d065117d9e2a2cd6",
    "empresaId": 2040,
    "prefixoVeiculo": "30557",
    "dataTransmissaoS": "08/08/2025 06:49:06",
    "gps": {
      "type": "Point",
      "coordinates": [-38.481069444444444, -3.7384472222222223]
    },
    "motorista": "",
    "linha": "810",
    "panico": true,
    "velocidadeMedia": "11.984126984126984"
  },
  {
    "_id": "6895c3efd065117d9e2a2ac7",
    "empresaId": 2040,
    "prefixoVeiculo": "30557",
    "dataTransmissaoS": "08/08/2025 06:31:25",
    "gps": {
      "type": "Point",
      "coordinates": [-38.45409444444444, -3.7448527777777776]
    },
    "motorista": "0",
    "linha": "810",
    "velocidadeMedia": "13.631313131313131"
  },
  {
    "_id": "6895bf8cd065117d9e2a2878",
    "empresaId": 2040,
    "prefixoVeiculo": "30557",
    "dataTransmissaoS": "08/08/2025 06:12:40",
    "gps": {
      "type": "Point",
      "coordinates": [-38.48173888888889, -3.7416416666666668]
    },
    "motorista": "",
    "linha": "810",
    "velocidadeMedia": "14.804232804232804"
  },
  {
    "_id": "6895ba32d065117d9e2a24fd",
    "empresaId": 2040,
    "prefixoVeiculo": "30557",
    "dataTransmissaoS": "08/08/2025 05:49:51",
    "gps": {
      "type": "Point",
      "coordinates": [-38.469252777777776, -3.744088888888889]
    },
    "motorista": "",
    "linha": "810",
    "velocidadeMedia": "12.523560209424083"
  },
  {
    "_id": "6895b091d065117d9e2a1e85",
    "empresaId": 2040,
    "prefixoVeiculo": "30557",
    "dataTransmissaoS": "08/08/2025 05:08:46",
    "gps": {
      "type": "Point",
      "coordinates": [-38.46910555555556, -3.8072416666666666]
    },
    "motorista": "",
    "linha": "810",
    "velocidadeMedia": "25.687150837988828"
  },
  {
    "_id": "6895ae42d065117d9e2a1d11",
    "empresaId": 2031,
    "prefixoVeiculo": "26201",
    "dataTransmissaoS": "08/08/2025 04:58:53",
    "gps": {
      "type": "Point",
      "coordinates": [-38.558994444444444, -3.8371416666666667]
    },
    "motorista": "",
    "linha": "",
    "velocidadeMedia": "6.027027027027027"
  },
  {
    "_id": "6895a9c1d065117d9e2a1a71",
    "empresaId": 2035,
    "prefixoVeiculo": "M.ELIAS",
    "dataTransmissaoS": "08/08/2025 04:39:00",
    "gps": {
      "type": "Point",
      "coordinates": [-38.533401, -3.878795]
    },
    "motorista": "",
    "linha": ""
  },
  {
    "_id": "68956ee0d065117d9e2a111e",
    "empresaId": 2040,
    "prefixoVeiculo": "30381",
    "dataTransmissaoS": "08/08/2025 00:28:24",
    "gps": {
      "type": "Point",
      "coordinates": [-38.46881111111111, -3.806775]
    },
    "motorista": "",
    "linha": "",
    "velocidadeMedia": "1.0897435897435896"
  },
  {
    "_id": "6895455dd065117d9e29ff65",
    "empresaId": 2040,
    "prefixoVeiculo": "30551",
    "dataTransmissaoS": "07/08/2025 21:31:22",
    "gps": {
      "type": "Point",
      "coordinates": [-38.46885, -3.806802777777778]
    },
    "motorista": "",
    "linha": "806",
    "velocidadeMedia": "1.1297709923664123"
  },
  {
    "_id": "68954397d065117d9e29fe94",
    "empresaId": 2040,
    "prefixoVeiculo": "30373",
    "dataTransmissaoS": "07/08/2025 21:23:49",
    "gps": {
      "type": "Point",
      "coordinates": [-38.47825, -3.729675]
    },
    "motorista": "",
    "linha": "804",
    "velocidadeMedia": "14.753164556962025"
  },
  {
    "_id": "6895390dd065117d9e29f988",
    "empresaId": 2039,
    "prefixoVeiculo": "12611",
    "dataTransmissaoS": "07/08/2025 20:38:49",
    "gps": {
      "type": "Point",
      "coordinates": [-38.570727777777776, -3.7808305555555557]
    },
    "motorista": "",
    "linha": "73",
    "velocidadeMedia": "0.6987577639751553"
  },
  {
    "_id": "68952ad1d065117d9e29f2e9",
    "empresaId": 2034,
    "prefixoVeiculo": "14304",
    "dataTransmissaoS": "07/08/2025 19:38:05",
    "gps": {
      "type": "Point",
      "coordinates": [-38.586019444444446, -3.804027777777778]
    },
    "motorista": "",
    "linha": "379",
    "velocidadeMedia": "22.385416666666668",
    "panico": true
  },
  {
    "_id": "689526ffd065117d9e29f195",
    "empresaId": 2028,
    "prefixoVeiculo": "42326",
    "dataTransmissaoS": "07/08/2025 19:21:49",
    "gps": {
      "type": "Point",
      "coordinates": [-38.524141666666665, -3.748725]
    },
    "motorista": "",
    "linha": "603",
    "velocidadeMedia": "22.2"
  },
  {
    "_id": "68952242d065117d9e29efcc",
    "empresaId": 2034,
    "prefixoVeiculo": "14304",
    "dataTransmissaoS": "07/08/2025 19:01:35",
    "gps": {
      "type": "Point",
      "coordinates": [-38.57441111111111, -3.786]
    },
    "motorista": "",
    "linha": "379",
    "velocidadeMedia": "16.86842105263158"
  },
  {
    "_id": "68951945d065117d9e29ed40",
    "empresaId": 2040,
    "prefixoVeiculo": "30373",
    "dataTransmissaoS": "07/08/2025 18:23:15",
    "gps": {
      "type": "Point",
      "coordinates": [-38.469541666666665, -3.725525]
    },
    "motorista": "",
    "linha": "804",
    "velocidadeMedia": "12.968944099378882"
  },
  {
    "_id": "68950627d065117d9e29e823",
    "empresaId": 2028,
    "prefixoVeiculo": "42909",
    "dataTransmissaoS": "07/08/2025 17:01:40",
    "gps": {
      "type": "Point",
      "coordinates": [-38.484119444444445, -3.7376194444444444]
    },
    "motorista": "0",
    "linha": "45",
    "velocidadeMedia": "5.136904761904762"
  },
  {
    "_id": "6894f25cd065117d9e29e0d3",
    "empresaId": 2029,
    "prefixoVeiculo": "02407",
    "dataTransmissaoS": "07/08/2025 15:37:13",
    "gps": {
      "type": "Point",
      "coordinates": [-38.52505277777778, -3.7323916666666666]
    },
    "motorista": "0",
    "linha": "604",
    "velocidadeMedia": "15.786516853932584"
  },
  {
    "_id": "6894edfcd065117d9e29df15",
    "empresaId": 2028,
    "prefixoVeiculo": "42913",
    "dataTransmissaoS": "07/08/2025 15:18:33",
    "gps": {
      "type": "Point",
      "coordinates": [-38.60955, -3.762886111111111]
    },
    "motorista": "",
    "linha": "45",
    "velocidadeMedia": "22.104072398190045"
  },
  {
    "_id": "6894be00d065117d9e29cd85",
    "empresaId": 2039,
    "prefixoVeiculo": "12215",
    "dataTransmissaoS": "07/08/2025 11:53:49",
    "gps": {
      "type": "Point",
      "coordinates": [-38.620327777777774, -3.8232416666666666]
    },
    "motorista": "",
    "linha": "338",
    "velocidadeMedia": "26.005479452054793"
  },
  {
    "_id": "6894b9bfd065117d9e29cbd7",
    "empresaId": 2039,
    "prefixoVeiculo": "12215",
    "dataTransmissaoS": "07/08/2025 11:35:39",
    "gps": {
      "type": "Point",
      "coordinates": [-38.58643055555556, -3.7900666666666667]
    },
    "motorista": "0",
    "linha": "338",
    "velocidadeMedia": "18.51412429378531"
  },
  {
    "_id": "6894b61bd065117d9e29ca72",
    "empresaId": 2039,
    "prefixoVeiculo": "12215",
    "dataTransmissaoS": "07/08/2025 11:20:06",
    "gps": {
      "type": "Point",
      "coordinates": [-38.62947777777778, -3.8329305555555555]
    },
    "motorista": "",
    "linha": "338",
    "velocidadeMedia": "26.797927461139896"
  },
  {
    "_id": "6894b4ecd065117d9e29ca09",
    "empresaId": 2040,
    "prefixoVeiculo": "30557",
    "dataTransmissaoS": "07/08/2025 11:15:06",
    "gps": {
      "type": "Point",
      "coordinates": [-38.485141666666664, -3.7382583333333335]
    },
    "motorista": "0",
    "linha": "810",
    "velocidadeMedia": "10.60344827586207"
  },
  {
    "_id": "6894ae73d065117d9e29c793",
    "empresaId": 2039,
    "prefixoVeiculo": "12215",
    "dataTransmissaoS": "07/08/2025 10:47:27",
    "gps": {
      "type": "Point",
      "coordinates": [-38.594452777777775, -3.796736111111111]
    },
    "motorista": "",
    "linha": "338",
    "velocidadeMedia": "19.208333333333332"
  },
  {
    "_id": "6894aac5d065117d9e29c630",
    "empresaId": 2039,
    "prefixoVeiculo": "12215",
    "dataTransmissaoS": "07/08/2025 10:31:46",
    "gps": {
      "type": "Point",
      "coordinates": [-38.60206111111111, -3.805]
    },
    "motorista": "",
    "linha": "338",
    "velocidadeMedia": "14.6"
  },
  {
    "_id": "6894a8ebd065117d9e29c56c",
    "empresaId": 2040,
    "prefixoVeiculo": "30557",
    "dataTransmissaoS": "07/08/2025 10:23:52",
    "gps": {
      "type": "Point",
      "coordinates": [-38.48480555555555, -3.738391666666667]
    },
    "motorista": "0",
    "linha": "810",
    "velocidadeMedia": "14.602209944751381"
  },
  {
    "_id": "68949e0ed065117d9e29c191",
    "empresaId": 2040,
    "prefixoVeiculo": "30557",
    "dataTransmissaoS": "07/08/2025 09:37:31",
    "gps": {
      "type": "Point",
      "coordinates": [-38.483447222222225, -3.7411333333333334]
    },
    "motorista": "",
    "linha": "810",
    "velocidadeMedia": "17.697802197802197"
  },
  {
    "_id": "68949d10d065117d9e29c133",
    "empresaId": 2039,
    "prefixoVeiculo": "12215",
    "dataTransmissaoS": "07/08/2025 09:33:15",
    "gps": {
      "type": "Point",
      "coordinates": [-38.61309166666667, -3.8162833333333332]
    },
    "motorista": "",
    "linha": "338",
    "velocidadeMedia": "19.16111111111111"
  },
  {
    "_id": "689480c9d065117d9e29b5e4",
    "empresaId": 2038,
    "prefixoVeiculo": "21350",
    "dataTransmissaoS": "07/08/2025 07:32:36",
    "gps": {
      "type": "Point",
      "coordinates": [-38.549591666666664, -3.765861111111111]
    },
    "motorista": "",
    "linha": "60",
    "velocidadeMedia": "13.866666666666667"
  },
  {
    "_id": "6894729bd065117d9e29b061",
    "empresaId": 2039,
    "prefixoVeiculo": "12206",
    "dataTransmissaoS": "07/08/2025 06:32:10",
    "gps": {
      "type": "Point",
      "coordinates": [-38.576861111111114, -3.78865]
    },
    "motorista": "",
    "linha": "52",
    "velocidadeMedia": "12.412371134020619"
  },
  {
    "_id": "68946b4dd065117d9e29abe3",
    "empresaId": 2039,
    "prefixoVeiculo": "12215",
    "dataTransmissaoS": "07/08/2025 06:00:53",
    "gps": {
      "type": "Point",
      "coordinates": [-38.59007777777778, -3.7922333333333333]
    },
    "motorista": "",
    "linha": "338",
    "velocidadeMedia": "21.55678670360111"
  },
  {
    "_id": "68946403d065117d9e29a6d1",
    "empresaId": 2039,
    "prefixoVeiculo": "12215",
    "dataTransmissaoS": "07/08/2025 05:29:46",
    "gps": {
      "type": "Point",
      "coordinates": [-38.62995, -3.8221166666666666]
    },
    "motorista": "",
    "linha": "338",
    "velocidadeMedia": "17.46842105263158"
  },
  {
    "_id": "68945617d065117d9e299e5a",
    "empresaId": 2039,
    "prefixoVeiculo": "12215",
    "dataTransmissaoS": "07/08/2025 04:30:29",
    "gps": {
      "type": "Point",
      "coordinates": [-38.633155555555554, -3.8175166666666667]
    },
    "motorista": "",
    "linha": "338",
    "velocidadeMedia": "21.20643431635389"
  }
];

export const getUniqueLines = (): string[] => {
  return [...new Set(mockVehicleData.map(vehicle => vehicle.linha).filter(linha => linha.trim() !== ""))].sort();
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