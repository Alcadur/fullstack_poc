import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TaskStepListRow } from './task-step-list-row';
import { Step } from '@/models/task.model';

describe('TaskStepListRow', () => {
  let component: TaskStepListRow;
  let fixture: ComponentFixture<TaskStepListRow>;
  let stepControl: FormControl<Step>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskStepListRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskStepListRow);
    component = fixture.componentInstance;

    stepControl = new FormControl<Step>({ title: 'Step A', completed: false }, { nonNullable: true });
    fixture.componentRef.setInput('stepControl', stepControl);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render the step title and completion status', () => {
    const checkbox = fixture.debugElement.query(By.css('mat-checkbox input')).nativeElement as HTMLInputElement;
    const content = fixture.debugElement.query(By.css('.step-list-item-content')).nativeElement as HTMLElement;

    expect(checkbox.checked).toBe(false);
    expect(content.textContent).toContain('Step A');
  });

  it('should toggle completed state when onStatusChange is called', () => {
    component.onStatusChange();

    expect(stepControl.getRawValue().completed).toBe(true);
  });

  it('should call onStatusChange when checkbox change event fires', () => {
    const statusSpy = vi.spyOn(component, 'onStatusChange');
    const checkbox = fixture.debugElement.query(By.css('mat-checkbox'));

    checkbox.triggerEventHandler('change', {});

    expect(statusSpy).toHaveBeenCalled();
  });

  it('should emit onRemove when remove button is clicked', () => {
    const emitSpy = vi.spyOn(component.onRemove, 'emit');
    const button = fixture.debugElement.query(By.css('button'));

    button.triggerEventHandler('click', new Event('click'));

    expect(emitSpy).toHaveBeenCalled();
  });
});
