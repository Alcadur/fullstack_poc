import { renderHook, act } from "@testing-library/react";
import { useCustomSnackbarControl } from "./use-custom-snackbar-control";
import { CustomSnackbarSeverity } from "./custom-snackbar.model";

describe("useCustomSnackbarControl", () => {
    it("should initialize with default values", () => {
        const { result } = renderHook(() => useCustomSnackbarControl());

        expect(result.current.isOpened).toBe(false);
        expect(result.current.type).toBe(CustomSnackbarSeverity.INFO);
    });

    it("should open with INFO type and call onOpen when open() is called", () => {
        const onOpen = jest.fn();
        const { result } = renderHook(() => useCustomSnackbarControl({ onOpen }));

        act(() => {
            result.current.open();
        });

        expect(result.current.isOpened).toBe(true);
        expect(result.current.type).toBe(CustomSnackbarSeverity.INFO);
        expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it("should set type to SUCCESS and open when success() is called", () => {
        const { result } = renderHook(() => useCustomSnackbarControl());

        act(() => {
            result.current.success();
        });

        expect(result.current.isOpened).toBe(true);
        expect(result.current.type).toBe(CustomSnackbarSeverity.SUCCESS);
    });

    it("should set type to ERROR and open when error() is called", () => {
        const { result } = renderHook(() => useCustomSnackbarControl());

        act(() => {
            result.current.error();
        });

        expect(result.current.isOpened).toBe(true);
        expect(result.current.type).toBe(CustomSnackbarSeverity.ERROR);
    });

    it("should close and call onClose when close() is called", () => {
        const onClose = jest.fn();
        const { result } = renderHook(() => useCustomSnackbarControl({ onClose }));

        act(() => {
            result.current.success();
        });

        expect(result.current.isOpened).toBe(true);

        act(() => {
            result.current.close();
        });

        expect(result.current.isOpened).toBe(false);
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
