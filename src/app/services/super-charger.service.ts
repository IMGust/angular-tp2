import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuperCharger } from '../models/super-charger.model';

import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class SuperChargerService {

  private readonly api = 'http://localhost:8080/supercharger';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Page<SuperCharger>> {
    let params: any = {};
    if (page !== undefined && pageSize !== undefined) {
      params.page = page.toString();
      params.pageSize = pageSize.toString();
    }
    return this.httpClient.get<SuperCharger[]>(this.api, { params, observe: 'response' }).pipe(
      map(response => {
        return {
          content: response.body || [],
          totalElements: Number(response.headers.get('x-total-count') || 0),
          size: Number(response.headers.get('x-page-size') || pageSize || 10),
          number: Number(response.headers.get('x-page') || page || 0)
        };
      })
    );
  }

  findById(id: number | string): Observable<SuperCharger> {
    return this.httpClient.get<SuperCharger>(`${this.api}/${id}`);
  }

  create(sc: SuperCharger): Observable<SuperCharger> {
    return this.httpClient.post<SuperCharger>(this.api, sc);
  }

  update(sc: SuperCharger): Observable<SuperCharger> {
    return this.httpClient.put<SuperCharger>(`${this.api}/${sc.id}`, sc);
  }

  delete(id: number | string): Observable<void> {
    return this.httpClient.delete<void>(`${this.api}/${id}`);
  }
}
