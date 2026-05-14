import { Component, OnInit, signal, inject } from '@angular/core';
import { MotorService } from '../../services/motor.service';
import { Motor } from '../../models/motor.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-motor-list',
  standalone: true,
  imports: [RouterLink, CommonModule, MatPaginatorModule],
  templateUrl: './motor-list.html',
  styleUrl: './motor-list.css',
})
export class MotorList implements OnInit {
  private motorService = inject(MotorService);
  
  motores = signal<Motor[]>([]);
  totalElements = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);

  ngOnInit(): void {
    this.carregarMotores();
  }

  carregarMotores(): void {
    this.motorService.findAll(this.pageIndex(), this.pageSize()).subscribe({
      next: (page) => {
        this.motores.set(page.content);
        this.totalElements.set(page.totalElements);
      },
      error: (err) => console.error('Erro ao carregar motores:', err)
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.carregarMotores();
  }

  excluir(id: number | undefined): void {
    if (id && confirm('Tem certeza que deseja excluir este motor?')) {
      this.motorService.delete(id).subscribe({
        next: () => this.carregarMotores(),
        error: (err) => console.error('Erro ao excluir motor:', err)
      });
    }
  }
}
