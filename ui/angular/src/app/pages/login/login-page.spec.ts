import { TestBed } from '@angular/core/testing';
import { LoginPage } from './login-page';
import { UserHttpService } from '@/utils/userHttp.service';
import { UserStore } from '@/stores/user-store/user-store';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TestScheduler } from 'rxjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';

describe('LoginPage', () => {
  let component: LoginPage;
  let userHttpServiceMock: any;
  let userStoreMock: any;
  let routerMock: any;
  let scheduler: TestScheduler;

  beforeEach(async () => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    userHttpServiceMock = {
      login: vi.fn()
    };
    userStoreMock = {
      loadDemoUsers: vi.fn(),
      setUser: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginPage, ReactiveFormsModule],
      providers: [
        { provide: UserHttpService, useValue: userHttpServiceMock },
        { provide: UserStore, useValue: userStoreMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
  });

  it('should load demo users on init', () => {
    component.ngOnInit();
    expect(userStoreMock.loadDemoUsers).toHaveBeenCalled();
  });

  it('should call login and set user on success (marble diagram)', () => {
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
    });
  });

  it('should set user to null on login error (marble diagram)', () => {
    scheduler.run(({ cold, flush }) => {
      const errorResponse = new HttpErrorResponse({ status: 401 });

      const response$ = cold('--#', {}, errorResponse);
      userHttpServiceMock.login.mockReturnValue(response$);

      component.loginForm.setValue({ username: 'wrong', password: 'wrong' });
      component.handleSubmit();

      flush();

      expect(userStoreMock.setUser).toHaveBeenCalledWith(null);
    });
  });

  it('should not call login if form is invalid', () => {
    component.loginForm.setValue({ username: '', password: '' });
    component.handleSubmit();

    expect(userHttpServiceMock.login).not.toHaveBeenCalled();
  });
});
