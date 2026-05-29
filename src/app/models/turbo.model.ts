export interface Turbo {
  id?: number;
  tipoTurbo: string;
  pressaoBoost: number;
  possuiIntercooler: boolean;
  quantidade: number;
  fabricante: string;
  ladoEscape: number;
  ladoAdmissao: number;
  tipoFlange?: string;
  tipoMancal?: string;
  wastegate?: string;
  sistemaRefrigeracao?: string;
  // Campos para Request (DTO)
  idTipoFlange?: number;
  idTipoMancal?: number;
  idTipoWastegate?: number;
  idSistemaRefrigeracao?: number;
}
