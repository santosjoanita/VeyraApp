import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectWorkersService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProjectWorkers(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/projects/${projectId}/workers`);
  }

  assignWorker(projectId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/projects/${projectId}/workers`, { userId });
  }

  removeWorker(projectId: string, userId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/projects/${projectId}/workers/${userId}`);
  }
}
