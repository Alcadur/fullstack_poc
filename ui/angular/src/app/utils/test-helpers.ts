import { TestScheduler } from 'rxjs/testing';
import { ExpectStatic } from 'vitest';

export const schedulerFactory = (expect: ExpectStatic) => new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
