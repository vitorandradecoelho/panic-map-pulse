export interface CANVehicleData {
  serial: string;
  status: string | null;
  mensagem: string | null;
  dataHoraEnvio: string;
  canParse: string;
  posicaoAcelerador: number;
  switchAcelerador: "ON" | "OFF";
  rpm: number;
  torqueAtual: number;
  torqueSolicitado: number;
  velocidade: number;
  tempAguaMotor: number;
  tempOleoMotor: number;
  tempInterior: number;
  tempExterior: number;
  aireLinea: number;
  tanque1: number;
  tanque2: number;
  compresor: "ON" | "OFF";
  kmTotal: number;
  trip: number;
  horas: number;
  totalFuelUsado: number;
  presionAceite: number;
  nivelRefrigerante: number;
  consumo: number;
  rendimientoActual: number;
  promedio: number;
  nivelCombustible: number;
  $oid?: {
    timestamp: number;
    date: string;
  };
  
  // Campos adicionais para compatibilidade com UI existente
  empresaId?: number;
  prefixoVeiculo?: string;
  linha?: string;
  motorista?: string;
}

export const mockCANVehicles: CANVehicleData[] = [
  {
    serial: "00B800420A",
    status: null,
    mensagem: null,
    dataHoraEnvio: "2025-10-08T06:03:02Z",
    canParse: "ADennis",
    posicaoAcelerador: 82,
    switchAcelerador: "ON",
    rpm: 1319,
    torqueAtual: 61,
    torqueSolicitado: 83,
    velocidade: 47,
    tempAguaMotor: 97.0,
    tempOleoMotor: 1775.0,
    tempInterior: 22.0,
    tempExterior: 1775.0,
    aireLinea: 968.0,
    tanque1: 976.0,
    tanque2: 976.0,
    compresor: "ON",
    kmTotal: 118110.0,
    trip: 118109.0,
    horas: 36150.0,
    totalFuelUsado: 103691.0,
    presionAceite: 300.0,
    nivelRefrigerante: 100.0,
    consumo: 35.0,
    rendimientoActual: 1.0,
    promedio: 2.0,
    nivelCombustible: 71.0,
    empresaId: 2040,
    prefixoVeiculo: "30557",
    linha: "810",
    motorista: "João Silva"
  },
  {
    serial: "00B800420B",
    status: null,
    mensagem: null,
    dataHoraEnvio: "2025-10-08T06:04:03Z",
    canParse: "ADennis",
    posicaoAcelerador: 0,
    switchAcelerador: "OFF",
    rpm: 700,
    torqueAtual: 13,
    torqueSolicitado: 0,
    velocidade: 0,
    tempAguaMotor: 95.0,
    tempOleoMotor: 1775.0,
    tempInterior: 22.0,
    tempExterior: 1775.0,
    aireLinea: 984.0,
    tanque1: 992.0,
    tanque2: 984.0,
    compresor: "ON",
    kmTotal: 118110.0,
    trip: 118110.0,
    horas: 36150.0,
    totalFuelUsado: 103691.0,
    presionAceite: 128.0,
    nivelRefrigerante: 100.0,
    consumo: 3.0,
    rendimientoActual: 0.0,
    promedio: 2.0,
    nivelCombustible: 71.0,
    empresaId: 2037,
    prefixoVeiculo: "35309",
    linha: "120",
    motorista: "Maria Santos"
  },
  {
    serial: "00B800420C",
    status: null,
    mensagem: null,
    dataHoraEnvio: "2025-10-08T06:05:03Z",
    canParse: "ADennis",
    posicaoAcelerador: 48,
    switchAcelerador: "ON",
    rpm: 1416,
    torqueAtual: 39,
    torqueSolicitado: 40,
    velocidade: 31,
    tempAguaMotor: 95.0,
    tempOleoMotor: 1775.0,
    tempInterior: 22.0,
    tempExterior: 1775.0,
    aireLinea: 944.0,
    tanque1: 960.0,
    tanque2: 944.0,
    compresor: "ON",
    kmTotal: 118110.0,
    trip: 118110.0,
    horas: 36150.0,
    totalFuelUsado: 103691.0,
    presionAceite: 308.0,
    nivelRefrigerante: 100.0,
    consumo: 23.0,
    rendimientoActual: 1.0,
    promedio: 2.0,
    nivelCombustible: 71.0,
    empresaId: 2039,
    prefixoVeiculo: "12611",
    linha: "73",
    motorista: "Pedro Costa"
  },
  {
    serial: "00B800420D",
    status: null,
    mensagem: null,
    dataHoraEnvio: "2025-10-08T06:06:03Z",
    canParse: "ADennis",
    posicaoAcelerador: 0,
    switchAcelerador: "OFF",
    rpm: 0,
    torqueAtual: 0,
    torqueSolicitado: 0,
    velocidade: 0,
    tempAguaMotor: 45.0,
    tempOleoMotor: 48.0,
    tempInterior: 30.0,
    tempExterior: 33.0,
    aireLinea: 1000.0,
    tanque1: 1000.0,
    tanque2: 1000.0,
    compresor: "OFF",
    kmTotal: 118110.0,
    trip: 118110.0,
    horas: 36150.0,
    totalFuelUsado: 103691.0,
    presionAceite: 0.0,
    nivelRefrigerante: 100.0,
    consumo: 0.0,
    rendimientoActual: 0.0,
    promedio: 2.0,
    nivelCombustible: 71.0,
    empresaId: 2040,
    prefixoVeiculo: "30563",
    linha: "841",
    motorista: "Ana Oliveira"
  },
  {
    serial: "00B800420E",
    status: null,
    mensagem: null,
    dataHoraEnvio: "2025-10-08T06:07:03Z",
    canParse: "ADennis",
    posicaoAcelerador: 55,
    switchAcelerador: "ON",
    rpm: 1650,
    torqueAtual: 52,
    torqueSolicitado: 55,
    velocidade: 38,
    tempAguaMotor: 98.0,
    tempOleoMotor: 102.0,
    tempInterior: 26.0,
    tempExterior: 29.0,
    aireLinea: 950.0,
    tanque1: 970.0,
    tanque2: 950.0,
    compresor: "ON",
    kmTotal: 118110.0,
    trip: 118110.0,
    horas: 36150.0,
    totalFuelUsado: 103691.0,
    presionAceite: 280.0,
    nivelRefrigerante: 100.0,
    consumo: 28.0,
    rendimientoActual: 1.5,
    promedio: 2.0,
    nivelCombustible: 71.0,
    empresaId: 2039,
    prefixoVeiculo: "12331",
    linha: "393",
    motorista: "Carlos Ferreira"
  }
];
