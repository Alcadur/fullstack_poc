import { type ApiEndpoints } from "@/api-endpoints";

const BASE_URL = "http://localhost:8080/api";

export class HttpError extends Error {
    readonly code: number;

    constructor(statusCode: number, message?: string, options?: ErrorOptions) {
        super(message, options);

        this.code = statusCode;
    }
}

class HttpService {
    async get<T>(url: ApiEndpoints, init?: RequestInit) {
        return this.sendRequest<T>(url, "GET", undefined, init);
    }

    async post<T>(url: ApiEndpoints, body: any, init?: RequestInit) {
        return this.sendRequest<T>(url, "POST", body, init);
    }


    async put<T>(url: ApiEndpoints, body: any, init?: RequestInit) {
        return this.sendRequest<T>(url, "PUT", body, init);
    }

    async patch<T>(url: ApiEndpoints, body: any, init?: RequestInit) {
        return this.sendRequest<T>(url, "PATCH", body, init);
    }

    private sendRequest<T>(url: ApiEndpoints, method: string, body?: any, init?: RequestInit) {
        return fetch(`${BASE_URL}${url}`, {
            credentials: 'include',
            ...init,
            method,
            body,
        }).then((response) => {
            if (!response.ok) {
                throw new HttpError(response.status, response.statusText);
            }

            return response;
        }) as Promise<Response & T>;
    }
}

export const httpService = new HttpService();
