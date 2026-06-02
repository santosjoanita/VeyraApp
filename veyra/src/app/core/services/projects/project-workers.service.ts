import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectWorkersService {
  private apiUrl = 'http://localhost:3000/project-workers';

  constructor(private http: HttpClient) {}

  getProjectWorkers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  assignWorker(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  removeWorker(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
