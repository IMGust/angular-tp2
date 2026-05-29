import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Turbo } from '../models/turbo.model';

import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class TurboService {

  private readonly api = 'http://localhost:8080/turbo';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Page<Turbo>> {
    let params: any = {};
    if (page !== undefined && pageSize !== undefined) {
      params.page = page.toString();
      params.pageSize = pageSize.toString();
    }
    return this.httpClient.get<Turbo[]>(this.api, { params, observe: 'response' }).pipe(
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

  findById(id: number | string): Observable<Turbo> {
    return this.httpClient.get<Turbo>(`${this.api}/${id}`).pipe(
      tap(dado => console.log('Dado recebido do backend (findById):', dado))
    );
  }

  create(turbo: Turbo): Observable<Turbo> {
    return this.httpClient.post<Turbo>(this.api, turbo).pipe(
      tap(res => console.log('Resposta da criação (POST):', res))
    );
  }

  update(turbo: Turbo): Observable<Turbo> {
    return this.httpClient.put<Turbo>(`${this.api}/${turbo.id}`, turbo);
  }

  delete(id: number | string): Observable<void> {
    return this.httpClient.delete<void>(`${this.api}/${id}`);
  }
}
