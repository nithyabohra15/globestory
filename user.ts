import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  /** Signup */
  signup(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { email, password }).pipe(
      tap(() => {
        // Save login state immediately after signup
        localStorage.setItem('user', JSON.stringify({ email }));
      })
    );
  }

  /** Login */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(() => {
        // Save user data in localStorage so navbar can detect login
        localStorage.setItem('user', JSON.stringify({ email }));
      })
    );
  }

  /** Logout */
  logout() {
    localStorage.removeItem('user');
  }

  /** Check if logged in */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}


