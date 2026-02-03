import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NewTaskForm } from './new-task-form';
import { TaskStore } from '@/stores/task-store/task-store';
import { Step, Task } from '@/models/task.model';

describe('NewTaskForm', () => {
  let component: NewTaskForm;
  let fixture: ComponentFixture<NewTaskForm>;
  let taskStoreMock: { addTask: ReturnType<typeof vi.fn>; isNewTaskRequestInProgress: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    taskStoreMock = {
      addTask: vi.fn(),
      isNewTaskRequestInProgress: vi.fn().mockReturnValue(false)
    };

    await TestBed.configureTestingModule({
      imports: [NewTaskForm],
      providers: [
        { provide: TaskStore, useValue: taskStoreMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTaskForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should initialize with an empty, invalid form', () => {
    expect(component.taskForm.getRawValue()).toEqual({
      title: '',
      description: '',
      steps: []
    });
    expect(component.taskForm.valid).toBe(false);
  });

  it('should add and remove steps from the form array', () => {
    const step: Step = { title: 'First step', completed: false };

    component.addStep(step);

    expect(component.steps.length).toBe(1);
    expect(component.steps.at(0)?.getRawValue()).toEqual(step);

    component.removeStep(0);

    expect(component.steps.length).toBe(0);
  });

  it('should submit a valid task and reset the form', () => {
    const task = {
      title: 'New Task',
      description: 'Task description',
      steps: []
    } satisfies Pick<Task, 'title' | 'description' | 'steps'>;

    component.taskForm.controls.title.setValue(task.title);
    component.taskForm.controls.description.setValue(task.description);
    component.taskForm.updateValueAndValidity();

    component.onSubmit();

    expect(taskStoreMock.addTask).toHaveBeenCalledWith({
      title: task.title,
      description: task.description,
      steps: []
    });
    expect(component.steps.length).toBe(0);
    expect(component.taskForm.getRawValue()).toEqual({
      title: '',
      description: '',
      steps: []
    });
  });

  it('should not submit when the form is invalid', () => {
    component.taskForm.controls.title.setValue('');
    component.taskForm.controls.description.setValue('');
    component.taskForm.updateValueAndValidity();

    component.onSubmit();

    expect(taskStoreMock.addTask).not.toHaveBeenCalled();
  });

  it('should not submit when a request is already in progress', () => {
    taskStoreMock.isNewTaskRequestInProgress.mockReturnValue(true);
    component.taskForm.controls.title.setValue('Title');
    component.taskForm.controls.description.setValue('Description');
    component.taskForm.updateValueAndValidity();

    component.onSubmit();

    expect(taskStoreMock.addTask).not.toHaveBeenCalled();
  });
});
