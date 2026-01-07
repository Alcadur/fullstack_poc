import { Component, input } from '@angular/core';

@Component({
  selector: 'user-icon',
  templateUrl: './user-icon.html',
  styleUrls: ['./user-icon.css'],
  standalone: true,
})
export class UserIcon {
  username = input.required<string>();

  getUserColor(username: string) {
    const userNameNumberString = username.split('')
      .map(char => char.charCodeAt(0))
      .join('') + "255255255";

    return "#" + Number(userNameNumberString).toString(16).slice(0, 6);
  }
}
