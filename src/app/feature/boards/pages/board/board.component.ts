import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BoardStore } from '../../../../state/board.store';
import { ProjectsStore } from '../../../../state/projects.store';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BoardStore]
})
export class BoardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly boardStore = inject(BoardStore);
  readonly projectsStore = inject(ProjectsStore);

  projectId!: number;
  boardId!: number;

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

  async addCard(columnId: number) {
    const title = prompt('Card title?');
    if (title?.trim()) {
      await this.boardStore.createCard(this.boardId, columnId, title.trim());
    }
  }

  async editCard(cardId: number,
                 currentTitle: string | undefined,
                 currentDescription: string | undefined) {
    const title = prompt('New title:', currentTitle ?? '');
    if (!title) return;

    const description = prompt('Description:', currentDescription ?? '') ?? '';

    await this.boardStore.updateCard(this.boardId, {
      id: cardId,
      title: title.trim(),
      description: description.trim(),
    });
  }

  async deleteCard(cardId: number) {
    if (!confirm('Delete card?')) return;
    await this.boardStore.deleteCard(this.boardId, cardId);
  }

  backToProject() {
    void this.router.navigate(['/project', this.projectId]);
  }
}

