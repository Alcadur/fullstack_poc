import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CustomSnackBarData } from '@/components/custom-snack-bar/custom-snack-bar.model';

@Component({
  selector: 'custom-snack-bar',
  templateUrl: './custom-snack-bar.html',
  styleUrls: ['./custom-snack-bar.css']
})
export class CustomSnackBar {
  readonly data = inject(MAT_SNACK_BAR_DATA) as CustomSnackBarData;
}
