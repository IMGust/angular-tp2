import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SuperCharger } from '../models/super-charger.model';
import { SuperChargerService } from '../services/super-charger.service';

export const superChargerResolver: ResolveFn<SuperCharger> = (route, state) => {
  const id = route.params['id'];
  return inject(SuperChargerService).findById(id);
};
