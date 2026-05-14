import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Turbo } from '../models/turbo.model';
import { TurboService } from '../services/turbo.service';

export const turboResolver: ResolveFn<Turbo | null> = (route, state) => {
  const id = route.paramMap.get('id');
  const turboService = inject(TurboService);

  if (id) {
    return turboService.findById(id);
  }
  return null;
};
