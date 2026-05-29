export interface ArquivoResponse {
  nomeOriginal: string;
  fid: string;
}

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
  imagens?: ArquivoResponse[];
  // Campos para Request (DTO)
  idRadiadores?: number[];
  idPistoes?: number[];
  idVeiculos?: number[];
  idSobrealimentacao?: number;
}

