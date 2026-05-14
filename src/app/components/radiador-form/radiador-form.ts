import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RadiadorService } from '../../services/radiador.service';
import { Radiador } from '../../models/radiador.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-radiador-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './radiador-form.html',
  styleUrl: './radiador-form.css',
})
export class RadiadorForm implements OnInit {
  private fb = inject(FormBuilder);
  private radiadorService = inject(RadiadorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      id: [null],
      tipo: ['', [Validators.required]],
      capacidadeFluidoLitros: [null, [Validators.required, Validators.min(0)]],
      dissipacaoTermicaBTU: [null, [Validators.required, Validators.min(0)]],
      fileiras: [null, [Validators.required, Validators.min(1)]],
      marca: ['', [Validators.required]],
      preco: [null, [Validators.required, Validators.min(0)]],
      idMotor: [null]
    });
  }

  ngOnInit(): void {
    const radiador: Radiador = this.route.snapshot.data['radiador'];
    if (radiador) {
      this.form.patchValue(radiador);
    }
  }

  salvar(): void {
    if (this.form.valid) {
      const radiador: Radiador = this.form.value;
      const operacao = radiador.id 
        ? this.radiadorService.update(radiador) 
        : this.radiadorService.create(radiador);

      operacao.subscribe({
        next: () => this.router.navigate(['/radiadores']),
        error: (err) => console.error('Erro ao salvar radiador:', err)
      });
    }
  }
}
