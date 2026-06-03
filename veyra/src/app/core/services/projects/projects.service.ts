import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../../../core/class/project.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getProjects(clientId?: string, status?: string): Observable<Project[]> {
    let params = new HttpParams();
    if (clientId) params = params.set('clientId', clientId);
    if (status) params = params.set('status', status);
    return this.http.get<Project[]>(this.apiUrl, { params });
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createProject(data: any): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, data);
  }

  updateProject(id: string, data: any): Observable<Project> {
    return this.http.patch<Project>(`${this.apiUrl}/${id}`, data);
  }

  deleteProject(id: string): Observable<Project> {
    return this.http.delete<Project>(`${this.apiUrl}/${id}`);
  }
}
