import { Component, inject } from '@angular/core';
import { TaskStore } from '@/stores/task-store/task-store';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { TopBar } from '@/pages/tasks/components/top-bar/top-bar';
import { TaskList } from '@/pages/tasks/components/task-list/task-list';

@Component({
  selector: 'tasks-page',
  templateUrl: 'tasks-page.html',
  styleUrls: ['./tasks-page.css'],
  imports: [MatToolbarModule, MatButtonModule, TopBar, TaskList],
  host: { class: 'tasks-page'},
})
export class TasksPage {
  readonly taskStore = inject(TaskStore);
  readonly tasks = this.taskStore.entities;
  readonly toDoLoading = this.taskStore.areToDoTasksLoading;

  constructor() {
    this.taskStore.loadToDoTasks();
  }
}
