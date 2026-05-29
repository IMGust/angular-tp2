import { Component, OnInit, signal, inject } from '@angular/core';
import { VeiculoService } from '../../services/veiculo.service';
import { Veiculo } from '../../models/veiculo.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-veiculo-list',
  standalone: true,
  imports: [RouterLink, CommonModule, MatPaginatorModule],
  templateUrl: './veiculo-list.html',
  styleUrl: './veiculo-list.css',
})
export class VeiculoList implements OnInit {
  private veiculoService = inject(VeiculoService);
  
  veiculos = signal<Veiculo[]>([]);
  totalElements = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);

  ngOnInit(): void {
    this.carregarVeiculos();
  }

  carregarVeiculos(): void {
    this.veiculoService.findAll(this.pageIndex(), this.pageSize()).subscribe({
      next: (page) => {
        this.veiculos.set(page.content);
        this.totalElements.set(page.totalElements);
      },
      error: (err) => console.error('Erro ao carregar veículos:', err)
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.carregarVeiculos();
  }

  excluir(id: number | undefined): void {
    if (id && confirm('Tem certeza que deseja excluir este veículo?')) {
      this.veiculoService.delete(id).subscribe({
        next: () => this.carregarVeiculos(),
        error: (err) => console.error('Erro ao excluir veículo:', err)
      });
    }
  }
}
