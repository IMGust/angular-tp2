import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MotorService } from '../../services/motor.service';
import { Motor } from '../../models/motor.model';
import { CommonModule } from '@angular/common';
import { RadiadorService } from '../../services/radiador.service';
import { PistaoService } from '../../services/pistao.service';
import { TurboService } from '../../services/turbo.service';
import { Radiador } from '../../models/radiador.model';
import { Pistao } from '../../models/pistao.model';
import { Turbo } from '../../models/turbo.model';
import { SuperChargerService } from '../../services/super-charger.service';
import { SuperCharger } from '../../models/super-charger.model';
import { VeiculoService } from '../../services/veiculo.service';
import { Veiculo } from '../../models/veiculo.model';

@Component({
  selector: 'app-motor-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './motor-form.html',
  styleUrl: './motor-form.css',
})
export class MotorForm implements OnInit {
  private fb = inject(FormBuilder);
  private motorService = inject(MotorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private radiadorService = inject(RadiadorService);
  private pistaoService = inject(PistaoService);
  private turboService = inject(TurboService);
  private superChargerService = inject(SuperChargerService);
  private veiculoService = inject(VeiculoService);

  form: FormGroup;
  radiadores: Radiador[] = [];
  pistoes: Pistao[] = [];
  turbos: Turbo[] = [];
  superChargers: SuperCharger[] = [];
  veiculos: Veiculo[] = [];

  constructor() {
    this.form = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cilindrada: [null, [Validators.required, Validators.min(0)]],
      potencia: [null, [Validators.required, Validators.min(0)]],
      torque: [null, [Validators.required, Validators.min(0)]],
      taxaCompressao: [null, [Validators.required, Validators.min(0)]],
      rpmMax: [null, [Validators.required, Validators.min(0)]],
      preco: [null, [Validators.required, Validators.min(0)]],
      idRadiadores: [[]],
      idPistoes: [[]],
      idVeiculos: [[]],
      idSobrealimentacao: [null]
    });
  }

  ngOnInit(): void {
    this.carregarRelacoes();
    const motor: Motor = this.route.snapshot.data['motor'];
    if (motor) {
      // O backend retorna os objetos completos, mas o form espera IDs
      const motorPatch = {
        ...motor,
        idRadiadores: motor.radiadores?.map(r => r.id) || [],
        idPistoes: motor.pistoes?.map(p => p.id) || [],
        idVeiculos: motor.veiculosCompativeis?.map(v => v.id) || [],
        idSobrealimentacao: motor.sobrealimentacao?.id || null
      };
      this.form.patchValue(motorPatch);
    }
  }

  carregarRelacoes(): void {
    // Para formulários, buscamos uma quantidade maior para popular os selects
    this.radiadorService.findAll(0, 100).subscribe(res => this.radiadores = res.content);
    this.pistaoService.findAll(0, 100).subscribe(res => this.pistoes = res.content);
    this.turboService.findAll(0, 100).subscribe(res => this.turbos = res.content);
    this.superChargerService.findAll(0, 100).subscribe(res => this.superChargers = res.content);
    this.veiculoService.findAll(0, 100).subscribe(res => this.veiculos = res.content);
  }

  salvar(): void {
    if (this.form.valid) {
      const motor: Motor = this.form.value;
      const operacao = motor.id 
        ? this.motorService.update(motor) 
        : this.motorService.create(motor);

      operacao.subscribe({
        next: () => this.router.navigate(['/motores']),
        error: (err) => console.error('Erro ao salvar motor:', err)
      });
    }
  }
}
