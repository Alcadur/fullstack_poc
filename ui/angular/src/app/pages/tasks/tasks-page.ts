import { Component, inject } from '@angular/core';
import { TaskStore } from '@/stores/task-store/task-store';
import { UserStore } from '@/stores/user-store/user-store';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { TopBar } from '@/pages/tasks/components/top-bar/top-bar';

@Component({
  selector: 'tasks-page',
  templateUrl: 'tasks-page.html',
  styleUrls: ['./tasks-page.css'],
  imports: [MatToolbarModule, MatButtonModule, TopBar],
  host: { class: 'tasks-page'},
})
export class TasksPage {
  readonly taskStore = inject(TaskStore);
  readonly userStore = inject(UserStore);
  readonly user = this.userStore.user()!;

  constructor() {
    this.taskStore.loadTasks(this.user.uuid);
  }
}
