import { Component, inject, viewChild } from '@angular/core';
import { TaskStore } from '@/stores/task-store/task-store';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { TopBar } from '@/pages/tasks/components/top-bar/top-bar';
import { TaskList } from '@/pages/tasks/components/task-list/task-list';
import { NewTaskDialog } from '@/pages/tasks/components/new-task-dialog/new-task-dialog';

@Component({
  selector: 'tasks-page',
  templateUrl: 'tasks-page.html',
  styleUrls: ['./tasks-page.css'],
  imports: [MatToolbarModule, MatButtonModule, TopBar, TaskList, NewTaskDialog],
  host: { class: 'tasks-page'},
})
export class TasksPage {
  readonly taskStore = inject(TaskStore);
  readonly tasks = this.taskStore.entities;
  readonly toDoLoading = this.taskStore.areToDoTasksLoading;
  readonly newTaskDialog = viewChild.required(NewTaskDialog);

  openNewTaskDialog() {
    this.newTaskDialog().openDialog();
  }

  constructor() {
    this.taskStore.loadToDoTasks();
  }
}
