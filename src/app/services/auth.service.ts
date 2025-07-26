import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
getToken(): string | null {
    return localStorage.getItem('token'); // Adjust based on where your token is stored
  }
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    console.log('Refresh Token:', refreshToken); // Debug
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http.post(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      catchError((err) => {
        console.error('Refresh token error:', err);
        this.logout();
        return throwError(() => new Error('Failed to refresh token'));
      })
    );
  }
}

  

