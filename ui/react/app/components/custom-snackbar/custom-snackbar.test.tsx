
import { render, screen, act } from "@testing-library/react";
import { CustomSnackbar } from "./custom-snackbar";
import { CustomSnackbarSeverity } from "./custom-snackbar.model";
import type { CustomSnackbarControl } from "./use-custom-snackbar-control";

describe("CustomSnackbar", () => {
    const mockControl: CustomSnackbarControl = {
        open: jest.fn(),
        success: jest.fn(),
        error: jest.fn(),
        close: jest.fn(),
        isOpened: true,
        type: CustomSnackbarSeverity.INFO,
    };

    it("renders children when opened", () => {
        render(
            <CustomSnackbar control={mockControl}>
                <span>Snackbar Message</span>
            </CustomSnackbar>
        );

        expect(screen.getByText("Snackbar Message")).toBeInTheDocument();
    });

    it("does not show content when closed", () => {
        render(
            <CustomSnackbar control={{ ...mockControl, isOpened: false }}>
                Hidden Message
            </CustomSnackbar>
        );

        expect(screen.queryByText("Hidden Message")).not.toBeInTheDocument();
    });

    it("applies the correct severity class/type to the Alert", () => {
        const { rerender } = render(
            <CustomSnackbar control={{ ...mockControl, type: CustomSnackbarSeverity.ERROR }}>
                Error Message
            </CustomSnackbar>
        );

        const alert = screen.getByRole("alert");
        expect(alert).toHaveClass("MuiAlert-standardError");

        rerender(
            <CustomSnackbar control={{ ...mockControl, type: CustomSnackbarSeverity.SUCCESS }}>
                Success Message
            </CustomSnackbar>
        );
        expect(screen.getByRole("alert")).toHaveClass("MuiAlert-standardSuccess");
    });

    it("calls control.close when the snackbar duration expires", () => {
        jest.useFakeTimers();

        render(
            <CustomSnackbar
                control={{ ...mockControl }}
                durationInMs={1000}
            >
                Timed Message
            </CustomSnackbar>
        );

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(mockControl.close).toHaveBeenCalled();
        jest.useRealTimers();
    });

    it("passes custom duration to the time bar style", () => {
        render(
            <CustomSnackbar control={mockControl} durationInMs={5000}>
                Duration Test
            </CustomSnackbar>
        );

        const timeBar = screen.getByRole("alert").querySelector("div[style*='--duration: 5000ms']");
        expect(timeBar).toBeInTheDocument();
    });
});
