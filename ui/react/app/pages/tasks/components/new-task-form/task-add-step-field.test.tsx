import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { TaskAddStepField } from "./task-add-step-field";
import type { ControllerRenderProps } from "react-hook-form";
import userEvent from "@testing-library/user-event/dist/cjs/index.js";

describe("TaskAddStepField", () => {
    const mockOnChange = jest.fn();
    const defaultProps = {
        value: [],
        onChange: mockOnChange,
        onBlur: jest.fn(),
        name: "steps",
        ref: jest.fn(),
    } as unknown as ControllerRenderProps;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render all elements correctly", () => {
        render(<TaskAddStepField {...defaultProps} />);

        expect(screen.getByLabelText("Step title")).toBeInTheDocument();
        expect(screen.getByRole("checkbox")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /add step/i })).toBeInTheDocument();
    });

    it("should disable add button when title is empty", () => {
        render(<TaskAddStepField {...defaultProps} />);

        const addButton = screen.getByRole("button", { name: /add step/i });
        expect(addButton).toBeDisabled();
    });

    it("should enable add button when title is provided", async () => {
        const userAction = userEvent.setup();
        render(<TaskAddStepField {...defaultProps} />);

        const input = screen.getByLabelText("Step title");
        await userAction.type(input, "New Step");

        const addButton = screen.getByRole("button", { name: /add step/i });
        expect(addButton).not.toBeDisabled();
    });

    it("should update title on input change", async () => {
        const userAction = userEvent.setup();
        render(<TaskAddStepField {...defaultProps} />);

        const input = screen.getByLabelText("Step title") as HTMLInputElement;
        await userAction.type(input, "Updated Title");

        expect(input.value).toBe("Updated Title");
    });

    it("should update completed status on checkbox change", async () => {
        const userAction = userEvent.setup();
        render(<TaskAddStepField {...defaultProps} />);

        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        await userAction.click(checkbox);

        expect(checkbox.checked).toBe(true);
    });

    it("should call onChange with new step and reset local state when add button is clicked", async () => {
        const userAction = userEvent.setup();
        render(<TaskAddStepField {...defaultProps} />);

        const input = screen.getByLabelText("Step title");
        const checkbox = screen.getByRole("checkbox");
        const addButton = screen.getByRole("button", { name: /add step/i });

        await userAction.type(input, "New Step");
        await userAction.click(checkbox);
        await userAction.click(addButton);

        expect(mockOnChange).toHaveBeenCalledWith([{ title: "New Step", completed: true }]);
        expect((input as HTMLInputElement).value).toBe("");
        expect((checkbox as HTMLInputElement).checked).toBe(false);
    });

    it("should append new step to existing values", async () => {
        const userAction = userEvent.setup();
        const existingSteps = [{ title: "Existing Step", completed: true }];
        render(<TaskAddStepField {...defaultProps} value={existingSteps} />);

        const input = screen.getByLabelText("Step title");
        const addButton = screen.getByRole("button", { name: /add step/i });

        await userAction.type(input, "New Step");
        await userAction.click(addButton);

        expect(mockOnChange).toHaveBeenCalledWith([
            ...existingSteps,
            { title: "New Step", completed: false }
        ]);
    });

    describe("keyboard shortcuts", () => {
        it("should call handleAddStep when Enter key is pressed in text field", async () => {
            const userAction = userEvent.setup();
            render(<TaskAddStepField {...defaultProps} />);

            const input = screen.getByLabelText("Step title");
            await userAction.type(input, "Enter Step");
            await userAction.keyboard("{Enter}");

            expect(mockOnChange).toHaveBeenCalledWith([{ title: "Enter Step", completed: false }]);
        });

        it("should not call handleAddStep when other keys are pressed", async () => {
            const userAction = userEvent.setup();
            render(<TaskAddStepField {...defaultProps} />);

            const input = screen.getByLabelText("Step title");
            await userAction.type(input, "Some Step");
            await userAction.keyboard("{Escape}");

            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });
});
