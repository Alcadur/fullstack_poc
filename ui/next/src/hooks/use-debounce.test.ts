import { renderHook } from "@testing-library/react";
import useDebounce from "./use-debounce";

describe("useDebounce", () => {
    let callback: jest.Mock;
    let debounceAction: ReturnType<typeof useDebounce>;

    beforeEach(() => {
        callback = jest.fn();
        const { result } = renderHook(() => useDebounce());
        debounceAction = result.current;

        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should call the callback after the specified delay", () => {
        debounceAction(callback, 500);

        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(500);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should cancel the previous call if called again within the delay", () => {
        debounceAction(callback, 500);

        jest.advanceTimersByTime(250);
        debounceAction(callback, 500);

        jest.advanceTimersByTime(300);
        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(200);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should use the most recent callback provided", () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        debounceAction(callback1, 500);
        jest.advanceTimersByTime(100);
        debounceAction(callback2, 500);

        jest.advanceTimersByTime(500);
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalledTimes(1);
    });
});
