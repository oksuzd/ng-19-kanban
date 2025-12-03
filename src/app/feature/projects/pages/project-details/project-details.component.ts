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
import {
  NameDialogComponent
} from '../../../../shared/ui/name-dialog/name-dialog.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [RouterLink, ConfirmDialogComponent, NameDialogComponent],
  templateUrl: './project-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BoardsStore]
})
export class ProjectDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly boardsStore = inject(BoardsStore);
  readonly projectsStore = inject(ProjectsStore);

  projectId!: number;

  readonly isDeleteBoardDialogOpen = signal(false);
  readonly boardIdToDelete = signal<number | null>(null);
  readonly boardNameToDelete = signal<string | null>(null);

  readonly deleteBoardMessage = computed(() => {
    const name = this.boardNameToDelete();
    return name ? `Delete board "${name}"?` : 'Delete this board?';
  });

  readonly isBoardNameDialogOpen = signal(false);
  readonly editingBoardId = signal<number | null>(null);
  readonly editingBoardName = signal('');

  readonly boardNameDialogTitle = computed(() =>
    this.editingBoardId() == null ? 'New board' : 'Rename board',
  );

  readonly boardNameDialogConfirmLabel = computed(() =>
    this.editingBoardId() == null ? 'Create' : 'Save',
  );

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.projectId = id;
      this.boardsStore.load(id);
      this.projectsStore.selectedId.set(id);
    });
  }

  openBoard(board: Board) {
    this.router.navigate(['/project', this.projectId, 'board', board.id]);
  }

  openCreateBoardDialog() {
    this.editingBoardId.set(null);
    this.editingBoardName.set('');
    this.isBoardNameDialogOpen.set(true);
  }

  openRenameBoardDialog(id: number, currentName: string) {
    this.editingBoardId.set(id);
    this.editingBoardName.set(currentName);
    this.isBoardNameDialogOpen.set(true);
  }

  async handleBoardNameConfirmed(name: string) {
    const id = this.editingBoardId();
    if (id == null) {
      await this.boardsStore.create(this.projectId, name);
    } else {
      await this.boardsStore.rename(id, name, this.projectId);
    }

    this.isBoardNameDialogOpen.set(false);
    this.editingBoardId.set(null);
    this.editingBoardName.set('');
  }

  cancelBoardNameDialog() {
    this.isBoardNameDialogOpen.set(false);
    this.editingBoardId.set(null);
    this.editingBoardName.set('');
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
