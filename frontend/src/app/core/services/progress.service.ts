import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUrl = environment.apiUrl + '/progress';

  constructor(private http: HttpClient) {}

  addProgress(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getSkillProgress(skillId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/skill/${skillId}`);
  }
}
