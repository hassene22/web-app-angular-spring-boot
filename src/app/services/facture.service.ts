import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  deleteFacture(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateFacture(id: any, value: any) {
   return this.http.put(`${this.apiUrl}/${id}`, value);
  }
  private apiUrl = 'http://localhost:8080/api/factures';

  constructor(private http: HttpClient) {}

  getFactures(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createFacture(facture: any): Observable<any> {
    return this.http.post(this.apiUrl, facture);
  }
}