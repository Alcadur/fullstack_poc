import { Component, inject } from '@angular/core';
import { IconUsername } from '@/components/icon-username/icon-username';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { UserStore } from '@/stores/user-store/user-store';
import { UserHttpService } from '@/utils/userHttp.service';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'top-bar',
  imports: [
    IconUsername,
    MatButton,
    MatToolbar
  ],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar {
  readonly userStore = inject(UserStore);
  readonly user = this.userStore.user()!;
  readonly userHttpService = inject(UserHttpService);
  readonly router = inject(Router);

  logout() {
    this.userHttpService.logout().pipe(
      catchError(() => of(null)),
      finalize(() => {
      this.userStore.setUser(null);
      this.router.navigate(['/login']);
    })).subscribe();
  }
}
