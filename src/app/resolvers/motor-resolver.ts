import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Motor } from '../models/motor.model';
import { MotorService } from '../services/motor.service';

export const motorResolver: ResolveFn<Motor | null> = (route, state) => {

  const id = route.paramMap.get('id');
  const motorService = inject(MotorService);

  if (id) {
    return motorService.findById(id);
  }
  return null;
};
