import { Component, OnInit, signal, inject } from '@angular/core';
import { RadiadorService } from '../../services/radiador.service';
import { Radiador } from '../../models/radiador.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-radiador-list',
  standalone: true,
  imports: [RouterLink, CommonModule, MatPaginatorModule],
  templateUrl: './radiador-list.html',
  styleUrl: './radiador-list.css',
})
export class RadiadorList implements OnInit {
  private radiadorService = inject(RadiadorService);
  
  radiadores = signal<Radiador[]>([]);
  totalElements = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);

  ngOnInit(): void {
    this.carregarRadiadores();
  }

  carregarRadiadores(): void {
    this.radiadorService.findAll(this.pageIndex(), this.pageSize()).subscribe({
      next: (page) => {
        this.radiadores.set(page.content);
        this.totalElements.set(page.totalElements);
      },
      error: (err) => console.error('Erro ao carregar radiadores:', err)
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.carregarRadiadores();
  }

  excluir(id: number | undefined): void {
    if (id && confirm('Tem certeza que deseja excluir este radiador?')) {
      this.radiadorService.delete(id).subscribe({
        next: () => this.carregarRadiadores(),
        error: (err) => console.error('Erro ao excluir radiador:', err)
      });
    }
  }
}
