import {Component, inject, OnInit} from '@angular/core';
import {ProjectsStore} from '../../../../state/projects.store';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-projects-list',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css',
})
export class ProjectsListComponent implements OnInit {
  readonly store = inject(ProjectsStore);

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

  async remove(id: number) {
    if (confirm('Delete project?')) await this.store.remove(id);
  }

  select(id: number) {
    this.store.selectedId.set(id);
  }
}
