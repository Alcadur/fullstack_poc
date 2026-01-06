import { TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CustomSnackBar } from './custom-snack-bar';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CustomSnackBar', () => {
  const mockData = {
    message: 'Test ka-me-ha-me-ha',
    duration: 3000,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        CustomSnackBar,
        { provide: MAT_SNACK_BAR_DATA, useValue: mockData },
      ],
    }).compileComponents();
  });

  it('should render the message from data', () => {
    const fixture = TestBed.createComponent(CustomSnackBar);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('section')?.textContent).toContain(mockData.message);
  });

  it('should set the data-duration attribute on the timer div', () => {
    const fixture = TestBed.createComponent(CustomSnackBar);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const timerElement = compiled.querySelector('.timer');
    expect(timerElement?.getAttribute('data-duration')).toBe('3000');
  });

});
