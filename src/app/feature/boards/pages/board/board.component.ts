import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject, signal, computed
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BoardStore } from '../../../../state/board.store';
import { ProjectsStore } from '../../../../state/projects.store';
import { Card } from '../../../../data-access/models';
import {
  ConfirmDialogComponent
} from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BoardStore],
})
export class BoardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly boardStore = inject(BoardStore);
  readonly projectsStore = inject(ProjectsStore);

  projectId!: number;
  boardId!: number;

  readonly isCardModalOpen = signal(false);
  readonly editingCard = signal<Card | null>(null);
  readonly currentColumnId = signal<number | null>(null);

  readonly cardModalTitle = computed(() =>
    this.editingCard() ? 'Edit card' : 'New card'
  );

  readonly cardForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: [''],
  });

  readonly isDeleteCardDialogOpen = signal(false);
  readonly cardIdToDelete = signal<number | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const projectId = Number(params.get('id'));
      const boardId = Number(params.get('boardId'));
      this.projectId = projectId;
      this.boardId = boardId;

      this.projectsStore.selectedId.set(projectId);
      void this.boardStore.load(boardId);
    });
  }

  openCreateCardModal(columnId: number) {
    this.editingCard.set(null);
    this.currentColumnId.set(columnId);
    this.cardForm.reset({
      title: '',
      description: '',
    });
    this.isCardModalOpen.set(true);
  }

  openEditCardModal(card: Card) {
    this.editingCard.set(card);
    this.currentColumnId.set(card.columnId);
    this.cardForm.reset({
      title: card.title ?? '',
      description: card.description ?? '',
    });
    this.isCardModalOpen.set(true);
  }

  closeCardModal() {
    this.isCardModalOpen.set(false);
  }

  async submitCardForm() {
    if (this.cardForm.invalid || this.currentColumnId() == null) return;

    const { title, description } = this.cardForm.getRawValue();
    const columnId = this.currentColumnId()!;

    if (!this.editingCard()) {
      await this.boardStore.createCard(this.boardId, columnId, title.trim(), description.trim());
    } else {
      await this.boardStore.updateCard(this.boardId, {
        id: this.editingCard()!.id,
        title: title.trim(),
        description: description.trim(),
        columnId,
      });
    }

    this.isCardModalOpen.set(false);
  }

  openDeleteCardDialog(cardId: number) {
    this.cardIdToDelete.set(cardId);
    this.isDeleteCardDialogOpen.set(true);
  }

  async confirmDeleteCard() {
    const id = this.cardIdToDelete();
    if (id == null) {
      this.isDeleteCardDialogOpen.set(false);
      return;
    }

    await this.boardStore.deleteCard(this.boardId, id);
    this.isDeleteCardDialogOpen.set(false);
    this.cardIdToDelete.set(null);
  }

  cancelDeleteCard() {
    this.isDeleteCardDialogOpen.set(false);
    this.cardIdToDelete.set(null);
  }

  backToProject() {
    void this.router.navigate(['/project', this.projectId]);
  }
}
