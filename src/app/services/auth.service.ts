import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom, Observable ,BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
 
public role: string | null = null;
 public isLoggedInStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 public  currentuser : { email: string; role: string} | null = null;
  constructor(private http: HttpClient, private router: Router) {
      const storedUser = localStorage.getItem('user');
  if (storedUser) {
    this.currentuser = JSON.parse(storedUser);
    this.role = this.currentuser!.role;
    this.isLoggedInStatus.next(true);
  }
  }

 async login(email: string, password: string): Promise<void> {
    try {
      const res = await lastValueFrom(
        this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      );
    this.role = res.role;
    this.currentuser={email:email,role:res.role};
      this.isLoggedInStatus.next(true);
          // Save to localStorage
    localStorage.setItem('user', JSON.stringify(this.currentuser));
     

      if (this.role === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  }

async getRole(id: string): Promise<string> {
  return await lastValueFrom(this.http.get<string>(`${this.apiUrl}/${id}`));
}

 async isAdmin(id: string): Promise<boolean> {
  return (await this.getRole(id)) === 'ADMIN';
}

async isUser(id: string): Promise<boolean> {
  return await this.getRole(id) === 'USER';
}
isloggedIn():Observable< boolean> {
  return this.isLoggedInStatus.asObservable();

}
logout(): void {
  this.isLoggedInStatus.next(false);
  this.role = null;
   this.currentuser = null;
  localStorage.removeItem('user');
  this.router.navigate(['/login']);
}
}
