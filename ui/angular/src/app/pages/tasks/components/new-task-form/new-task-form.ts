import { Component, inject } from '@angular/core';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Step, Task } from '@/models/task.model';
import { TaskStepField } from './task-step-field/task-step-field';
import { TaskStepListRow } from './task-step-list-row/task-step-list-row';
import { MatListModule } from '@angular/material/list';
import { descriptionOrStepsRequired } from './new-task-form.validators';
import { TaskStore } from '@/stores/task-store/task-store';

@Component({
  standalone: true,
  selector: 'new-task-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButtonModule,
    TaskStepField,
    TaskStepListRow,
    MatListModule,
    MatError
  ],
  templateUrl: './new-task-form.html',
  styleUrl: './new-task-form.css',
})
export class NewTaskForm {
  readonly taskStore = inject(TaskStore);
  taskForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    description: new FormControl<string>('', { nonNullable: true }),
    steps: new FormArray<FormControl<Step>>([])
  }, { validators: [descriptionOrStepsRequired] });

  get steps(): FormArray<FormControl<Step>> {
    return this.taskForm.controls.steps;
  }

  get isRequestInProgress(): boolean {
    return this.taskStore.isNewTaskRequestInProgress();
  }

  addStep(step: Step) {
    this.steps.push(new FormControl(step, {
      nonNullable: true,
      validators: [Validators.required] // Validating that the Step object itself is present
    }));
    this.taskForm.updateValueAndValidity();
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
    this.taskForm.updateValueAndValidity();
  }

  onSubmit() {
    if (this.taskForm.valid && !this.isRequestInProgress) {
      this.taskStore.addTask(this.taskForm.getRawValue() as Task);
      this.taskForm.reset();
      this.taskForm.controls.steps.clear();
    }
  }
}
