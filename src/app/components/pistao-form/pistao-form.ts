import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PistaoService } from '../../services/pistao.service';
import { Pistao } from '../../models/pistao.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pistao-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './pistao-form.html',
  styleUrl: './pistao-form.css',
})
export class PistaoForm implements OnInit {
  private fb = inject(FormBuilder);
  private pistaoService = inject(PistaoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      id: [null],
      material: ['', [Validators.required]],
      diametro: [null, [Validators.required, Validators.min(0)]],
      curso: [null, [Validators.required, Validators.min(0)]],
      volumeDomo: [null, [Validators.required, Validators.min(0)]],
      marca: ['', [Validators.required]],
      preco: [null, [Validators.required, Validators.min(0)]],
      idMotor: [null]
    });
  }

  ngOnInit(): void {
    const pistao: Pistao = this.route.snapshot.data['pistao'];
    if (pistao) {
      this.form.patchValue(pistao);
    }
  }

  salvar(): void {
    if (this.form.valid) {
      const pistao: Pistao = this.form.value;
      const operacao = pistao.id 
        ? this.pistaoService.update(pistao) 
        : this.pistaoService.create(pistao);

      operacao.subscribe({
        next: () => this.router.navigate(['/pistoes']),
        error: (err) => console.error('Erro ao salvar pistão:', err)
      });
    }
  }
}
