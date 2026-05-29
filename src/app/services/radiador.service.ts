import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Radiador } from '../models/radiador.model';

import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class RadiadorService {

  private readonly api = 'http://localhost:8080/radiador';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Page<Radiador>> {
    let params: any = {};
    if (page !== undefined && pageSize !== undefined) {
      params.page = page.toString();
      params.pageSize = pageSize.toString();
    }
    return this.httpClient.get<Radiador[]>(this.api, { params, observe: 'response' }).pipe(
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

  findById(id: number | string): Observable<Radiador> {
    return this.httpClient.get<Radiador>(`${this.api}/${id}`).pipe(
      tap(dado => console.log('Dado recebido do backend (findById):', dado))
    );
  }

  create(radiador: Radiador): Observable<Radiador> {
    return this.httpClient.post<Radiador>(this.api, radiador).pipe(
      tap(res => console.log('Resposta da criação (POST):', res))
    );
  }

  update(radiador: Radiador): Observable<Radiador> {
    return this.httpClient.put<Radiador>(`${this.api}/${radiador.id}`, radiador);
  }

  delete(id: number | string): Observable<void> {
    return this.httpClient.delete<void>(`${this.api}/${id}`);
  }
}
