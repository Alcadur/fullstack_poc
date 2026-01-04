import { Component, inject } from '@angular/core';
import { DemoUser } from './components/demo-user-select/demo-user-select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserHttpService } from '../../utils/userHttp.service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

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
export class LoginPage {
  userHttpService = inject(UserHttpService);

  loginForm = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });

  handleSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    this.userHttpService.login(this.loginForm.value.username!, this.loginForm.value.password!)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return of(null);
        })
      )
      .subscribe(user => console.log(user))
  }
}
