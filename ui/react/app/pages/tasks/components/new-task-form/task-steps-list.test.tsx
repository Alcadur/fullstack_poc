import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { TaskStepsList } from "./task-steps-list";
import type { ControllerRenderProps } from "react-hook-form";
import userEvent from "@testing-library/user-event/dist/cjs/index.js";

describe("TaskStepsList", () => {
    const mockOnChange = jest.fn();
    const defaultSteps = [
        { title: "Step 1", completed: false },
        { title: "Step 2", completed: true },
    ];
    const defaultProps = {
        value: defaultSteps,
        onChange: mockOnChange,
        onBlur: jest.fn(),
        name: "steps",
        ref: jest.fn(),
    } as unknown as ControllerRenderProps;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render all steps correctly", () => {
        render(<TaskStepsList {...defaultProps} />);

        expect(screen.getByText("Step 1")).toBeInTheDocument();
        expect(screen.getByText("Step 2")).toBeInTheDocument();

        const checkboxes = screen.getAllByRole("checkbox");
        expect(checkboxes).toHaveLength(2);
        expect(checkboxes[0]).not.toBeChecked();
        expect(checkboxes[1]).toBeChecked();
    });

    it("should call onChange with updated step when checkbox is clicked", async () => {
        const userAction = userEvent.setup();
        render(<TaskStepsList {...defaultProps} />);

        const checkboxes = screen.getAllByRole("checkbox");
        await userAction.click(checkboxes[0]);

        expect(mockOnChange).toHaveBeenCalledWith([
            { title: "Step 1", completed: true },
            { title: "Step 2", completed: true },
        ]);
    });

    it("should call onChange with step removed when delete button is clicked", async () => {
        render(<TaskStepsList {...defaultProps} />);

        const deleteButtons = screen.getAllByRole("button");
        await userEvent.click(deleteButtons[1]);

        expect(mockOnChange).toHaveBeenCalledWith([
            { title: "Step 1", completed: false },
        ]);
    });

    it("should render nothing when value is empty", () => {
        render(<TaskStepsList {...defaultProps} value={[]} />);

        expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });
});
