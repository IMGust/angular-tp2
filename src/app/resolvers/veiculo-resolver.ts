import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Veiculo } from '../models/veiculo.model';
import { VeiculoService } from '../services/veiculo.service';

export const veiculoResolver: ResolveFn<Veiculo | null> = (route, state) => {
  const id = route.paramMap.get('id');
  const veiculoService = inject(VeiculoService);

  if (id) {
    return veiculoService.findById(id);
  }
  return null;
};
