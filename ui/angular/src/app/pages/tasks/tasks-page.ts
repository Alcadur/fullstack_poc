import { Component, inject } from '@angular/core';
import { TaskStore } from '@/stores/task-store/task-store';
import { UserStore } from '@/stores/user-store/user-store';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserIcon } from '@/components/user-icon/user-icon';
import { MatButtonModule } from '@angular/material/button';
import { IconUsername } from '@/components/icon-username/icon-username';
import { UserHttpService } from '@/utils/userHttp.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tasks-page',
  templateUrl: 'tasks-page.html',
  styleUrls: ['./tasks-page.css'],
  imports: [MatToolbarModule, MatButtonModule, UserIcon, IconUsername],
  host: { class: 'tasks-page'},
})
export class TasksPage {
  readonly taskStore = inject(TaskStore);
  readonly userStore = inject(UserStore);
  readonly user = this.userStore.user()!;
  readonly userHttpService = inject(UserHttpService);
  readonly router = inject(Router);

  constructor() {
    this.taskStore.loadTasks(this.user.uuid);
  }

  logout() {
    this.userHttpService.logout().subscribe(() => {
      this.userStore.setUser(null);
      this.router.navigate(['/login']);
    });
  }
}
