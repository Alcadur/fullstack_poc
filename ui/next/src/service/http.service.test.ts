import { jest } from "@jest/globals";
import { httpService } from "./http.service";

describe("HttpService", () => {
    const BASE_URL = "http://localhost:8080/api";
    const mockEndpoint = "/demo-users";

    beforeEach(() => {
        global.fetch = jest.fn() as jest.Mock<typeof fetch>;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("get", () => {
        it("should make a GET request with correct URL", async () => {
            const mockResponse = { ok: true };
            (global.fetch as unknown as jest.Mock<typeof fetch>).mockResolvedValue(mockResponse as Response);

            const result = await httpService.get(mockEndpoint);

            expect(global.fetch).toHaveBeenCalledWith(
                `${BASE_URL}${mockEndpoint}`,
                expect.objectContaining({
                    method: "GET",
                    body: undefined,
                    credentials: 'include',
                })
            );
            expect(result).toBe(mockResponse);
        });

        it("should pass custom RequestInit options", async () => {
            const mockResponse = { ok: true };
            (global.fetch as unknown as jest.Mock<typeof fetch>).mockResolvedValue(mockResponse as Response);
            const customInit: RequestInit = {
                headers: { "Authorization": "Bearer token" },
                cache: "no-cache",
                credentials: 'omit',
            };

            await httpService.get(mockEndpoint, customInit);

            expect(global.fetch).toHaveBeenCalledWith(
                `${BASE_URL}${mockEndpoint}`,
                expect.objectContaining({
                    method: "GET",
                    body: undefined,
                    headers: { "Authorization": "Bearer token" },
                    cache: "no-cache",
                    credentials: 'omit',
                })
            );
        });
    });

    describe("post", () => {
        it("should make a POST request with body", async () => {
            const mockResponse = { ok: true };
            const requestBody = { name: "John", email: "john@example.com" };
            (global.fetch as unknown as jest.Mock<typeof fetch>).mockResolvedValue(mockResponse as Response);

            const result = await httpService.post(mockEndpoint, requestBody);

            expect(global.fetch).toHaveBeenCalledWith(
                `${BASE_URL}${mockEndpoint}`,
                expect.objectContaining({
                    method: "POST",
                    body: requestBody
                })
            );
            expect(result).toBe(mockResponse);
        });

        it("should pass custom RequestInit options with POST", async () => {
            const mockResponse = { ok: true };
            const requestBody = { name: "John" };
            (global.fetch as unknown as jest.Mock<typeof fetch>).mockResolvedValue(mockResponse as Response);
            const customInit: RequestInit = {
                headers: { "Content-Type": "application/json" }
            };

            await httpService.post(mockEndpoint, requestBody, customInit);

            expect(global.fetch).toHaveBeenCalledWith(
                `${BASE_URL}${mockEndpoint}`,
                expect.objectContaining({
                    method: "POST",
                    body: requestBody,
                    headers: { "Content-Type": "application/json" }
                })
            );
        });
    });

    describe("put", () => {
        it("should make a PUT request with body", async () => {
            const mockResponse = { ok: true };
            const requestBody = { id: 1, name: "Updated Name" };
            (global.fetch as unknown as jest.Mock<typeof fetch>).mockResolvedValue(mockResponse as Response);

            const result = await httpService.put(mockEndpoint, requestBody);

            expect(global.fetch).toHaveBeenCalledWith(
                `${BASE_URL}${mockEndpoint}`,
                expect.objectContaining({
                    method: "PUT",
                    body: requestBody
                })
            );
            expect(result).toBe(mockResponse);
        });

        it("should pass custom RequestInit options with PUT", async () => {
            const mockResponse = { ok: true };
            const requestBody = { id: 1 };
            (global.fetch as unknown as jest.Mock<typeof fetch>).mockResolvedValue(mockResponse as Response);
            const customInit: RequestInit = {
                headers: { "If-Match": "etag123" }
            };

            await httpService.put(mockEndpoint, requestBody, customInit);

            expect(global.fetch).toHaveBeenCalledWith(
                `${BASE_URL}${mockEndpoint}`,
                expect.objectContaining({
                    method: "PUT",
                    body: requestBody,
                    headers: { "If-Match": "etag123" }
                })
            );
        });
    });

    describe("patch", () => {
        it("should make a PATCH request with body", async () => {
            const mockResponse = { ok: true };
            const requestBody = { name: "Patched Name" };
            (global.fetch as unknown as jest.Mock<typeof fetch>).mockResolvedValue(mockResponse as Response);

            const result = await httpService.patch(mockEndpoint, requestBody);

            expect(global.fetch).toHaveBeenCalledWith(
                `${BASE_URL}${mockEndpoint}`,
                expect.objectContaining({
                    method: "PATCH",
                    body: requestBody
                })
            );
            expect(result).toBe(mockResponse);
        });

        it("should pass custom RequestInit options with PATCH", async () => {
            const mockResponse = { ok: true };
            const requestBody = { status: "active" };
            (global.fetch as unknown as jest.Mock<typeof fetch>).mockResolvedValue(mockResponse as Response);
            const customInit: RequestInit = {
                headers: { "X-Custom-Header": "value" }
            };

            await httpService.patch(mockEndpoint, requestBody, customInit);

            expect(global.fetch).toHaveBeenCalledWith(
                `${BASE_URL}${mockEndpoint}`,
                expect.objectContaining({
                    method: "PATCH",
                    body: requestBody,
                    headers: { "X-Custom-Header": "value" }
                })
            );
        });
    });

    describe("error", () => {
        it("should throw error when response is valid but 'ok' is false", async () => {
            const RESPONSE_ERROR_MESSAGE = "Error message";
            const mockResponse = { ok: false, statusText: RESPONSE_ERROR_MESSAGE };
            (global.fetch as unknown as jest.Mock<typeof fetch>).mockResolvedValue(mockResponse as Response);

            await expect(() => httpService.get(mockEndpoint)).rejects.toThrow(RESPONSE_ERROR_MESSAGE) ;
        });
    })
});
