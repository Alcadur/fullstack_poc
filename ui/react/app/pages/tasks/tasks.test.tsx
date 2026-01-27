import { render, screen } from "@testing-library/react";
import { useLoaderData } from "react-router";
import { Tasks } from "./tasks";
import type { Task } from "@/model/task.model";

jest.mock("react-router", () => ({
    useLoaderData: jest.fn(),
}));

jest.mock("@/pages/tasks/task-row", () => ({
    TaskRow: ({ task }: { task: Task }) => <div data-testid={`task-${task.uuid}`}>{task.title}</div>,
}));

const mockUseLoaderData = useLoaderData as jest.MockedFunction<typeof useLoaderData>;

const mockTasks: Task[] = [
    {
        uuid: "1",
        authorUuid: "user-1",
        title: "Task 1",
        description: "Description 1",
        completed: false,
    },
    {
        uuid: "2",
        authorUuid: "user-1",
        title: "Task 2",
        description: "Description 2",
        completed: true,
    },
    {
        uuid: "3",
        authorUuid: "user-2",
        title: "Task 3",
        description: "Description 3",
        completed: false,
    },
];

describe("Tasks", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseLoaderData.mockReturnValue(mockTasks);
    });

    it("should render all tasks from loader data", () => {
        render(<Tasks />);

        expect(screen.getByTestId("task-1")).toBeInTheDocument();
        expect(screen.getByTestId("task-2")).toBeInTheDocument();
        expect(screen.getByTestId("task-3")).toBeInTheDocument();
    });

    it("should render task titles", () => {
        render(<Tasks />);

        expect(screen.getByText("Task 1")).toBeInTheDocument();
        expect(screen.getByText("Task 2")).toBeInTheDocument();
        expect(screen.getByText("Task 3")).toBeInTheDocument();
    });

    it("should render empty list when no tasks", () => {
        mockUseLoaderData.mockReturnValue([]);

        const { container } = render(<Tasks />);

        expect(container.querySelector('[class*="MuiList"]')).toBeInTheDocument();
        expect(container.querySelectorAll('[data-testid^="task-"]')).toHaveLength(0);
    });

    it("should render tasks in correct order", () => {
        const { container } = render(<Tasks />);

        const taskElements = container.querySelectorAll('[data-testid^="task-"]');
        expect(taskElements).toHaveLength(3);
        expect(taskElements[0]).toHaveAttribute("data-testid", "task-1");
        expect(taskElements[1]).toHaveAttribute("data-testid", "task-2");
        expect(taskElements[2]).toHaveAttribute("data-testid", "task-3");
    });

    it("should use task uuid as key", () => {
        render(<Tasks />);

        mockTasks.forEach(task => {
            expect(screen.getByTestId(`task-${task.uuid}`)).toBeInTheDocument();
        });
    });
});
