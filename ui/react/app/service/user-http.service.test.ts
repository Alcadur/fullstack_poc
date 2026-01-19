import { jest } from "@jest/globals";
import { userHttpService } from "./user-http.service";
import { httpService } from "./http.service";
import { queryClient } from "@/utils/query-client";
import { apiEndpoints } from "@/api-endpoints";
import type { ILoginForm } from "@/login/login.model";

// Mock dependencies
jest.mock("./http.service", () => ({
    httpService: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

jest.mock("@/utils/query-client", () => ({
    queryClient: {
        fetchQuery: jest.fn(),
    },
}));

describe("UserService", () => {
    let mockFetchQuery: jest.Mock<typeof queryClient.fetchQuery>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockFetchQuery = queryClient.fetchQuery as jest.Mock<typeof queryClient.fetchQuery>;

    });

    describe("getDemoUsers", () => {
        let mockGet: jest.Mock<typeof httpService.get>;

        beforeEach(() => {
            mockGet = httpService.get as jest.Mock<typeof httpService.get>;
        });

        it("should fetch demo users using queryClient with correct parameters", async () => {
            const mockUsers = [
                { uuid: "1", username: "John" },
                { uuid: "2", username: "Jane" },
            ] as User[];
            const mockResponse = { ok: true, json: () => Promise.resolve(mockUsers) };

            mockGet.mockResolvedValue(mockResponse as Response);
            mockFetchQuery.mockResolvedValue(mockUsers);

            const result = await userHttpService.getDemoUsers();

            expect(queryClient.fetchQuery).toHaveBeenCalledWith({
                queryKey: ["demo-users"],
                queryFn: expect.any(Function),
            });
            expect(result).toEqual(mockUsers);
        });

        it("should call httpService.get with correct endpoint when queryFn is executed", async () => {
            const mockResponse = { ok: true };
            mockGet.mockResolvedValue(mockResponse as Response);

            let capturedQueryFn: (() => Promise<any>) | undefined;
            mockFetchQuery.mockImplementation(({ queryFn }) => {
                capturedQueryFn = queryFn as () => Promise<any>;
                return capturedQueryFn();
            });

            await userHttpService.getDemoUsers();

            expect(capturedQueryFn).toBeDefined();
            expect(httpService.get).toHaveBeenCalledWith(apiEndpoints.DEMO_USERS);
        });

        it("should handle error", async () => {
            const mockError = new Error("Failed to fetch users");
            mockFetchQuery.mockRejectedValue(mockError);

            await expect(userHttpService.getDemoUsers()).rejects.toThrow("Failed to fetch users");
        });
    });

    describe("login", () => {
        let mockPost: jest.Mock<typeof httpService.post>;
        let loginForm: ILoginForm;

        beforeEach(() => {
            mockPost = httpService.post as jest.Mock<typeof httpService.post>;
            loginForm = {
                username: "testuser",
                password: "testpass123",
            };
        })

        it("should make POST request with correct form data", async () => {
            const mockResponse = {
                ok: true,
                json: () => Promise.resolve({ token: "session-token-123" })
            };

            mockPost.mockResolvedValue(mockResponse as Response);

            const result = await userHttpService.login(loginForm);

            expect(httpService.post).toHaveBeenCalledWith(
                apiEndpoints.LOGIN,
                JSON.stringify(loginForm),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            expect(result).toBe(mockResponse);
        });

        it("should handle login failure", async () => {
            const mockError = new Error("Unauthorized");

            mockPost.mockRejectedValue(mockError);

            await expect(userHttpService.login(loginForm)).rejects.toThrow("Unauthorized");
        });
    });
});
