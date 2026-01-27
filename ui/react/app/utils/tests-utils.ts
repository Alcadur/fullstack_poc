import { jest } from "@jest/globals";

export function mockDebounce(importPath: string) {
    jest.mock(importPath, () => ({
        __esModule: true,
        default: () => (callback: () => void, _delay: number) => {
            callback();
        },
    }));
}
