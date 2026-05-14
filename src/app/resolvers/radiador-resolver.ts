import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Radiador } from '../models/radiador.model';
import { RadiadorService } from '../services/radiador.service';

export const radiadorResolver: ResolveFn<Radiador | null> = (route, state) => {
  const id = route.paramMap.get('id');
  const radiadorService = inject(RadiadorService);

  if (id) {
    return radiadorService.findById(id);
  }
  return null;
};
