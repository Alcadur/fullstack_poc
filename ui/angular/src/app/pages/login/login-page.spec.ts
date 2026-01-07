import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DEMO_USERS_PASSWORD, LoginPage } from './login-page';
import { UserHttpService } from '@/utils/userHttp.service';
import { UserStore } from '@/stores/user-store/user-store';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TestScheduler } from 'rxjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from '@/utils/snackBarService';
import { RoutesList } from '@/routes.model';

describe('LoginPage', () => {
  let component: LoginPage;
  let userHttpServiceMock: any;
  let userStoreMock: any;
  let routerMock: any;
  let scheduler: TestScheduler;
  let snackBarServiceMock: any;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    userHttpServiceMock = {
      login: vi.fn()
    };
    userStoreMock = {
      loadDemoUsers: vi.fn(),
      setUser: vi.fn(),
      getDemoUserByUsername: vi.fn(),
      areDemoUsersLoading: vi.fn(),
      demoUsers: vi.fn().mockReturnValue([])
    };
    snackBarServiceMock = {
      error: vi.fn(),
    };
    routerMock = {
      navigate: vi.fn()
    }

    await TestBed.configureTestingModule({
      imports: [LoginPage, ReactiveFormsModule],
      providers: [
        { provide: UserHttpService, useValue: userHttpServiceMock },
        { provide: UserStore, useValue: userStoreMock },
        { provide: Router, useValue: routerMock },
        { provide: SnackBarService, useValue: snackBarServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
  });

  it('should load demo users on init', () => {
    component.ngOnInit();
    expect(userStoreMock.loadDemoUsers).toHaveBeenCalled();
  });

  it('should call login, set user on success and redirect to tasks', () => {
    scheduler.run(({ cold, expectObservable, flush }) => {
      const mockUser = { id: 1, name: 'Test User' };

      const response$ = cold('--a|', { a: mockUser });
      userHttpServiceMock.login.mockReturnValue(response$);

      component.loginForm.setValue({ username: 'test', password: 'password' });
      component.handleSubmit();

      expectObservable(response$).toBe('--a|', { a: mockUser });
      flush();

      expect(userHttpServiceMock.login).toHaveBeenCalledWith('test', 'password');
      expect(userStoreMock.setUser).toHaveBeenCalledWith(mockUser);
      expect(routerMock.navigate).toHaveBeenCalledWith([RoutesList.TASKS]);
    });
  });

  it('should set user to null on login error and display message', () => {
    scheduler.run(({ cold, flush }) => {
      const errorResponse = new HttpErrorResponse({ status: 401 });

      const response$ = cold('--#', {}, errorResponse);
      userHttpServiceMock.login.mockReturnValue(response$);

      component.loginForm.setValue({ username: 'wrong', password: 'wrong' });
      component.handleSubmit();

      flush();

      expect(userStoreMock.setUser).toHaveBeenCalledWith(null);
      expect(snackBarServiceMock.error).toHaveBeenCalledWith(expect.any(String), 5000);
    });
  });

  it('should not call login if form is invalid', () => {
    component.loginForm.setValue({ username: '', password: '' });
    component.handleSubmit();

    expect(userHttpServiceMock.login).not.toHaveBeenCalled();
  });

  it('should set password to DEMO_USERS_PASSWORD if username is a demo user', () => {
    fixture.detectChanges();

    userStoreMock.getDemoUserByUsername.mockReturnValue({ username: 'test' });
    component.loginForm.controls.username.setValue('test');

    expect(component.loginForm.value.password).toBe(DEMO_USERS_PASSWORD);
  });
});
