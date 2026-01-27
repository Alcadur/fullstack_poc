import { jest } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TaskRow } from "./task-row";
import { taskHttpService } from "@/service/task-http.service";
import type { Task } from "@/model/task.model";
import { mockDebounce } from "@/utils/tests-utils";

if (typeof structuredClone === "undefined") {
    global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}

jest.mock("@/service/task-http.service", () => ({
    taskHttpService: {
        updateTask: jest.fn(),
    },
}));

const mockUpdateTask = taskHttpService.updateTask as jest.MockedFunction<typeof taskHttpService.updateTask>;

mockDebounce("@/hooks/use-debounce");

const mockTask: Task = Object.freeze({
    uuid: "1-2-3",
    authorUuid: "user-1",
    title: "Test Task",
    description: "Test Description",
    completed: false,
});

describe("TaskRow", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUpdateTask.mockReturnValue(new Promise(() => {}));
    });

    it("should render task title", () => {
        render(<TaskRow task={mockTask} />);
        expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    it("should not show description by default", () => {
        render(<TaskRow task={mockTask} />);
        expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
    });

    it("should show description when clicked", async () => {
        render(<TaskRow task={mockTask} />);

        const button = screen.getByRole("button", { name: /Test Task/i });
        fireEvent.click(button);

        expect(await screen.findByText("Test Description")).toBeInTheDocument();
    });

    it("should not show description when toggled completed", async () => {
        render(<TaskRow task={mockTask} />);

        const toggleButton = screen.getByText("❌");
        fireEvent.click(toggleButton);

        expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
    });

    it("should toggle completion status optimistically", async () => {
        render(<TaskRow task={mockTask} />);

        const toggleButton = screen.getByText("❌");
        fireEvent.click(toggleButton);

        expect(screen.getByText("✅")).toBeInTheDocument();
        expect(screen.getByText("✅")).toHaveStyle("opacity: 0.5");
    });

    it("should call taskHttpService.updateTask when completion is toggled", async () => {
        const updatedTask = { ...mockTask, completed: true };
        mockUpdateTask.mockResolvedValue(updatedTask);

        render(<TaskRow task={mockTask} />);

        const toggleButton = screen.getByText("❌");
        fireEvent.click(toggleButton);

        expect(mockUpdateTask).toHaveBeenCalledWith(expect.objectContaining({
            uuid: mockTask.uuid,
            completed: true
        }));

        await waitFor(() => {
            expect(screen.getByText("✅")).toHaveStyle("opacity: 1");
        });
    });

    it("should toggle expansion icon when clicked", () => {
        render(<TaskRow task={mockTask} />);

        expect(screen.getByText("∧")).toBeInTheDocument();

        const button = screen.getByRole("button", { name: /Test Task/i });
        fireEvent.click(button);

        expect(screen.getByText("∨")).toBeInTheDocument();
    });
});
