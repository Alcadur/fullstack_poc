import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from '@/components/custom-snack-bar/custom-snack-bar';
import { CustomSnackBarType } from '@/components/custom-snack-bar/custom-snack-bar.model';

const DEFAULT_DURATION_IN_MS = 30000;

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private readonly snackBar = inject(MatSnackBar);

  open(message: string, type: CustomSnackBarType,  duration: number = DEFAULT_DURATION_IN_MS) {
    this.snackBar.openFromComponent(CustomSnackBar, {
      duration,
      data: { message, duration },
      panelClass: ['custom-snack-bar', `custom-snack-bar-${type}`]
    });
  }

  error(message: string, duration: number = DEFAULT_DURATION_IN_MS) {
    this.open(message, CustomSnackBarType.ERROR, duration);
  }

  success(message: string, duration: number = DEFAULT_DURATION_IN_MS) {
    this.open(message, CustomSnackBarType.SUCCESS, duration);
  }

  info(message: string, duration: number = DEFAULT_DURATION_IN_MS) {
    this.open(message, CustomSnackBarType.INFO, duration);
  }
}
