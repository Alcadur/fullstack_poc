import { jest } from "@jest/globals";
import { taskHttpService } from "./task-http.service";
import { httpService } from "./http.service";
import { queryClient } from "@/utils/query-client";

jest.mock("./http.service", () => ({
    httpService: {
        get: jest.fn(),
        patch: jest.fn(),
        post: jest.fn(),
    },
}));

jest.mock("@/utils/query-client", () => ({
    queryClient: {
        fetchQuery: jest.fn(),
    },
}));

describe("TaskHttpService", () => {
    let mockFetchQuery: jest.Mock<typeof queryClient.fetchQuery>;
    let mockGet: jest.Mock<typeof httpService.get>;
    let mockPatch: jest.Mock<typeof httpService.patch>;
    let mockPost: jest.Mock<typeof httpService.post>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockFetchQuery = queryClient.fetchQuery as jest.Mock<typeof queryClient.fetchQuery>;
        mockFetchQuery.mockImplementation(async ({ queryFn }) =>
            await (queryFn as Function)()
        );
        mockGet = httpService.get as jest.Mock<typeof httpService.get>;
        mockPatch = httpService.patch as jest.Mock<typeof httpService.patch>;
        mockPost = httpService.post as jest.Mock<typeof httpService.post>;
    });

    describe("getToDoTasks", () => {
        it("should fetch TODO tasks using queryClient with correct parameters", async () => {
            const mockTasks = [
                { id: "1", title: "Task 1", completed: false },
                { id: "2", title: "Task 2", completed: true },
            ];
            const mockResponse = { ok: true, json: () => Promise.resolve(mockTasks) };

            mockGet.mockResolvedValue(mockResponse as Response);

            const result = await taskHttpService.getToDoTasks();

            expect(queryClient.fetchQuery).toHaveBeenCalledWith({
                queryKey: ["todo-tasks"],
                queryFn: expect.any(Function),
            });
            expect(result).toEqual(mockTasks);
            expect(mockGet).toHaveBeenCalledWith(`/tasks/todo`);
        });

        it("should handle error when fetching tasks fails", async () => {
            const mockError = new Error("Failed to fetch tasks");
            mockFetchQuery.mockRejectedValue(mockError);

            await expect(taskHttpService.getToDoTasks()).rejects.toThrow(
                "Failed to fetch tasks"
            );
        });

        it("should handle error when httpService.get fails", async () => {
            const mockError = new Error("Network error");
            mockGet.mockRejectedValue(mockError);

            mockFetchQuery.mockImplementation(async ({ queryFn }) => {
                return (queryFn as () => Promise<any>)();
            });

            await expect(taskHttpService.getToDoTasks()).rejects.toThrow("Network error");
        });
    });

    describe("updateTask", () => {
        it("should update a task and return the response", async () => {
            const mockTask: any = {
                uuid: "1",
                authorUuid: "user-1",
                title: "Updated Task",
                completed: true,
                description: "Description",
                steps: []
            };
            const mockResponse = { ok: true, json: () => Promise.resolve(mockTask) };

            mockPatch.mockResolvedValue(mockResponse as Response);

            const result = await taskHttpService.updateTask(mockTask);

            expect(mockPatch).toHaveBeenCalledWith(
                "/tasks",
                JSON.stringify(mockTask),
                { headers: { "Content-Type": "application/json" } }
            );
            expect(result).toEqual(mockTask);
        });

        it("should handle error when update fails", async () => {
            const mockTask: any = {
                uuid: "1",
                authorUuid: "user-1",
                title: "Updated Task",
                completed: true,
                description: "Description",
                steps: []
            };
            const mockError = new Error("Update failed");
            mockPatch.mockRejectedValue(mockError);

            await expect(taskHttpService.updateTask(mockTask)).rejects.toThrow("Update failed");
        });
    });

    describe("addTask", () => {
        it("should add a new task and return the response", async () => {
            const mockTask: any = {
                uuid: "3",
                authorUuid: "user-1",
                title: "New Task",
                completed: false,
                description: "New Description",
                steps: []
            };
            const mockResponse = { ok: true, json: () => Promise.resolve(mockTask) };

            mockPost.mockResolvedValue(mockResponse as Response);

            const result = await taskHttpService.addTask(mockTask);

            expect(mockPost).toHaveBeenCalledWith(
                "/tasks",
                JSON.stringify(mockTask),
                { headers: { "Content-Type": "application/json" } }
            );
            expect(result).toEqual(mockTask);
        });

        it("should handle error when adding task fails", async () => {
            const mockTask: any = {
                uuid: "3",
                authorUuid: "user-1",
                title: "New Task",
                completed: false,
                description: "New Description",
                steps: []
            };
            const mockError = new Error("Add task failed");
            mockPost.mockRejectedValue(mockError);

            await expect(taskHttpService.addTask(mockTask)).rejects.toThrow("Add task failed");
        });
    });
});
