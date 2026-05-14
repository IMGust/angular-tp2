export interface Radiador {
  id?: number;
  tipo: string;
  capacidadeFluidoLitros: number;
  dissipacaoTermicaBTU: number;
  fileiras: number;
  marca: string;
  preco: number;
  idMotor?: number;
}
