import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  public currentUser = signal<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem('tracker_user');
    if (savedUser) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('tracker_user');
      }
    }
    this.checkProfile().subscribe();
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((user: any) => {
        if (user && user.token) {
          localStorage.setItem('tracker_token', user.token);
          localStorage.setItem('tracker_user', JSON.stringify(user));
        }
        this.currentUser.set(user);
      })
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((user: any) => {
        if (user && user.token) {
          localStorage.setItem('tracker_token', user.token);
          localStorage.setItem('tracker_user', JSON.stringify(user));
        }
        this.currentUser.set(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('tracker_token');
    localStorage.removeItem('tracker_user');
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {
        this.currentUser.set(null);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.currentUser.set(null);
        this.router.navigate(['/login']);
      }
    });
  }

  checkProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      })
    );
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, data).pipe(
        tap((user) => this.currentUser.set(user))
    );
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'Admin';
  }
}
