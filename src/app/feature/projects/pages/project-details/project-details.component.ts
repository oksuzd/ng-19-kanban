import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject, signal, computed
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BoardsStore } from '../../../../state/boards.store';
import { ProjectsStore } from '../../../../state/projects.store';
import {
  ConfirmDialogComponent
} from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { Board } from '../../../../data-access/models';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [RouterLink, ConfirmDialogComponent],
  templateUrl: './project-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BoardsStore]
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  boardsStore = inject(BoardsStore);
  projectsStore = inject(ProjectsStore);

  projectId!: number;

  readonly isDeleteBoardDialogOpen = signal(false);
  readonly boardIdToDelete = signal<number | null>(null);
  readonly boardNameToDelete = signal<string | null>(null);

  readonly deleteBoardMessage = computed(() => {
    const name = this.boardNameToDelete();
    return name ? `Delete board "${name}"?` : 'Delete this board?';
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (isNaN(id)) return;

    this.projectId = id;
    this.projectsStore.selectedId.set(id);
    void this.projectsStore.refresh();
    void this.boardsStore.load(id);
  }

  createBoard() {
    const name = prompt('Board name?');
    if (name?.trim()) this.boardsStore.create(this.projectId, name.trim());
  }

  renameBoard(id: number, current: string) {
    const name = prompt('New name:', current);
    if (name && name !== current)
      this.boardsStore.rename(id, name, this.projectId);
  }

  openBoard(id: number) {
    this.router.navigate(['/project', this.projectId, 'board', id]);
  }

  openDeleteBoardDialog(board: Board) {
    this.boardIdToDelete.set(board.id);
    this.boardNameToDelete.set(board.name);
    this.isDeleteBoardDialogOpen.set(true);
  }

  async confirmDeleteBoard() {
    const id = this.boardIdToDelete();
    if (id == null) {
      this.isDeleteBoardDialogOpen.set(false);
      return;
    }

    await this.boardsStore.remove(id, this.projectId);

    this.isDeleteBoardDialogOpen.set(false);
    this.boardIdToDelete.set(null);
    this.boardNameToDelete.set(null);
  }

  cancelDeleteBoard() {
    this.isDeleteBoardDialogOpen.set(false);
    this.boardIdToDelete.set(null);
    this.boardNameToDelete.set(null);
  }
}
