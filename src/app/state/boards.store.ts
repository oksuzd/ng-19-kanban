import { Injectable, computed, inject, signal } from '@angular/core';
import { BoardsRepository } from '../data-access/boards.repository';
import { Board } from '../data-access/models';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BoardsStore {
  private readonly repo = inject(BoardsRepository);

  readonly boards = signal<Board[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly isEmpty = computed(() => this.boards().length === 0 && !this.loading());

  async load(projectId: number): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const list = await firstValueFrom(this.repo.listByProject(projectId));
      this.boards.set(list);
    } catch (e) {
      console.error('Failed to load boards', e);
      this.error.set('Failed to load boards');
    } finally {
      this.loading.set(false);
    }
  }

  async create(projectId: number, name: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.repo.create(projectId, name));
      await this.load(projectId);
    } catch (e) {
      console.error('Failed to create board', e);
      this.error.set('Failed to create board');
    } finally {
      this.loading.set(false);
    }
  }

  async rename(id: number, name: string, projectId: number): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.repo.rename(id, name));
      await this.load(projectId);
    } catch (e) {
      console.error('Failed to rename board', e);
      this.error.set('Failed to rename board');
    } finally {
      this.loading.set(false);
    }
  }

  async remove(id: number, projectId: number): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.repo.remove(id));
      await this.load(projectId);
    } catch (e) {
      console.error('Failed to remove board', e);
      this.error.set('Failed to remove board');
    } finally {
      this.loading.set(false);
    }
  }
}
