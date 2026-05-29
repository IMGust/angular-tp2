import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MotorService } from '../../services/motor.service';
import { Motor, ArquivoResponse } from '../../models/motor.model';
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

  // Controle do Modal de Imagens
  showImageModal = false;
  isDragging = false;
  isUploading = false;
  uploadMessage = '';
  isUploadSuccess = true;
  motorImagens: ArquivoResponse[] = [];

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
      this.motorImagens = motor.imagens || []; // Popula a lista inicial de imagens
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

  // Recarrega as imagens do motor do backend
  carregarImagens(): void {
    const motorId = this.form.get('id')?.value;
    if (motorId) {
      this.motorService.findById(motorId).subscribe({
        next: (motor) => {
          this.motorImagens = motor.imagens || [];
        },
        error: (err) => console.error('Erro ao carregar imagens do motor:', err)
      });
    }
  }

  // Abre a janela de upload
  openImageModal(): void {
    this.carregarImagens();
    this.showImageModal = true;
    this.uploadMessage = '';
  }

  // Fecha a janela de upload
  closeImageModal(): void {
    this.showImageModal = false;
  }

  // Gera URL para download da imagem
  getImageUrl(fid: string): string {
    return `http://localhost:8080/motor/images/download/${fid}`;
  }

  // Lógica de Drag & Drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFiles(files);
    }
  }

  // Lógica de seleção convencional de arquivos
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.uploadFiles(files);
    }
  }

  // Upload em lote/sequencial para o SeaweedFS
  private uploadFiles(files: FileList): void {
    const motorId = this.form.get('id')?.value;
    if (!motorId) return;

    this.isUploading = true;
    this.uploadMessage = '';
    
    let uploadedCount = 0;
    let failedCount = 0;
    const totalFiles = files.length;

    const performUpload = (index: number) => {
      if (index >= totalFiles) {
        // Finalizou todos os uploads
        this.isUploading = false;
        this.carregarImagens();
        if (failedCount === 0) {
          this.isUploadSuccess = true;
          this.uploadMessage = `${uploadedCount} imagem(ns) enviada(s) com sucesso para o SeaweedFS!`;
        } else {
          this.isUploadSuccess = false;
          this.uploadMessage = `Upload finalizado: ${uploadedCount} com sucesso, ${failedCount} falha(s).`;
        }
        return;
      }

      const file = files[index];
      this.motorService.uploadImagem(motorId, file).subscribe({
        next: () => {
          uploadedCount++;
          performUpload(index + 1);
        },
        error: (err) => {
          console.error(`Erro ao enviar arquivo ${file.name}:`, err);
          failedCount++;
          performUpload(index + 1);
        }
      });
    };

    performUpload(0);
  }

  // Deleta uma imagem
  deleteImage(fid: string): void {
    if (confirm('Tem certeza de que deseja excluir esta imagem?')) {
      this.motorService.removerImagem(fid).subscribe({
        next: () => {
          this.carregarImagens();
          this.isUploadSuccess = true;
          this.uploadMessage = 'Imagem excluída com sucesso!';
        },
        error: (err) => {
          console.error('Erro ao excluir imagem:', err);
          this.isUploadSuccess = false;
          this.uploadMessage = 'Erro ao excluir imagem do SeaweedFS.';
        }
      });
    }
  }
}
