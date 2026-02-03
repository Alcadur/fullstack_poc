import { Component, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Step } from '@/models/task.model';

@Component({
  selector: 'task-step-field',
  imports: [
    FormsModule,
    MatInput,
    ReactiveFormsModule,
    MatFormField,
    MatCheckboxModule,
    MatButtonModule,
    MatLabel
  ],
  templateUrl: './task-step-field.html',
  styleUrl: './task-step-field.css',
})
export class TaskStepField {
  onStepAdd = output<Step>();

  stepForm = new FormGroup({
    completed: new FormControl<boolean>(false, { nonNullable: true }),
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  });

  addStep(event: Event) {
    event.preventDefault();
    this.onStepAdd.emit(this.stepForm.getRawValue());
    this.stepForm.reset();
  }
}
