import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = environment.apiUrl + '/skills';

  constructor(private http: HttpClient) {}

  getSkills(filters?: any): Observable<any[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.category && filters.category.length > 0) params = params.set('category', filters.category.join(','));
      if (filters.level) params = params.set('level', filters.level);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getSkillById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createSkill(skill: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, skill);
  }

  updateSkill(id: string, skill: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, skill);
  }

  deleteSkill(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }
}
