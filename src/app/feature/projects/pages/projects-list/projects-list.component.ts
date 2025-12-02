import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {ProjectsStore} from '../../../../state/projects.store';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  ConfirmDialogComponent
} from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-projects-list',
  imports: [RouterLink, RouterLinkActive, ConfirmDialogComponent],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css',
})
export class ProjectsListComponent implements OnInit {
  readonly store = inject(ProjectsStore);

  readonly isDeleteProjectDialogOpen = signal(false);
  readonly projectIdToDelete = signal<number | null>(null);
  readonly projectNameToDelete = signal<string | null>(null);

  readonly deleteProjectMessage = computed(() => {
    const name = this.projectNameToDelete();
    return name ? `Delete project "${name}"?` : 'Delete this project?';
  });

  ngOnInit() {
    void this.store.refresh();
  }

  async create() {
    const name = prompt('Project name?');
    if (name?.trim()) await this.store.create(name.trim());
  }

  async rename(id: number, current: string) {
    const name = prompt('New name:', current?.trim() ?? '');
    if (name && name !== current) await this.store.rename(id, name.trim());
  }

  select(id: number) {
    this.store.selectedId.set(id);
  }

  openDeleteProjectDialog(id: number, name: string) {
    this.projectIdToDelete.set(id);
    this.projectNameToDelete.set(name);
    this.isDeleteProjectDialogOpen.set(true);
  }

  async confirmDeleteProject() {
    const id = this.projectIdToDelete();
    if (id == null) {
      this.isDeleteProjectDialogOpen.set(false);
      return;
    }

    await this.store.remove(id);

    this.isDeleteProjectDialogOpen.set(false);
    this.projectIdToDelete.set(null);
    this.projectNameToDelete.set(null);
  }

  cancelDeleteProject() {
    this.isDeleteProjectDialogOpen.set(false);
    this.projectIdToDelete.set(null);
    this.projectNameToDelete.set(null);
  }
}
