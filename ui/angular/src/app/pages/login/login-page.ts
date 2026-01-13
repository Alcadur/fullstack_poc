import { Component, inject, OnInit } from '@angular/core';
import { DemoUser } from './components/demo-user-select/demo-user-select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserHttpService } from '@/utils/userHttp.service';
import { catchError, of } from 'rxjs';
import { UserStore } from '@/stores/user-store/user-store';
import { Router } from '@angular/router';
import { SnackBarService } from '@/utils/snackBarService';
import { RoutesList } from '@/routes.model';

export const DEMO_USERS_PASSWORD = '$trongPassword.123!';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css'],
  imports: [
    DemoUser,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class LoginPage implements OnInit {
  readonly userHttpService = inject(UserHttpService);
  readonly userStore = inject(UserStore);
  readonly snackBarService = inject(SnackBarService);
  readonly router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.userStore.loadDemoUsers();
    this.loginForm.controls.username.valueChanges.subscribe((username) => this.autoSetPasswordForDemoUser(username));
  }

  handleSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    this.userHttpService.login(this.loginForm.value.username!, this.loginForm.value.password!)
      .pipe(
        catchError(() => {
          this.snackBarService.error('Login failed. Please check your credentials and try again.', 5000);
          return of(null);
        }),
      )
      .subscribe(user => {
        this.userStore.setUser(user);

        if (user) {
          this.router.navigate([RoutesList.TASKS]);
        }
      });
  }

  private autoSetPasswordForDemoUser(username: string | null) {
    if (username === null) {
      return;
    }

    if (this.userStore.getDemoUserByUsername(username)) {
      this.loginForm.patchValue({ password: DEMO_USERS_PASSWORD });
    }
  }
}
