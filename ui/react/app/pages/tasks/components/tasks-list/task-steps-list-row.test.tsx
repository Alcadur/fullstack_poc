import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { TaskStepsListRow } from "./task-steps-list-row";
import userEvent from "@testing-library/user-event/dist/cjs/index.js";

describe("TaskStepsListRow", () => {
    const mockStep = {
        id: "1",
        title: "Test Step",
        completed: false
    };
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders step title and checkbox correctly", () => {
        render(<TaskStepsListRow step={mockStep} onChange={mockOnChange} />);

        expect(screen.getByText("Test Step")).toBeInTheDocument();
        expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("renders checked checkbox when step is completed", () => {
        const completedStep = { ...mockStep, completed: true };
        render(<TaskStepsListRow step={completedStep} onChange={mockOnChange} />);

        expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("calls onChange when checkbox is clicked", async () => {
        const userAction = userEvent.setup();
        render(<TaskStepsListRow step={mockStep} onChange={mockOnChange} />);

        const checkbox = screen.getByRole("checkbox");
        await userAction.click(checkbox);

        expect(mockOnChange).toHaveBeenCalledWith({
            ...mockStep,
            completed: true
        });
    });

    it("applies updating styles when isUpdating is true", () => {
        const { container } = render(
            <TaskStepsListRow step={mockStep} onChange={mockOnChange} isUpdating={true} />
        );

        const listItem = container.querySelector("li");
        const checkbox = screen.getByTestId("step-checkbox");

        expect(listItem).toHaveClass("opacity-25");
        expect(checkbox).toHaveClass("animate-spin");
    });

    it("does not apply updating styles when isUpdating is false", () => {
        const { container } = render(
            <TaskStepsListRow step={mockStep} onChange={mockOnChange} isUpdating={false} />
        );

        const listItem = container.querySelector("li");
        const checkbox = screen.getByRole("checkbox");

        expect(listItem).not.toHaveClass("opacity-25");
        expect(checkbox).not.toHaveClass("animate-spin");
    });
});
