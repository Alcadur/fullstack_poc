import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarService } from './snackBarService';
import { CustomSnackBar } from '@/components/custom-snack-bar/custom-snack-bar';
import { CustomSnackBarType } from '@/components/custom-snack-bar/custom-snack-bar.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SnackBarService', () => {
  let service: SnackBarService;
  let matSnackBarMock: Partial<MatSnackBar>;

  const DEFAULT_DURATION = 30000;

  beforeEach(() => {
    matSnackBarMock = {
      openFromComponent: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        SnackBarService,
        { provide: MatSnackBar, useValue: matSnackBarMock }
      ]
    });

    service = TestBed.inject(SnackBarService);
  });

  describe('open', () => {
    it('should call openFromComponent with correct configuration', () => {
      const message = 'Test message';
      const type = CustomSnackBarType.SUCCESS;
      const duration = 5000;

      service.open(message, type, duration);

      expect(matSnackBarMock.openFromComponent).toHaveBeenCalledWith(CustomSnackBar, {
        duration,
        data: { message, duration },
        panelClass: ['custom-snack-bar', `custom-snack-bar-${type}`]
      });
    });

    it('should use default duration if none provided', () => {
      service.open('test', CustomSnackBarType.INFO);

      expect(matSnackBarMock.openFromComponent).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          duration: DEFAULT_DURATION,
          data: expect.objectContaining({ duration: DEFAULT_DURATION })
        })
      );
    });
  });

  describe('convenience methods', () => {
    it('should call open with ERROR type when error() is called', () => {
      const spy = vi.spyOn(service, 'open');
      service.error('Error message');
      expect(spy).toHaveBeenCalledWith('Error message', CustomSnackBarType.ERROR, DEFAULT_DURATION);
    });

    it('should call open with SUCCESS type when success() is called', () => {
      const spy = vi.spyOn(service, 'open');
      service.success('Success message', 1000);
      expect(spy).toHaveBeenCalledWith('Success message', CustomSnackBarType.SUCCESS, 1000);
    });

    it('should call open with INFO type when info() is called', () => {
      const spy = vi.spyOn(service, 'open');
      service.info('Info message');
      expect(spy).toHaveBeenCalledWith('Info message', CustomSnackBarType.INFO, DEFAULT_DURATION);
    });
  });
});
