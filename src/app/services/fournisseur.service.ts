import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
interface Fournisseur {
  id?: number;
  code: string;
  nom: string;
  adresse?: string;
  email?: string;
  tel?: string;
  firstName?: string;
  lastName?: string;
}


@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
private apiUrl = 'http://localhost:8080/api/fournisseurs';

  constructor(private http: HttpClient) {}

  deleteFournisseur(id: number) {
     return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateFournisseur(id: number, fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${this.apiUrl}/${id}`, fournisseur);
  }

  getFournisseurs(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  searchFournisseurs(term: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?term=${term}`);
  }

  createFournisseur(fournisseur: any): Observable<any> {
    return this.http.post(this.apiUrl, fournisseur);
  }
}