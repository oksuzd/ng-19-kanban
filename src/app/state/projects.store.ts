import {computed, inject, Injectable, signal} from '@angular/core';
import { ProjectsRepository } from '../data-access/projects.repository';
import { Project } from '../data-access/models';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectsStore {
  private repo = inject(ProjectsRepository);

  projects = signal<Project[]>([]);
  selectedId = signal<number | null>(null);
  selected = computed(() => {
    const id = this.selectedId();
    return this.projects().find(p => p.id === id) ?? null;
  });

  async refresh() {
    const list = await firstValueFrom(this.repo.list());
    this.projects.set(list);
  }

  async create(name: string) {
    await firstValueFrom(this.repo.create(name));
    await this.refresh();
  }

  async rename(id: number, name: string) {
    await firstValueFrom(this.repo.rename(id, name));
    await this.refresh();
  }

  async remove(id: number) {
    await firstValueFrom(this.repo.remove(id));
    if (this.selectedId() === id) this.selectedId.set(null);
    await this.refresh();
  }
}
