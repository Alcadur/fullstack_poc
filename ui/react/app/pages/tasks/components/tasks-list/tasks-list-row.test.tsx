import { jest } from "@jest/globals";
import { screen, waitFor } from "@testing-library/react";
import { TasksListRow } from "./tasks-list-row";
import { taskHttpService } from "@/service/task-http.service";
import type { Task } from "@/model/task.model";
import { renderWithStore } from "@/utils/render-with-store";
import userEvent from "@testing-library/user-event/dist/cjs/index.js";

if (typeof structuredClone === "undefined") {
    global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}

jest.mock("@/service/task-http.service", () => ({
    taskHttpService: {
        updateTask: jest.fn(),
    },
}));

const mockUpdateTask = taskHttpService.updateTask as jest.MockedFunction<typeof taskHttpService.updateTask>;

jest.mock("@/hooks/use-debounce", () => ({
    __esModule: true,
    default: () => (callback: () => void, _delay: number) => {
        callback();
    },
}));

const mockTask: Task = Object.freeze({
    uuid: "1-2-3",
    authorUuid: "user-1",
    title: "Test Task",
    description: "Test Description",
    completed: false,
    steps: [
        { title: "Test Step 1", completed: false },
        { title: "Test Step 2", completed: true },
    ]
});

describe("TasksListRow", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUpdateTask.mockReturnValue(new Promise(() => {
        }));
    });

    it("should render task title", () => {
        renderWithStore(<TasksListRow task={mockTask} />);
        expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    it("should not show description by default", () => {
        renderWithStore(<TasksListRow task={mockTask} />);
        expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
    });

    it("should show description when clicked", async () => {
        const userAction = userEvent.setup();
        renderWithStore(<TasksListRow task={mockTask} />);

        const button = screen.getByRole("button", { name: /Test Task/i });
        await userAction.click(button);

        expect(await screen.findByText("Test Description")).toBeInTheDocument();
        expect(await screen.findByText("Test Step 1")).toBeInTheDocument();
        expect(await screen.findByText("Test Step 2")).toBeInTheDocument();
    });

    it("should not show description when toggled completed", async () => {
        const userAction = userEvent.setup();
        renderWithStore(<TasksListRow task={mockTask} />);

        const toggleButton = screen.getByText("❌");
        await userAction.click(toggleButton);

        expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
        expect(screen.queryByText("Test Step 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Test Step 2")).not.toBeInTheDocument();
    });

    it("should toggle completion status optimistically", async () => {
        const userAction = userEvent.setup();
        renderWithStore(<TasksListRow task={mockTask} />);

        const toggleButton = screen.getByText("❌");
        await userAction.click(toggleButton);

        expect(screen.getByText("✅")).toBeInTheDocument();
        expect(screen.getByText("✅")).toHaveStyle("opacity: 0.5");
    });

    it("should call taskHttpService.updateTask when completion is toggled", async () => {
        const userAction = userEvent.setup();
        const updatedTask = { ...mockTask, completed: true };
        mockUpdateTask.mockResolvedValue(updatedTask);

        renderWithStore(<TasksListRow task={mockTask} />);

        const toggleButton = screen.getByText("❌");
        await userAction.click(toggleButton);

        expect(mockUpdateTask).toHaveBeenCalledWith(expect.objectContaining({
            uuid: mockTask.uuid,
            completed: true
        }));

        await waitFor(() => {
            expect(screen.getByText("✅")).toHaveStyle("opacity: 1");
        });
    });

    it("should toggle expansion icon when clicked", async () => {
        const userAction = userEvent.setup();
        renderWithStore(<TasksListRow task={mockTask} />);

        expect(screen.getByText("∧")).toBeInTheDocument();

        const button = screen.getByRole("button", { name: /Test Task/i });
        await userAction.click(button);

        expect(screen.getByText("∨")).toBeInTheDocument();
    });
});
