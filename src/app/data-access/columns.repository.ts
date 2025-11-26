import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Column } from './models';
import { Observable } from 'rxjs';

const API = 'http://localhost:4300';

@Injectable({providedIn: 'root'})
export class ColumnsRepository {
  private http = inject(HttpClient);

  listByBoard(boardId: number): Observable<Column[]> {
    return this.http.get<Column[]>(`${API}/columns?boardId=${boardId}&_sort=order&_order=asc`);
  }

  create(boardId: number, name: string) {
    const body: Omit<Column, 'id'> = {
      boardId,
      name,
      order: Date.now(),
      wipLimit: null
    };
    return this.http.post<Column>(`${API}/columns`, body);
  }

  rename(id: number, name: string) {
    return this.http.patch<Column>(`${API}/columns/${id}`, {name});
  }

  updateOrder(id: number, order: number) {
    return this.http.patch<Column>(`${API}/columns/${id}`, {order});
  }

  remove(id: number) {
    return this.http.delete<void>(`${API}/columns/${id}`);
  }
}
