import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Pistao } from '../models/pistao.model';
import { PistaoService } from '../services/pistao.service';

export const pistaoResolver: ResolveFn<Pistao | null> = (route, state) => {
  const id = route.paramMap.get('id');
  const pistaoService = inject(PistaoService);

  if (id) {
    return pistaoService.findById(id);
  }
  return null;
};
