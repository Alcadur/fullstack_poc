import { jest } from "@jest/globals";
import { taskHttpService } from "./task-http.service";
import { httpService } from "./http.service";
import { queryClient } from "@/utils/query-client";

jest.mock("./http.service", () => ({
    httpService: {
        get: jest.fn(),
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

    beforeEach(() => {
        jest.clearAllMocks();
        mockFetchQuery = queryClient.fetchQuery as jest.Mock<typeof queryClient.fetchQuery>;
        mockFetchQuery.mockImplementation(async ({ queryFn }) =>
            (await (queryFn as Function)()).json()
        );
        mockGet = httpService.get as jest.Mock<typeof httpService.get>;
    });

    describe("getToDoTasksByUserUid", () => {
        const testUuid = "test-user-uuid-123";

        it("should fetch TODO tasks using queryClient with correct parameters", async () => {
            const mockTasks = [
                { id: "1", title: "Task 1", completed: false },
                { id: "2", title: "Task 2", completed: true },
            ];
            const mockResponse = { ok: true, json: () => Promise.resolve(mockTasks) };

            mockGet.mockResolvedValue(mockResponse as Response);

            const result = await taskHttpService.getToDoTasksByUserUid(testUuid);

            expect(queryClient.fetchQuery).toHaveBeenCalledWith({
                queryKey: ["todo-tasks-by-user", testUuid],
                queryFn: expect.any(Function),
            });
            expect(result).toEqual(mockTasks);
            expect(mockGet).toHaveBeenCalledWith(`/tasks/user/${testUuid}/todo`);
        });

        it("should use correct query key with user UUID", async () => {
            const anotherUuid = "another-user-uuid-456";
            const mockResponse = { ok: true };
            mockGet.mockResolvedValue(mockResponse as Response);
            mockFetchQuery.mockResolvedValue([]);

            await taskHttpService.getToDoTasksByUserUid(anotherUuid);

            expect(queryClient.fetchQuery).toHaveBeenCalledWith({
                queryKey: ["todo-tasks-by-user", anotherUuid],
                queryFn: expect.any(Function),
            });
        });

        it("should handle error when fetching tasks fails", async () => {
            const mockError = new Error("Failed to fetch tasks");
            mockFetchQuery.mockRejectedValue(mockError);

            await expect(taskHttpService.getToDoTasksByUserUid(testUuid)).rejects.toThrow(
                "Failed to fetch tasks"
            );
        });

        it("should handle error when httpService.get fails", async () => {
            const mockError = new Error("Network error");
            mockGet.mockRejectedValue(mockError);

            mockFetchQuery.mockImplementation(async ({ queryFn }) => {
                return (queryFn as () => Promise<any>)();
            });

            await expect(taskHttpService.getToDoTasksByUserUid(testUuid)).rejects.toThrow("Network error");
        });
    });
});
