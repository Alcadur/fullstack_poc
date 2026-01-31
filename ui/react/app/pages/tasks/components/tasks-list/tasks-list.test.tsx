import { screen } from "@testing-library/react";
import { useLoaderData } from "react-router";
import type { Task } from "@/model/task.model";
import { TasksList } from "@/pages/tasks/components/tasks-list/tasks-list";
import { renderWithStore } from "@/utils/render-with-store";

jest.mock("react-router", () => ({
    useLoaderData: jest.fn(),
}));

jest.mock("@/pages/tasks/components/tasks-list/tasks-list-row", () => ({
    TasksListRow: ({ task }: { task: Task }) => <div data-testid={`task-${task.uuid}`}>{task.title}</div>,
}));

const mockUseLoaderData = useLoaderData as jest.MockedFunction<typeof useLoaderData>;

const mockTasks: Task[] = [
    {
        uuid: "1",
        authorUuid: "user-1",
        title: "Task 1",
        description: "Description 1",
        completed: false,
        steps: []
    },
    {
        uuid: "2",
        authorUuid: "user-1",
        title: "Task 2",
        description: "Description 2",
        completed: true,
        steps: []
    },
    {
        uuid: "3",
        authorUuid: "user-2",
        title: "Task 3",
        description: "Description 3",
        completed: false,
        steps: []
    },
];

const storeSetup = (tasks?: Task[]) => ({ preloadedState: { tasksData: { tasks: tasks ?? mockTasks } } });

describe("Tasks", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseLoaderData.mockReturnValue(mockTasks);
    });

    it("should render all tasks from loader data", () => {
        renderWithStore(<TasksList />, storeSetup());

        expect(screen.getByTestId("task-1")).toBeInTheDocument();
        expect(screen.getByTestId("task-2")).toBeInTheDocument();
        expect(screen.getByTestId("task-3")).toBeInTheDocument();
    });

    it("should render task titles", () => {
        renderWithStore(<TasksList />, storeSetup());

        expect(screen.getByText("Task 1")).toBeInTheDocument();
        expect(screen.getByText("Task 2")).toBeInTheDocument();
        expect(screen.getByText("Task 3")).toBeInTheDocument();
    });

    it("should render empty list when no tasks", () => {
        mockUseLoaderData.mockReturnValue([]);

        const { container } = renderWithStore(<TasksList />, storeSetup([]));

        expect(container.querySelector("[class*=\"MuiList\"]")).toBeInTheDocument();
        expect(container.querySelectorAll("[data-testid^=\"task-\"]")).toHaveLength(0);
    });

    it("should render tasks in correct order", () => {
        const { container } = renderWithStore(<TasksList />, storeSetup());

        const taskElements = container.querySelectorAll("[data-testid^=\"task-\"]");
        expect(taskElements).toHaveLength(3);
        expect(taskElements[0]).toHaveAttribute("data-testid", "task-1");
        expect(taskElements[1]).toHaveAttribute("data-testid", "task-2");
        expect(taskElements[2]).toHaveAttribute("data-testid", "task-3");
    });

    it("should use task uuid as key", () => {
        renderWithStore(<TasksList />, storeSetup());

        mockTasks.forEach(task => {
            expect(screen.getByTestId(`task-${task.uuid}`)).toBeInTheDocument();
        });
    });
});
