import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TopBar } from './top-bar';
import { UserStore } from '@/stores/user-store/user-store';
import { UserHttpService } from '@/utils/userHttp.service';
import { signal } from '@angular/core';
import { User } from '@/models/user.model';
import { schedulerFactory } from '@/utils/test-helpers';

describe('TopBar', () => {
  let component: TopBar;
  let fixture: ComponentFixture<TopBar>;
  let mockUserStore: any;
  let mockUserHttpService: any;
  let mockRouter: any;

  const mockUser: User = {
    uuid: '1',
    username: 'testuser',
  };

  beforeEach(async () => {
    mockUserStore = {
      user: signal(mockUser),
      setUser: vi.fn()
    };

    mockUserHttpService = {
      logout: vi.fn().mockReturnValue(of({}))
    };

    mockRouter = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TopBar],
      providers: [
        { provide: UserStore, useValue: mockUserStore },
        { provide: UserHttpService, useValue: mockUserHttpService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TopBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should have user from userStore', () => {
    expect(component.user).toEqual(mockUser);
    expect(component.user.username).toBe('testuser');
  });

  it('should have userStore injected', () => {
    expect(component.userStore).toBeDefined();
    expect(component.userStore.user()).toEqual(mockUser);
  });

  describe('logout', () => {
    it('should call userHttpService.logout', () => {
      component.logout();

      expect(mockUserHttpService.logout).toHaveBeenCalledOnce();
    });

    it('should set user to null in store and navigate to login page independent to logout result (success)', () => {
      component.logout();

      expect(mockUserStore.setUser).toHaveBeenCalledWith(null);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should set user to null in store and navigate to login page independent to logout result (error)', () => {
      const scheduler = schedulerFactory(expect);
      scheduler.run(({ cold, flush }) => {
        mockUserHttpService.logout.mockReturnValue(cold('-#', {}, new Error('Error')));

        component.logout();
        flush();

        expect(mockUserStore.setUser).toHaveBeenCalledWith(null);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      });
    });
  });
});
