import { Component, inject, input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Task } from '@/models/task.model';
import { TaskStore } from '@/stores/task-store/task-store';
import { MatButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  standalone: true,
  selector: 'task-list-row',
  imports: [
    MatExpansionModule,
    MatButton,
    MatListModule,
    MatCheckbox,
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

  toggleStepsStatus(event: MatCheckboxChange, stepIndex: number) {
    const localTask = this.localTask!;
    localTask.steps[stepIndex].completed = event.checked;
    this.taskStore.updateTask(localTask);
  }
}
