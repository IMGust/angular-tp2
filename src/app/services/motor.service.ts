import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Motor } from '../models/motor.model';

import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class MotorService {

  private readonly api = 'http://localhost:8080/motor';

  constructor(private httpClient: HttpClient) { }

  // Buscar todos com paginação opcional
  findAll(page?: number, pageSize?: number): Observable<Page<Motor>> {
    let params: any = {};
    if (page !== undefined && pageSize !== undefined) {
      params.page = page.toString();
      params.pageSize = pageSize.toString();
    }
    console.log('Iniciando requisição GET para:', this.api, 'com params:', params);
    return this.httpClient.get<Motor[]>(this.api, { params, observe: 'response' }).pipe(
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

  // Contagem total de registros
  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.api}/count`);
  }

  // Buscar por ID
  findById(id: number | string): Observable<Motor> {
    return this.httpClient.get<Motor>(`${this.api}/${id}`).pipe(
      tap(dado => console.log('Dado recebido do backend (findById):', dado))
    );
  }

  // Criar novo motor
  create(motor: Motor): Observable<Motor> {
    console.log('Enviando dados para criação (POST):', motor);
    return this.httpClient.post<Motor>(this.api, motor).pipe(
      tap(res => console.log('Resposta da criação (POST):', res))
    );
  }

  // Atualizar motor existente
  update(motor: Motor): Observable<Motor> {
    return this.httpClient.put<Motor>(`${this.api}/${motor.id}`, motor);
  }

  // Deletar motor
  delete(id: number | string): Observable<void> {
    return this.httpClient.delete<void>(`${this.api}/${id}`);
  }

  // Enviar imagem para o SeaweedFS
  uploadImagem(idMotor: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('idMotor', idMotor.toString());
    formData.append('file', file);
    return this.httpClient.patch<void>(`${this.api}/images/upload`, formData);
  }

  // Deletar imagem do SeaweedFS e DB
  removerImagem(fid: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.api}/images/${fid}`);
  }
}
