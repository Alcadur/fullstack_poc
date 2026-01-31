import { Component, input } from '@angular/core';
import { Task } from '@/models/task.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { TaskListRow } from '@/pages/tasks/components/task-list/task-list-row/task-list-row';

@Component({
  standalone: true,
  selector: 'task-list',
  imports: [MatExpansionModule, TaskListRow],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  tasks = input.required<Task[]>();
}
