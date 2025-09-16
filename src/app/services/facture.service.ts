import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';
export interface DetailFacture {
  id?: number;
  quantity: number;
  montant?: number;
  article: { id: number; nom?: string; prix?: number; tva?: number };
  fournisseur?: { id: number; nom?: string };
  facture?: { id: number };
}

export interface Facture {
  id?: number;
  numero: number;
  date: string;
  fournisseur?: { id: number; nom?: string };
  details?: DetailFacture[];
  montantTotal?: number;
}
@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private apiUrl = 'http://localhost:8080/api/factures';
  private factureUrl = 'http://localhost:8080/api/factures';
  private detailUrl = 'http://localhost:8080/api/details';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Facture[]> {
    return this.http.get<Facture[]>(this.factureUrl);
  }
getDetailsByFactureId(factureId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/details/${factureId}`);
  }

  getFacturesByFournisseur(fournisseurId: number): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.factureUrl}/${fournisseurId}`);
  }


  /** Create a new facture */
  create(facture: Facture): Observable<Facture> {
    return this.http.post<Facture>(this.apiUrl, facture);
  }

  /** Validate a facture */
  validateFacture(facture: Facture): Observable<Facture> {
    return this.http.post<Facture>(`${this.apiUrl}/validate`, facture);
  }

  /** Delete facture by ID */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getDetailsByFacture(factureId: number): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.detailUrl}/facture/${factureId}`);
  }
  getFactureArticle(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/article/${id}`);
  }
   getFactureQuantity(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/quantity/${id}`);
  }
    getFactureNumero(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/numero/${id}`);
  }

  // GET /fournisseurobj/{id}
  getFactureFournisseur(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fournisseurobj/${id}`);
  }
   addDetail(detail: DetailFacture): Observable<DetailFacture> {
    return this.http.post<DetailFacture>(this.detailUrl, detail);
  }
    updateDetail(id: number, detail: DetailFacture): Observable<DetailFacture> {
    return this.http.put<DetailFacture>(`${this.detailUrl}/${id}`, detail);
  }
    updateFacture(id: number, facture: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.apiUrl}/${id}`, facture);
  }
    getFactureDate(id: number): Observable<string> {
    // backend sends ISO string, Angular will parse it
    return this.http.get<string>(`${this.apiUrl}/date/${id}`);
  }
   deleteDetail(id: number): Observable<void> {
    return this.http.delete<void>(`${this.detailUrl}/${id}`);
  }
}
