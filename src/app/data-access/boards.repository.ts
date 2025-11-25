import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Board } from './models';
import { Observable } from 'rxjs';

const API = 'http://localhost:4300';

@Injectable({ providedIn: 'root' })
export class BoardsRepository {
  private http = inject(HttpClient);

  listByProject(projectId: number): Observable<Board[]> {
    return this.http.get<Board[]>(`${API}/boards?projectId=${projectId}&_sort=order&_order=asc`);
  }

  create(projectId: number, name: string) {
    const body = { projectId, name, order: Date.now() };
    return this.http.post<Board>(`${API}/boards`, body);
  }

  rename(id: number, name: string) {
    return this.http.patch<Board>(`${API}/boards/${id}`, { name });
  }

  remove(id: number) {
    return this.http.delete<void>(`${API}/boards/${id}`);
  }
}
