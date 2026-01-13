import { Component, inject, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Task } from '@/models/task.model';
import { TaskStore } from '@/stores/task-store/task-store';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  standalone: true,
  selector: 'task-list-row',
  imports: [
    MatExpansionModule,
    MatButtonToggleModule
  ],
  templateUrl: './task-list-row.html',
  styleUrl: './task-list-row.css',
})
export class TaskListRow {
  taskStore = inject(TaskStore);
  task = input.required<Task>();

  toggleCompleted(event: MouseEvent) {
    event.stopPropagation();
    const task = this.task();
    this.taskStore.toggleTaskCompleted([task.uuid, !task.completed]);
  }
}
