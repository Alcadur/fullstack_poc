import '@jest/globals';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module '@jest/globals' {
  export interface Expect extends TestingLibraryMatchers<any, any> {}
}
