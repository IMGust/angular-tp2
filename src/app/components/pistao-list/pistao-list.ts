import { Component, OnInit, signal, inject } from '@angular/core';
import { PistaoService } from '../../services/pistao.service';
import { Pistao } from '../../models/pistao.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pistao-list',
  standalone: true,
  imports: [RouterLink, CommonModule, MatPaginatorModule],
  templateUrl: './pistao-list.html',
  styleUrl: './pistao-list.css',
})
export class PistaoList implements OnInit {
  private pistaoService = inject(PistaoService);
  
  pistoes = signal<Pistao[]>([]);
  totalElements = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);

  ngOnInit(): void {
    this.carregarPistoes();
  }

  carregarPistoes(): void {
    this.pistaoService.findAll(this.pageIndex(), this.pageSize()).subscribe({
      next: (page) => {
        this.pistoes.set(page.content);
        this.totalElements.set(page.totalElements);
      },
      error: (err) => console.error('Erro ao carregar pistões:', err)
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.carregarPistoes();
  }

  excluir(id: number | undefined): void {
    if (id && confirm('Tem certeza que deseja excluir este pistão?')) {
      this.pistaoService.delete(id).subscribe({
        next: () => this.carregarPistoes(),
        error: (err) => console.error('Erro ao excluir pistão:', err)
      });
    }
  }
}
