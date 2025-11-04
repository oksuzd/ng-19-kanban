import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from './models';
import { Observable } from 'rxjs';

const API = 'http://localhost:4300';

@Injectable({ providedIn: 'root' })
export class ProjectsRepository {
  private http = inject(HttpClient);

  list(): Observable<Project[]> {
    return this.http.get<Project[]>(`${API}/projects?_sort=id&_order=asc`);
  }

  create(name: string) {
    const body = { name, createdAt: new Date().toISOString() };
    return this.http.post<Project>(`${API}/projects`, body);
  }

  rename(id: number, name: string) {
    return this.http.patch<Project>(`${API}/projects/${id}`, { name });
  }

  remove(id: number) {
    return this.http.delete<void>(`${API}/projects/${id}`);
  }
}
