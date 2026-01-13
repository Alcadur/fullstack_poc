import { TestScheduler } from 'rxjs/testing';
import { ExpectStatic, vi } from 'vitest';

export const schedulerFactory = (expect: ExpectStatic) => new TestScheduler((actual, expected) => expect(actual).toEqual(expected));

export const IntersectionObserverMock = vi.fn(class {
  disconnect = vi.fn()
  observe = vi.fn()
  takeRecords = vi.fn()
  unobserve = vi.fn()
})
