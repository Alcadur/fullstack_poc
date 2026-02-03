import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TaskStepField } from './task-step-field';

describe('TaskStepField', () => {
  let component: TaskStepField;
  let fixture: ComponentFixture<TaskStepField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskStepField]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskStepField);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should initialize with an empty form', () => {
    expect(component.stepForm.getRawValue()).toEqual({
      completed: false,
      title: ''
    });
    expect(component.stepForm.valid).toBe(false);
  });

  it('should have a disabled "Add Step" button when title is empty', () => {
    const addButton = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    expect(addButton.disabled).toBe(true);
  });

  it('should enable "Add Step" button when title is provided', () => {
    component.stepForm.controls.title.setValue('New Step');
    fixture.detectChanges();

    const addButton = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    expect(addButton.disabled).toBe(false);
  });

  it('should emit onStepAdd and reset form when addStep is called', () => {
    const emitSpy = vi.spyOn(component.onStepAdd, 'emit');
    const stepData = { completed: true, title: 'Test Step' };
    component.stepForm.setValue(stepData);

    const event = { preventDefault: vi.fn() } as unknown as Event;
    component.addStep(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(stepData);
    expect(component.stepForm.getRawValue()).toEqual({
      completed: false,
      title: ''
    });
  });

  it('should call addStep when "Add Step" button is clicked', () => {
    const addStepSpy = vi.spyOn(component, 'addStep');
    component.stepForm.controls.title.setValue('New Step');
    fixture.detectChanges();

    const addButton = fixture.debugElement.query(By.css('button'));
    addButton.triggerEventHandler('click', new Event('click'));

    expect(addStepSpy).toHaveBeenCalled();
  });

  it('should call addStep when Enter is pressed in the title input', () => {
    const addStepSpy = vi.spyOn(component, 'addStep');
    const input = fixture.debugElement.query(By.css('[data-testid="step-title-input"]'));
    input.triggerEventHandler('keydown.enter', new Event('keydown', {
      key: 'Enter',
      code: 'Enter'
    } as KeyboardEventInit));

    expect(addStepSpy).toHaveBeenCalled();
  });
});
