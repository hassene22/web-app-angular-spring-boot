import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Article } from '../models/article.model';
@Injectable({
  providedIn: 'root'
})
export class ArticleService {
   
  private apiUrl = 'http://localhost:8080/api/articles';

  constructor(private http: HttpClient,
    private authService: AuthService
     ) {}
 getAllArticles(): Observable<any> {
    return this.http.get<Article[]>(this.apiUrl);
    }
      getArticles(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
 createArticle(article: any): Observable<any> {
    return this.http.post(this.apiUrl, article);
  }

  updateArticle(id: number, article: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, article);
  }
  getNextInvoiceNumber(): Observable<any> {
  return this.http.get<any>('/api/invoices/next-number');
}

validateInvoice(invoiceData: any): Observable<any> {
  return this.http.post('/api/invoices', invoiceData);
}

  deleteArticle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}