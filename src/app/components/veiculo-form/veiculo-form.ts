import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VeiculoService } from '../../services/veiculo.service';
import { Veiculo } from '../../models/veiculo.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-veiculo-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './veiculo-form.html',
  styleUrl: './veiculo-form.css',
})
export class VeiculoForm implements OnInit {
  private fb = inject(FormBuilder);
  private veiculoService = inject(VeiculoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      id: [null],
      nome: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      ano: [new Date().getFullYear(), [Validators.required, Validators.min(1886)]]
    });
  }

  ngOnInit(): void {
    const veiculo: Veiculo = this.route.snapshot.data['veiculo'];
    if (veiculo) {
      this.form.patchValue(veiculo);
    }
  }

  salvar(): void {
    if (this.form.valid) {
      const veiculo: Veiculo = this.form.value;
      const operacao = veiculo.id 
        ? this.veiculoService.update(veiculo) 
        : this.veiculoService.create(veiculo);

      operacao.subscribe({
        next: () => this.router.navigate(['/veiculos']),
        error: (err) => console.error('Erro ao salvar veículo:', err)
      });
    }
  }
}
