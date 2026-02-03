import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NewTaskDialog } from './new-task-dialog';
import { TaskStore } from '@/stores/task-store/task-store';
import { signal, WritableSignal } from '@angular/core';

describe('NewTaskDialog', () => {
  let component: NewTaskDialog;
  let fixture: ComponentFixture<NewTaskDialog>;
  let taskStoreMock: { isNewTaskRequestInProgress: WritableSignal<boolean> };

  beforeEach(async () => {
    taskStoreMock = {
      isNewTaskRequestInProgress: signal(false)
    };

    await TestBed.configureTestingModule({
      imports: [NewTaskDialog],
      providers: [
        { provide: TaskStore, useValue: taskStoreMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTaskDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the dialog when openDialog is called', () => {
    const dialogElement = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    const showModal = vi.fn();
    dialogElement.showModal = showModal;

    component.openDialog();

    expect(showModal).toHaveBeenCalledOnce();
  });

  it('should close the dialog when closeDialog is called', () => {
    const dialogElement = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    const close = vi.fn();
    dialogElement.close = close;

    component.closeDialog();

    expect(close).toHaveBeenCalledOnce();
  });

  it('should apply the in-progress class when request is in progress', async () => {
    taskStoreMock.isNewTaskRequestInProgress.set(true);

    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('.close-button') as HTMLButtonElement;
    expect(button.classList.contains('close-button-play')).toBe(true);
  });
});
