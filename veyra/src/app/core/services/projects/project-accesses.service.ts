import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectAccessesService {
  private apiUrl = `${environment.apiUrl}/project-accesses`;

  constructor(private http: HttpClient) {}

  getAccesses(projectId?: string): Observable<any[]> {
    let params = new HttpParams();
    if (projectId) {
      params = params.set('projectId', projectId);
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getAccessById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createAccess(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateAccess(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteAccess(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
