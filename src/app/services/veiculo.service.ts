import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Veiculo } from '../models/veiculo.model';

import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class VeiculoService {

  private readonly api = 'http://localhost:8080/veiculo';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Page<Veiculo>> {
    let params: any = {};
    if (page !== undefined && pageSize !== undefined) {
      params.page = page.toString();
      params.pageSize = pageSize.toString();
    }
    return this.httpClient.get<Veiculo[]>(this.api, { params, observe: 'response' }).pipe(
      map(response => {
        return {
          content: response.body || [],
          totalElements: Number(response.headers.get('x-total-count') || 0),
          size: Number(response.headers.get('x-page-size') || pageSize || 10),
          number: Number(response.headers.get('x-page') || page || 0)
        };
      }),
      tap(dados => console.log('Dados recebidos do backend (findAll):', dados))
    );
  }

  findById(id: number | string): Observable<Veiculo> {
    return this.httpClient.get<Veiculo>(`${this.api}/${id}`).pipe(
      tap(dado => console.log('Dado recebido do backend (findById):', dado))
    );
  }

  create(veiculo: Veiculo): Observable<Veiculo> {
    return this.httpClient.post<Veiculo>(this.api, veiculo).pipe(
      tap(res => console.log('Resposta da criação (POST):', res))
    );
  }

  update(veiculo: Veiculo): Observable<Veiculo> {
    return this.httpClient.put<Veiculo>(`${this.api}/${veiculo.id}`, veiculo);
  }

  delete(id: number | string): Observable<void> {
    return this.httpClient.delete<void>(`${this.api}/${id}`);
  }
}
