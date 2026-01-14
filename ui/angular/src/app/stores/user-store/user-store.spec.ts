import { TestBed } from '@angular/core/testing';
import { UserStore } from './user-store';
import { UserHttpService } from '@/utils/userHttp.service';
import { User } from '@/models/user.model';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';

describe('UserStore', () => {
  let store: InstanceType<typeof UserStore>;
  let userHttpServiceMock: Partial<UserHttpService>;

  const mockUser: User = {
    uuid: 'test-uuid-1',
    username: 'testuser'
  };

  const mockDemoUsers: User[] = [
    { uuid: 'demo-uuid-1', username: 'demo1' },
    { uuid: 'demo-uuid-2', username: 'demo2' },
    { uuid: 'demo-uuid-3', username: 'demo3' }
  ];

  beforeEach(() => {
    userHttpServiceMock = {
      getDemoUsers: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        UserStore,
        { provide: UserHttpService, useValue: userHttpServiceMock }
      ]
    });

    store = TestBed.inject(UserStore);
  });

  describe('Initial State', () => {
    it('should have null user initially', () => {
      expect(store.user()).toBeNull();
    });

    it('should have empty demoUsers array initially', () => {
      expect(store.demoUsers()).toEqual([]);
    });

    it('should have areDemoUsersLoading as false initially', () => {
      expect(store.areDemoUsersLoading()).toBe(false);
    });

    it('should have isLoggedIn as false initially', () => {
      expect(store.isLoggedIn()).toBe(false);
    });
  });

  describe('isLoggedIn computed', () => {
    it('should return false when user is null', () => {
      expect(store.isLoggedIn()).toBe(false);
    });

    it('should return true when user is set', () => {
      store.setUser(mockUser);
      expect(store.isLoggedIn()).toBe(true);
    });

    it('should return false when user is cleared', () => {
      store.setUser(mockUser);
      expect(store.isLoggedIn()).toBe(true);

      store.setUser(null);
      expect(store.isLoggedIn()).toBe(false);
    });
  });

  describe('setUser', () => {
    it('should update user when called multiple times', () => {
      const firstUser = mockUser;
      const secondUser: User = { uuid: 'uuid-2', username: 'user2' };

      store.setUser(firstUser);
      expect(store.user()).toEqual(firstUser);

      store.setUser(secondUser);
      expect(store.user()).toEqual(secondUser);
    });
  });

  describe('getDemoUserByUsername', () => {
    function setup(demoUsers = mockDemoUsers) {
      userHttpServiceMock.getDemoUsers = vi.fn().mockReturnValue(of(demoUsers));
      store.loadDemoUsers();
    }

    it('should return user when username exists', () => {
      setup();

      const result = store.getDemoUserByUsername('demo2');
      expect(result).toEqual(mockDemoUsers[1]);
    });

    it('should return undefined when username does not exist', () => {
      setup();

      const result = store.getDemoUserByUsername('nonexistent');
      expect(result).toBeUndefined();
    });

    it('should return first matching user when multiple users match', () => {
      setup();

      const result = store.getDemoUserByUsername('demo1');
      expect(result).toEqual(mockDemoUsers[0]);
    });

    it('should return undefined when demoUsers is empty', () => {
      setup([]);

      const result = store.getDemoUserByUsername('demo1');
      expect(result).toBeUndefined();
    });
  });

  describe('loadDemoUsers', () => {
    beforeEach(() => {
      userHttpServiceMock.getDemoUsers = vi.fn().mockReturnValue(of(mockDemoUsers));
    });

    it('should load demo users successfully', () => {
      store.loadDemoUsers();

      expect(userHttpServiceMock.getDemoUsers).toHaveBeenCalledTimes(1);
      expect(store.demoUsers()).toEqual(mockDemoUsers);
      expect(store.areDemoUsersLoading()).toBe(false);
    });

    it('should not refetch when demoUsers already exist', () => {
      store.loadDemoUsers();
      expect(userHttpServiceMock.getDemoUsers).toHaveBeenCalledTimes(1);

      store.loadDemoUsers();
      expect(userHttpServiceMock.getDemoUsers).toHaveBeenCalledTimes(1);
      expect(store.demoUsers()).toEqual(mockDemoUsers);
    });

    it('should refetch when forceRefetch is true', () => {
      store.loadDemoUsers();
      expect(userHttpServiceMock.getDemoUsers).toHaveBeenCalledTimes(1);

      store.loadDemoUsers(true);
      expect(userHttpServiceMock.getDemoUsers).toHaveBeenCalledTimes(2);
    });

    it('should handle error and set demoUsers to empty array', () => {
      const errorStore = TestBed.inject(UserStore);
      vi.spyOn(TestBed.inject(UserHttpService), 'getDemoUsers').mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      errorStore.loadDemoUsers();

      expect(errorStore.demoUsers()).toEqual([]);
      expect(errorStore.areDemoUsersLoading()).toBe(false);
    });

    it('should set loading to false after error', () => {
      const errorStore = TestBed.inject(UserStore);
      vi.spyOn(TestBed.inject(UserHttpService), 'getDemoUsers').mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      errorStore.loadDemoUsers();
      expect(errorStore.areDemoUsersLoading()).toBe(false);
    });

    it('should update demoUsers when refetching with new data', () => {
      const newMockUsers: User[] = [
        { uuid: 'new-uuid-1', username: 'newuser1' }
      ];

      store.loadDemoUsers();
      expect(store.demoUsers()).toEqual(mockDemoUsers);

      vi.mocked(userHttpServiceMock.getDemoUsers!).mockReturnValue(of(newMockUsers));
      store.loadDemoUsers(true);

      expect(store.demoUsers()).toEqual(newMockUsers);
    });
  });

  describe('Integration tests', () => {
    beforeEach(() => {
      userHttpServiceMock.getDemoUsers = vi.fn().mockReturnValue(of(mockDemoUsers));
    });

    it('should allow setting user and loading demo users independently', () => {
      store.setUser(mockUser);
      expect(store.user()).toEqual(mockUser);
      expect(store.isLoggedIn()).toBe(true);

      store.loadDemoUsers();
      expect(store.demoUsers()).toEqual(mockDemoUsers);
      expect(store.user()).toEqual(mockUser);
    });

    it('should maintain state consistency across operations', () => {
      // Load demo users
      store.loadDemoUsers();
      expect(store.demoUsers().length).toBe(3);

      // Set user
      store.setUser(mockUser);
      expect(store.isLoggedIn()).toBe(true);

      // Demo users should still be there
      expect(store.demoUsers().length).toBe(3);

      // Get demo user by username
      const demoUser = store.getDemoUserByUsername('demo2');
      expect(demoUser).toEqual(mockDemoUsers[1]);

      // Clear user
      store.setUser(null);
      expect(store.isLoggedIn()).toBe(false);

      // Demo users should still be there
      expect(store.demoUsers().length).toBe(3);
    });
  });
});
