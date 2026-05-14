import { Component, OnInit, signal, inject } from '@angular/core';
import { SuperChargerService } from '../../services/super-charger.service';
import { SuperCharger } from '../../models/super-charger.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-super-charger-list',
  standalone: true,
  imports: [RouterLink, CommonModule, MatPaginatorModule],
  templateUrl: './super-charger-list.html',
  styleUrl: './super-charger-list.css',
})
export class SuperChargerList implements OnInit {
  private superChargerService = inject(SuperChargerService);
  
  superChargers = signal<SuperCharger[]>([]);
  totalElements = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);

  ngOnInit(): void {
    this.carregarSuperChargers();
  }

  carregarSuperChargers(): void {
    this.superChargerService.findAll(this.pageIndex(), this.pageSize()).subscribe({
      next: (page) => {
        this.superChargers.set(page.content);
        this.totalElements.set(page.totalElements);
      },
      error: (err) => console.error('Erro ao carregar superchargers:', err)
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.carregarSuperChargers();
  }

  excluir(id: number | undefined): void {
    if (id && confirm('Tem certeza que deseja excluir este supercharger?')) {
      this.superChargerService.delete(id).subscribe({
        next: () => this.carregarSuperChargers(),
        error: (err) => console.error('Erro ao excluir supercharger:', err)
      });
    }
  }
}
