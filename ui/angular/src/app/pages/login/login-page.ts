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

@Component({
  selector: 'login-page',
  templateUrl: 'login-page.html',
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

  ngOnInit(): void {
    this.userStore.loadDemoUsers();
  }

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

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
      });
  }
}
