import { inject, signal, computed } from '@angular/core';
import { ColumnsRepository } from '../data-access/columns.repository';
import { CardsRepository } from '../data-access/cards.repository';
import { Column, Card } from '../data-access/models';
import { firstValueFrom } from 'rxjs';

export class BoardStore {
  private readonly columnsRepo = inject(ColumnsRepository);
  private readonly cardsRepo = inject(CardsRepository);

  readonly columns = signal<Column[]>([]);
  readonly cards = signal<Card[]>([]);

  readonly cardsByColumn = computed(() => {
    const map: Record<number, Card[]> = {};
    for (const card of this.cards()) {
      const columnId = card.columnId;
      if (!map[columnId]) map[columnId] = [];
      map[columnId].push(card);
    }

    Object.values(map).forEach(list => list.sort((a, b) => a.order - b.order));
    return map;
  });

  async load(boardId: number) {
    const [columns, cards] = await Promise.all([
      firstValueFrom(this.columnsRepo.listByBoard(boardId)),
      firstValueFrom(this.cardsRepo.listByBoard(boardId)),
    ]);
    this.columns.set(columns);
    this.cards.set(cards);
  }

  async createCard(boardId: number, columnId: number, title: string, description: string) {
    await firstValueFrom(this.cardsRepo.create(boardId, columnId, title, description));
    await this.load(boardId);
  }

  async updateCard(boardId: number, card: Partial<Card> & { id: number }) {
    await firstValueFrom(this.cardsRepo.update(card));
    await this.load(boardId);
  }

  async deleteCard(boardId: number, id: number) {
    await firstValueFrom(this.cardsRepo.remove(id));
    await this.load(boardId);
  }

  //TODO
  // методы для колонок (создать/переименовать/удалить/сменить порядок)
}
