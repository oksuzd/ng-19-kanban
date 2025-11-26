import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BoardsStore} from '../../../../state/boards.store';
import {ProjectsStore} from '../../../../state/projects.store';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [RouterLink],
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

  removeBoard(id: number) {
    if (confirm('Delete board?'))
      this.boardsStore.remove(id, this.projectId);
  }

  openBoard(id: number) {
    this.router.navigate(['/project', this.projectId, 'board', id]);
  }
}
