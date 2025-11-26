import {Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';

@Component({
  selector: 'app-board',
  imports: [RouterLink],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  private readonly route = inject(ActivatedRoute);

  readonly projectId = Number(this.route.snapshot.paramMap.get('id'));
  readonly boardId = Number(this.route.snapshot.paramMap.get('boardId'));
}
