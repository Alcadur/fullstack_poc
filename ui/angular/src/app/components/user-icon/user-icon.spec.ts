import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserIcon } from './user-icon';
import { ComponentRef } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

describe('UserIcon', () => {
  let component: UserIcon;
  let fixture: ComponentFixture<UserIcon>;
  let componentRef: ComponentRef<UserIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserIcon]
    }).compileComponents();

    fixture = TestBed.createComponent(UserIcon);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  describe('getUserColor', () => {
    it('should generate consistent colors for the same username', () => {
      const username = 'JohnDoe';
      const color1 = component.getUserColor(username);
      const color2 = component.getUserColor(username);
      expect(color1).toBe(color2);
    });

    it('should generate different colors for different usernames', () => {
      const color1 = component.getUserColor('Alice');
      const color2 = component.getUserColor('Bob');
      expect(color1).not.toBe(color2);
    });

    it('should handle single character usernames', () => {
      const color = component.getUserColor('A');
      expect(color).toMatch(/^#[0-9a-f]+$/);
      expect(color).toHaveLength(7);
    });

    it('should handle empty string', () => {
      const color = component.getUserColor('');
      expect(color).toBeDefined();
      expect(color).toHaveLength(7);
      expect(color).toEqual('#f36e2d');
    });

    it('should generate color with maximum 6 characters after #', () => {
      const color = component.getUserColor('VeryLongUsername123456789');
      expect(color.length).toBeLessThanOrEqual(7);
    });
  });

  describe('template rendering', () => {
    it('should display the first letter of the username', () => {
      componentRef.setInput('username', 'TestUser');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const userIconDiv = compiled.querySelector('.user-icon');
      expect(userIconDiv?.textContent?.trim()).toBe('T');
    });

    it('should display the first letter for single character username', () => {
      componentRef.setInput('username', 'X');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const userIconDiv = compiled.querySelector('.user-icon');
      expect(userIconDiv?.textContent?.trim()).toBe('X');
    });

    it('should display lowercase letter as-is', () => {
      componentRef.setInput('username', 'alice');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const userIconDiv = compiled.querySelector('.user-icon');
      expect(userIconDiv?.textContent?.trim()).toBe('a');
    });

    it('should apply the correct color CSS variable', () => {
      const username = 'Alice';
      componentRef.setInput('username', username);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const userIconDiv = compiled.querySelector('.user-icon') as HTMLElement;
      const expectedColor = component.getUserColor(username);
      expect(userIconDiv?.style.getPropertyValue('--color')).toBe(expectedColor);
    });
  });

  describe('username input', () => {
    it('should be required', () => {
      expect(() => {
        componentRef.setInput('username', 'TestUser');
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should accept username input', () => {
      componentRef.setInput('username', 'JohnDoe');
      fixture.detectChanges();
      expect(component.username()).toBe('JohnDoe');
    });
  });
});
