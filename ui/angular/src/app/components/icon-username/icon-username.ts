import { AfterContentInit, Component, computed, effect, ElementRef, input, OnInit, viewChild } from '@angular/core';
import { UserIcon } from '@/components/user-icon/user-icon';
import { SlicePipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'icon-username',
  templateUrl: './icon-username.html',
  styleUrls: ['./icon-username.css'],
  imports: [
    UserIcon,
    SlicePipe
  ]
})
export class IconUsername {
  username = input.required<string>();
}
