import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconUsername } from './icon-username';
import { UserIcon } from '@/components/user-icon/user-icon';
import { By } from '@angular/platform-browser';

describe('IconUsername', () => {
  let component: IconUsername;
  let fixture: ComponentFixture<IconUsername>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconUsername, UserIcon],
    }).compileComponents();

    fixture = TestBed.createComponent(IconUsername);
    fixture.componentRef.setInput('username', 'TestUsername');
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should update username on input change', () => {
    // Init state check
    const userIconElement = fixture.debugElement.query(By.directive(UserIcon)).nativeElement as HTMLElement;
    const usernameWrapperElement = fixture.debugElement.query(By.css('[data-test="username-wrapper"]')).nativeElement as HTMLElement;
    expect(component.username()).toBe('TestUsername');
    expect(userIconElement.textContent.trim()).toBe('T');
    expect(usernameWrapperElement.textContent.trim()).toBe('estUsername');

    fixture.componentRef.setInput('username', 'NewUsername');
    fixture.detectChanges();

    expect(component.username()).toBe('NewUsername');
    expect(userIconElement.textContent.trim()).toBe('N');
    expect(usernameWrapperElement.textContent.trim()).toBe('ewUsername');
  });
});
