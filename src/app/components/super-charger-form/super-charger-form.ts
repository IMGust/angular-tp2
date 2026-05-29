import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SuperChargerService } from '../../services/super-charger.service';
import { SuperCharger } from '../../models/super-charger.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-super-charger-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './super-charger-form.html',
  styleUrl: './super-charger-form.css',
})
export class SuperChargerForm implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(SuperChargerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;

  tiposSuperCharger = [
    { id: 'ROOTS', label: 'Roots' },
    { id: 'TWIN_SCREW', label: 'Twin-Screw' },
    { id: 'CENTRIFUGO', label: 'Centrífugo' }
  ];

  tiposAcionamento = [
    { id: 1, label: 'Correia Dentada' },
    { id: 2, label: 'Correia de Acessórios' },
    { id: 3, label: 'Engrenagem' }
  ];

  constructor() {
    this.form = this.fb.group({
      id: [null],
      fabricante: ['', [Validators.required]],
      tipoSupercharger: ['', [Validators.required]],
      tamanhoPolia: [null, [Validators.required, Validators.min(0)]],
      padraoCorreia: ['', [Validators.required]],
      idTipoAcionamento: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    const sc: any = this.route.snapshot.data['superCharger'];
    if (sc) {
      // Se o backend retorna apenas a label, precisamos mapear de volta para o ID
      // Idealmente o backend deveria retornar o ID também.
      const idAcionamento = this.tiposAcionamento.find(t => t.label === sc.acionamento)?.id;
      
      this.form.patchValue({
        ...sc,
        idTipoAcionamento: idAcionamento
      });
    }
  }

  salvar(): void {
    if (this.form.valid) {
      const sc: SuperCharger = this.form.value;
      const operacao = sc.id 
        ? this.service.update(sc) 
        : this.service.create(sc);

      operacao.subscribe({
        next: () => this.router.navigate(['/superchargers']),
        error: (err) => console.error('Erro ao salvar supercharger:', err)
      });
    }
  }
}
