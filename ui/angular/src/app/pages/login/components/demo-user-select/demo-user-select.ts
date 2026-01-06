import { Component, forwardRef, inject, OnInit } from '@angular/core';
import { User } from '../../../../models/user.model';
import { map, Observable, startWith, Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserStore } from '../../../../stores/user-store/user-store';

@Component({
  selector: 'demo-user-select',
  templateUrl: './demo-user-select.html',
  styleUrls: ['./demo-user-select.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DemoUser),
    multi: true
  }]
})
export class DemoUser implements OnInit, ControlValueAccessor {

  username: string = '';
  usernameChange = new Subject<string>();

  userStore = inject(UserStore);
  filteredDemoUsers$: Observable<User[]> | undefined;

  propagateChange = (_: any) => {
  };

  ngOnInit(): void {
    this.filteredDemoUsers$ = this.usernameChange.pipe(
      startWith(this.username),
      map((searchTerm) => this.filterUsers(this.userStore.demoUsers(), searchTerm ?? '')),
    );
  }

  writeValue(value: string | Event): void {
    this.username = typeof value === 'string' ? value : (value.target as HTMLInputElement).value;
    this.username = this.username.trim()
    this.usernameChange.next(this.username);
    this.propagateChange(this.username);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }


  private filterUsers(users: User[], searchTerm: string): User[] {
    const normalizedSearch = searchTerm.toLowerCase();
    return users.filter(user =>
      user.username.toLowerCase().includes(normalizedSearch)
    );
  }
}
