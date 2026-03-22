import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private apiUrl = environment.apiUrl + '/goals';

  constructor(private http: HttpClient) {}

  getGoals(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createGoal(goal: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, goal);
  }

  updateGoal(id: string, goal: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, goal);
  }

  deleteGoal(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
