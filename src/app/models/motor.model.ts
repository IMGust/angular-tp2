export interface Motor {
  id?: number;
  nome: string;
  cilindrada: number;
  potencia: number;
  torque: number;
  taxaCompressao: number;
  rpmMax: number;
  preco: number;
  radiadores?: any[];
  veiculosCompativeis?: any[];
  pistoes?: any[];
  sobrealimentacao?: any;
  // Campos para Request (DTO)
  idRadiadores?: number[];
  idPistoes?: number[];
  idVeiculos?: number[];
  idSobrealimentacao?: number;
}
