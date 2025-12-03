import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProjectsStore } from '../../../../state/projects.store';
import { Router } from '@angular/router';
import {
  ConfirmDialogComponent
} from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';
import {
  NameDialogComponent
} from '../../../../shared/ui/name-dialog/name-dialog.component';

@Component({
  selector: 'app-projects-list',
  imports: [ConfirmDialogComponent, NameDialogComponent],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css',
})
export class ProjectsListComponent implements OnInit {
  private readonly router = inject(Router);
  readonly store = inject(ProjectsStore);

  readonly isDeleteProjectDialogOpen = signal(false);
  readonly projectIdToDelete = signal<number | null>(null);
  readonly projectNameToDelete = signal<string | null>(null);

  readonly deleteProjectMessage = computed(() => {
    const name = this.projectNameToDelete();
    return name ? `Delete project "${name}"?` : 'Delete this project?';
  });

  readonly isProjectNameDialogOpen = signal(false);
  readonly editingProjectId = signal<number | null>(null);
  readonly editingProjectName = signal('');

  readonly projectNameDialogTitle = computed(() =>
    this.editingProjectId() == null ? 'New project' : 'Rename project',
  );

  readonly projectNameDialogConfirmLabel = computed(() =>
    this.editingProjectId() == null ? 'Create' : 'Save',
  );

  ngOnInit() {
    void this.store.refresh();
  }

  select(id: number) {
    this.store.selectedId.set(id);
    void this.router.navigate(['/project', id]);
  }

  openCreateProjectDialog() {
    this.editingProjectId.set(null);
    this.editingProjectName.set('');
    this.isProjectNameDialogOpen.set(true);
  }

  openRenameProjectDialog(id: number, currentName: string) {
    this.editingProjectId.set(id);
    this.editingProjectName.set(currentName);
    this.isProjectNameDialogOpen.set(true);
  }

  async handleProjectNameConfirmed(name: string) {
    const id = this.editingProjectId();
    if (id == null) {
      await this.store.create(name);
    } else {
      await this.store.rename(id, name);
    }

    this.isProjectNameDialogOpen.set(false);
    this.editingProjectId.set(null);
    this.editingProjectName.set('');
  }

  cancelProjectNameDialog() {
    this.isProjectNameDialogOpen.set(false);
    this.editingProjectId.set(null);
    this.editingProjectName.set('');
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
