import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Pistao } from '../models/pistao.model';

import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class PistaoService {

  private readonly api = 'http://localhost:8080/pistao';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Page<Pistao>> {
    let params: any = {};
    if (page !== undefined && pageSize !== undefined) {
      params.page = page.toString();
      params.pageSize = pageSize.toString();
    }
    return this.httpClient.get<Pistao[]>(this.api, { params, observe: 'response' }).pipe(
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

  findById(id: number | string): Observable<Pistao> {
    return this.httpClient.get<Pistao>(`${this.api}/${id}`).pipe(
      tap(dado => console.log('Dado recebido do backend (findById):', dado))
    );
  }

  create(pistao: Pistao): Observable<Pistao> {
    return this.httpClient.post<Pistao>(this.api, pistao).pipe(
      tap(res => console.log('Resposta da criação (POST):', res))
    );
  }

  update(pistao: Pistao): Observable<Pistao> {
    return this.httpClient.put<Pistao>(`${this.api}/${pistao.id}`, pistao);
  }

  delete(id: number | string): Observable<void> {
    return this.httpClient.delete<void>(`${this.api}/${id}`);
  }
}
