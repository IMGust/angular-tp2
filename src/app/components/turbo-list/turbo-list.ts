import { Component, OnInit, signal, inject } from '@angular/core';
import { TurboService } from '../../services/turbo.service';
import { Turbo } from '../../models/turbo.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-turbo-list',
  standalone: true,
  imports: [RouterLink, CommonModule, MatPaginatorModule],
  templateUrl: './turbo-list.html',
  styleUrl: './turbo-list.css',
})
export class TurboList implements OnInit {
  private turboService = inject(TurboService);
  
  turbos = signal<Turbo[]>([]);
  totalElements = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);

  ngOnInit(): void {
    this.carregarTurbos();
  }

  carregarTurbos(): void {
    this.turboService.findAll(this.pageIndex(), this.pageSize()).subscribe({
      next: (page) => {
        this.turbos.set(page.content);
        this.totalElements.set(page.totalElements);
      },
      error: (err) => console.error('Erro ao carregar turbos:', err)
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.carregarTurbos();
  }

  excluir(id: number | undefined): void {
    if (id && confirm('Tem certeza que deseja excluir este turbo?')) {
      this.turboService.delete(id).subscribe({
        next: () => this.carregarTurbos(),
        error: (err) => console.error('Erro ao excluir turbo:', err)
      });
    }
  }
}
