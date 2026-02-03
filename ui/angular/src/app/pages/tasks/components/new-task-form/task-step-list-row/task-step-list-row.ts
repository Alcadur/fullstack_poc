import { Component, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Step } from '@/models/task.model';
import { MatListItem } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'task-step-list-row',
  imports: [
    MatListItem,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './task-step-list-row.html',
  styleUrl: './task-step-list-row.css',
})
export class TaskStepListRow {
  stepControl = input.required<FormControl<Step>>();
  onRemove = output();

  onStatusChange() {
    const currentStep = this.stepControl().getRawValue();
    this.stepControl().patchValue({ ...currentStep, completed: !currentStep.completed});
  }
}
