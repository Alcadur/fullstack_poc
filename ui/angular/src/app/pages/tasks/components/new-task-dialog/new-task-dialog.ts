import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NewTaskForm } from '@/pages/tasks/components/new-task-form/new-task-form';
import { TaskStore } from '@/stores/task-store/task-store';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'new-task-dialog',
  imports: [
    MatButtonModule,
    NewTaskForm,
    NgClass
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ],
  templateUrl: './new-task-dialog.html',
  styleUrl: './new-task-dialog.css',
})
export class NewTaskDialog {
  readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  readonly taskStore = inject(TaskStore);

  get isRequestInProgress(): boolean {
    return this.taskStore.isNewTaskRequestInProgress();
  }

  openDialog() {
    this.dialog().nativeElement.showModal();
  }

  closeDialog() {
    this.dialog().nativeElement.close();
  }
}
