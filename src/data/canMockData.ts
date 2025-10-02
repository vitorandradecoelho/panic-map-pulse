export interface CANVehicleData {
  _id: string;
  empresaId: number;
  prefixoVeiculo: string;
  dataTransmissao: Date;
  linha: string;
  motorista: string;
  
  // Estado do Motor
  rpm: number;
  velocidade: number;
  posicaoAcelerador: number; // 0-100%
  motorLigado: boolean;
  emMovimento: boolean;
  
  // Luzes de Aviso
  checkEngine: boolean;
  luzPrecaucao: boolean;
  luzAlerta: boolean;
  
  // Temperaturas
  temperaturaAgua: number; // °C
  temperaturaOleo: number; // °C
  temperaturaInterior: number; // °C
  temperaturaExterior: number; // °C
  
  // Torque
  torqueAtual: number; // %
  torqueSolicitado: number; // %
  
  // Estatísticas
  tempoMarchaLenta: number; // minutos
  eventosTorqueMismatch: number;
  aceleracoesBruscas: number;
  frenagensBruscas: number;
  tempoMotorLigado: number; // minutos
  tempoSobreaquecimento: number; // minutos
  mediaRPM: number;
  maximaRPM: number;
}

export const mockCANVehicles: CANVehicleData[] = [
  {
    _id: "can_001",
    empresaId: 2040,
    prefixoVeiculo: "30557",
    dataTransmissao: new Date(),
    linha: "810",
    motorista: "João Silva",
    rpm: 1850,
    velocidade: 45,
    posicaoAcelerador: 62,
    motorLigado: true,
    emMovimento: true,
    checkEngine: true,
    luzPrecaucao: false,
    luzAlerta: false,
    temperaturaAgua: 105,
    temperaturaOleo: 112,
    temperaturaInterior: 28,
    temperaturaExterior: 32,
    torqueAtual: 58,
    torqueSolicitado: 62,
    tempoMarchaLenta: 45,
    eventosTorqueMismatch: 12,
    aceleracoesBruscas: 8,
    frenagensBruscas: 5,
    tempoMotorLigado: 240,
    tempoSobreaquecimento: 15,
    mediaRPM: 1650,
    maximaRPM: 3200
  },
  {
    _id: "can_002",
    empresaId: 2037,
    prefixoVeiculo: "35309",
    dataTransmissao: new Date(),
    linha: "120",
    motorista: "Maria Santos",
    rpm: 750,
    velocidade: 0,
    posicaoAcelerador: 0,
    motorLigado: true,
    emMovimento: false,
    checkEngine: false,
    luzPrecaucao: true,
    luzAlerta: false,
    temperaturaAgua: 92,
    temperaturaOleo: 95,
    temperaturaInterior: 35,
    temperaturaExterior: 38,
    torqueAtual: 5,
    torqueSolicitado: 5,
    tempoMarchaLenta: 78,
    eventosTorqueMismatch: 3,
    aceleracoesBruscas: 2,
    frenagensBruscas: 1,
    tempoMotorLigado: 180,
    tempoSobreaquecimento: 0,
    mediaRPM: 1200,
    maximaRPM: 2800
  },
  {
    _id: "can_003",
    empresaId: 2039,
    prefixoVeiculo: "12611",
    dataTransmissao: new Date(),
    linha: "73",
    motorista: "Pedro Costa",
    rpm: 2200,
    velocidade: 65,
    posicaoAcelerador: 75,
    motorLigado: true,
    emMovimento: true,
    checkEngine: false,
    luzPrecaucao: false,
    luzAlerta: true,
    temperaturaAgua: 88,
    temperaturaOleo: 90,
    temperaturaInterior: 22,
    temperaturaExterior: 25,
    torqueAtual: 72,
    torqueSolicitado: 75,
    tempoMarchaLenta: 25,
    eventosTorqueMismatch: 18,
    aceleracoesBruscas: 15,
    frenagensBruscas: 12,
    tempoMotorLigado: 320,
    tempoSobreaquecimento: 0,
    mediaRPM: 1800,
    maximaRPM: 3500
  },
  {
    _id: "can_004",
    empresaId: 2040,
    prefixoVeiculo: "30563",
    dataTransmissao: new Date(),
    linha: "841",
    motorista: "Ana Oliveira",
    rpm: 0,
    velocidade: 0,
    posicaoAcelerador: 0,
    motorLigado: false,
    emMovimento: false,
    checkEngine: false,
    luzPrecaucao: false,
    luzAlerta: false,
    temperaturaAgua: 45,
    temperaturaOleo: 48,
    temperaturaInterior: 30,
    temperaturaExterior: 33,
    torqueAtual: 0,
    torqueSolicitado: 0,
    tempoMarchaLenta: 120,
    eventosTorqueMismatch: 5,
    aceleracoesBruscas: 3,
    frenagensBruscas: 2,
    tempoMotorLigado: 280,
    tempoSobreaquecimento: 5,
    mediaRPM: 1400,
    maximaRPM: 3000
  },
  {
    _id: "can_005",
    empresaId: 2039,
    prefixoVeiculo: "12331",
    dataTransmissao: new Date(),
    linha: "393",
    motorista: "Carlos Ferreira",
    rpm: 1650,
    velocidade: 38,
    posicaoAcelerador: 55,
    motorLigado: true,
    emMovimento: true,
    checkEngine: true,
    luzPrecaucao: true,
    luzAlerta: false,
    temperaturaAgua: 98,
    temperaturaOleo: 102,
    temperaturaInterior: 26,
    temperaturaExterior: 29,
    torqueAtual: 52,
    torqueSolicitado: 55,
    tempoMarchaLenta: 55,
    eventosTorqueMismatch: 9,
    aceleracoesBruscas: 6,
    frenagensBruscas: 4,
    tempoMotorLigado: 260,
    tempoSobreaquecimento: 8,
    mediaRPM: 1550,
    maximaRPM: 3100
  }
];
