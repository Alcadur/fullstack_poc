import { screen, waitFor } from "@testing-library/react";
import { NewTaskForm } from "./new-task-form";
import { renderWithStore } from "@/utils/render-with-store";
import { taskHttpService } from "@/service/task-http.service";
import userEvent from "@testing-library/user-event";

jest.mock("@/service/task-http.service", () => ({
    taskHttpService: {
        addTask: jest.fn(),
    },
}));

describe("NewTaskForm", () => {
    const mockOnSubmitStart = jest.fn();
    const mockOnSubmitEnd = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render all form elements", () => {
        renderWithStore(<NewTaskForm />);

        expect(screen.getByText("New Task")).toBeInTheDocument();
        expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Step title/)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Create Task/ })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "♻️" })).toBeInTheDocument();
    });

    it("should have create button disabled initially", () => {
        renderWithStore(<NewTaskForm />);
        const submitButton = screen.getByRole("button", { name: /Create Task/i });
        expect(submitButton).toBeDisabled();
    });

    it("should enable create button when title and description are provided", async () => {
        const userAction = userEvent.setup();
        renderWithStore(<NewTaskForm />);

        await userAction.type(screen.getByLabelText(/Title/), "Test Task");
        await userAction.type(screen.getByLabelText("Description"), "Test Description");

        const submitButton = screen.getByRole("button", { name: /Create Task/i });
        await waitFor(() => expect(submitButton).not.toBeDisabled());
    });

    it("should enable create button when title and a step are provided", async () => {
        const userAction = userEvent.setup();
        renderWithStore(<NewTaskForm />);

        await userAction.type(screen.getByLabelText(/Title/), "Test Task");

        await userAction.type(screen.getByLabelText(/Step title/), "Step 1");
        await userAction.click(screen.getByRole("button", { name: /add step/i }));

        const submitButton = screen.getByRole("button", { name: /Create Task/i });
        await waitFor(() => expect(submitButton).not.toBeDisabled());
    });

    it("should stay disabled if only title is provided (missing description and steps)", async () => {
        const userAction = userEvent.setup();
        renderWithStore(<NewTaskForm />);

        await userAction.type(screen.getByLabelText(/Title/), "Test Task");

        const submitButton = screen.getByRole("button", { name: /Create Task/ });
        expect(submitButton).toBeDisabled();
    });

    it("should call onSubmitStart, addTask service, and onSubmitEnd on successful submission", async () => {
        const mockTask = { uuid: "123", title: "Test Task", description: "Test Description", steps: [] };
        (taskHttpService.addTask as jest.Mock).mockResolvedValue(mockTask);
        const userAction = userEvent.setup();

        const { store } = renderWithStore(
            <NewTaskForm onSubmitStart={mockOnSubmitStart} onSubmitEnd={mockOnSubmitEnd} />
        );

        await userAction.type(screen.getByLabelText(/Title/), "Test Task");
        await userAction.type(screen.getByLabelText(/Description/), "Test Description");

        const submitButton = screen.getByRole("button", { name: /Create Task/ });
        await waitFor(() => expect(submitButton).not.toBeDisabled());

        await userAction.click(submitButton);

        expect(mockOnSubmitStart).toHaveBeenCalled();

        await waitFor(() => {
            expect(taskHttpService.addTask).toHaveBeenCalledWith({
                title: "Test Task",
                description: "Test Description",
                steps: [],
            });
        });

        await waitFor(() => {
            expect(mockOnSubmitEnd).toHaveBeenCalled();
        }, { timeout: 3000 });

        const state = store.getState();
        expect(state.tasksData.tasks).toContainEqual(mockTask);

        expect((screen.getByLabelText(/Title/) as HTMLInputElement).value).toBe("");
        expect((screen.getByLabelText(/Description/) as HTMLInputElement).value).toBe("");
    });

    it("should reset form when reset button is clicked", async () => {
        const userAction = userEvent.setup();
        renderWithStore(<NewTaskForm />);

        const titleInput = screen.getByLabelText(/Title/) as HTMLInputElement;
        const descInput = screen.getByLabelText(/Description/) as HTMLInputElement;
        const resetButton = screen.getByRole("button", { name: "♻️" });

        await userAction.type(titleInput, "Some Title");
        await userAction.type(descInput, "Some Description");

        expect(titleInput.value).toBe("Some Title");
        expect(descInput.value).toBe("Some Description");

        await userAction.click(resetButton);

        expect(titleInput.value).toBe("");
        expect(descInput.value).toBe("");
    });
});
