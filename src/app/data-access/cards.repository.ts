import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card } from './models';
import { Observable } from 'rxjs';

const API = 'http://localhost:4300';

@Injectable({ providedIn: 'root' })
export class CardsRepository {
  private http = inject(HttpClient);

  listByBoard(boardId: number): Observable<Card[]> {
    return this.http.get<Card[]>(`${API}/cards?boardId=${boardId}&_sort=order&_order=asc`);
  }

  create(boardId: number, columnId: number, title: string) {
    const now = new Date().toISOString();
    const body: Omit<Card, 'id'> = {
      boardId,
      columnId,
      title,
      description: '',
      assigneeId: null,
      priority: 'medium',
      tags: [],
      order: Date.now(),
      createdAt: now,
      updatedAt: now
    };
    return this.http.post<Card>(`${API}/cards`, body);
  }

  update(card: Partial<Card> & { id: number }) {
    return this.http.patch<Card>(`${API}/cards/${card.id}`, {
      ...card,
      updatedAt: new Date().toISOString()
    });
  }

  move(id: number, boardId: number, columnId: number, order: number) {
    return this.http.patch<Card>(`${API}/cards/${id}`, {
      boardId,
      columnId,
      order,
      updatedAt: new Date().toISOString()
    });
  }

  remove(id: number) {
    return this.http.delete<void>(`${API}/cards/${id}`);
  }
}
