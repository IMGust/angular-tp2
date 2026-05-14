import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TurboService } from '../../services/turbo.service';
import { Turbo } from '../../models/turbo.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turbo-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './turbo-form.html',
  styleUrl: './turbo-form.css',
})
export class TurboForm implements OnInit {
  private fb = inject(FormBuilder);
  private turboService = inject(TurboService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;

  // Mock de opções para enums (poderiam vir do backend)
  tiposTurbo = ['SINGLE', 'TWIN_PARALLEL', 'TWIN_SEQUENCIAL', 'TWIN_SCROLL', 'GEOMETRIA_VARIAVEL', 'ELETRICO'];
  tiposFlange = [
    { id: 1, label: 'T25' },
    { id: 2, label: 'T3' },
    { id: 3, label: 'T4' },
    { id: 4, label: 'Twin Scroll' },
    { id: 5, label: 'V-Band' }
  ];
  tiposMancal = [
    { id: 1, label: 'Rolamento' },
    { id: 2, label: 'Bucha' }
  ];
  tiposWastegate = [
    { id: 1, label: 'Interna' },
    { id: 2, label: 'Externa' }
  ];
  sistemasRefrigeracao = [
    { id: 1, label: 'Óleo' },
    { id: 2, label: 'Água e Óleo' }
  ];

  constructor() {
    this.form = this.fb.group({
      id: [null],
      fabricante: ['', [Validators.required]],
      tipoTurbo: ['', [Validators.required]],
      pressaoBoost: [null, [Validators.required, Validators.min(0)]],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      possuiIntercooler: [false],
      ladoEscape: [null, [Validators.required, Validators.min(0)]],
      ladoAdmissao: [null, [Validators.required, Validators.min(0)]],
      idTipoFlange: [null, [Validators.required]],
      idTipoMancal: [null, [Validators.required]],
      idTipoWastegate: [null, [Validators.required]],
      idSistemaRefrigeracao: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    const turbo: Turbo = this.route.snapshot.data['turbo'];
    if (turbo) {
      // Mapeamento manual se necessário, mas o patchValue resolve se os nomes baterem
      this.form.patchValue(turbo);
    }
  }

  salvar(): void {
    if (this.form.valid) {
      const turbo: Turbo = this.form.value;
      const operacao = turbo.id 
        ? this.turboService.update(turbo) 
        : this.turboService.create(turbo);

      operacao.subscribe({
        next: () => this.router.navigate(['/turbos']),
        error: (err) => console.error('Erro ao salvar turbo:', err)
      });
    }
  }
}
