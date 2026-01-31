import { Component, inject, input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Task } from '@/models/task.model';
import { TaskStore } from '@/stores/task-store/task-store';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  standalone: true,
  selector: 'task-list-row',
  imports: [
    MatExpansionModule,
    MatButton,
  ],
  templateUrl: './task-list-row.html',
  styleUrl: './task-list-row.css',
})
export class TaskListRow implements OnInit {
  taskStore = inject(TaskStore);
  task = input.required<Task>();
  localTask?: Task;

  ngOnInit(): void {
    this.localTask = structuredClone(this.task());
  }

  toggleCompleted(event: MouseEvent) {
    event.stopPropagation();
    const localTask = this.localTask!;
    localTask.completed = !localTask.completed;
    this.taskStore.updateTask(localTask);
  }
}
