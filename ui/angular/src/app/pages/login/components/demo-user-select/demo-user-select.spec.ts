import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DemoUser } from './demo-user-select';
import { UserStore } from '@/stores/user-store/user-store';
import { User } from '@/models/user.model';
import { signal } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { firstValueFrom } from 'rxjs';
import { MatOptionHarness } from '@angular/material/core/testing';

const getOptionsText = async (options:  Promise<MatOptionHarness[]>) => await Promise.all((await options).map((option) => option.getText()));

describe('DemoUserSelect Component', () => {
  let component: DemoUser;
  let fixture: ComponentFixture<DemoUser>;
  let loader: HarnessLoader;
  let mockUserStore: { demoUsers: ReturnType<typeof signal<User[]>> };

  const mockDemoUsers: User[] = [
    { uuid: '1', username: 'testuser1' },
    { uuid: '2', username: 'testuser2' },
    { uuid: '3', username: 'admin' },
  ];

  beforeEach(async () => {
    mockUserStore = {
      demoUsers: signal(mockDemoUsers)
    };

    await TestBed.configureTestingModule({
      imports: [
        DemoUser,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [
        { provide: UserStore, useValue: mockUserStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoUser);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should initialize with empty username', () => {
      expect(component.username).toBe('');
    });

    it('should initialize filteredDemoUsers$ observable', async () => {
      expect(component.filteredDemoUsers$).toBeDefined();
      const users = await firstValueFrom(component.filteredDemoUsers$!);
      expect(users).toEqual(mockDemoUsers);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should implement writeValue with string input', () => {
      component.writeValue('testuser1');
      expect(component.username).toBe('testuser1');
    });

    it('should implement writeValue with Event input', () => {
      const mockEvent = {
        target: { value: 'testuser2' } as HTMLInputElement
      } as unknown as Event;

      component.writeValue(mockEvent);
      expect(component.username).toBe('testuser2');
    });

    it('should call propagateChange when writeValue is called', () => {
      const spy = vi.spyOn(component, 'propagateChange');
      component.writeValue('testuser1');
      expect(spy).toHaveBeenCalledWith('testuser1');
    });

    it('should register onChange callback', () => {
      const mockFn = vi.fn();
      component.registerOnChange(mockFn);
      component.writeValue('test');
      expect(mockFn).toHaveBeenCalledWith('test');
    });
  });

  describe('User Filtering', () => {
    it('should update username when input changes', async () => {
      const input = await loader.getHarness(MatInputHarness);
      await input.setValue('testuser1');

      expect(component.username).toBe('testuser1');
    });

    it('should display filtered options in autocomplete', async () => {
      const input = await loader.getHarness(MatInputHarness);
      await input.setValue('test');
      const autocomplete = await loader.getHarness(MatAutocompleteHarness);

      const options = await getOptionsText(autocomplete.getOptions())
      expect(options.length).toBe(2);
      expect(options).toEqual(['testuser1(demo)', 'testuser2(demo)']);
    });

    it('should render all demo users as options when autocomplete opens', async () => {
      const autocomplete = await loader.getHarness(MatAutocompleteHarness);
      await autocomplete.focus();

      const options = await autocomplete.getOptions();
      expect(options.length).toBe(3);
    });

    it('should update value when option is selected', () => {
      const mockOptionValue = 'testuser1';
      const mockEvent = {
        option: { value: mockOptionValue }
      } as MatAutocompleteSelectedEvent;

      const spy = vi.spyOn(component, 'writeValue');
      component.writeValue(mockEvent.option.value);

      expect(spy).toHaveBeenCalledWith('testuser1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty demo users array', async () => {
      mockUserStore.demoUsers = signal([]);
      component.ngOnInit();

      const users = await firstValueFrom(component.filteredDemoUsers$!);
      expect(users.length).toBe(0);
    });

    it('should handle whitespace in search term', async () => {
      const options = await loader.getHarness(MatAutocompleteHarness);
      const input = await loader.getHarness(MatInputHarness);
      await input.setValue('  test  ');

      const users = await getOptionsText(options.getOptions());
      expect(users.length).toBe(2);
    });

    it('should handle multiple rapid writeValue calls', () => {
      component.writeValue('a');
      component.writeValue('ad');
      component.writeValue('adm');
      component.writeValue('admin');

      expect(component.username).toBe('admin');
    });
  });
});
