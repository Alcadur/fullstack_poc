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
    async get(url: ApiEndpoints, init?: RequestInit) {
        return this.sendRequest(url, "GET", undefined, init);
    }

    async post(url: ApiEndpoints, body: any, init?: RequestInit) {
        return this.sendRequest(url, "POST", body, init);
    }


    async put(url: ApiEndpoints, body: any, init?: RequestInit) {
        return this.sendRequest(url, "PUT", body, init);
    }

    async patch(url: ApiEndpoints, body: any, init?: RequestInit) {
        return this.sendRequest(url, "PATCH", body, init);
    }

    private sendRequest(url: ApiEndpoints, method: string, body?: any, init?: RequestInit) {
        return fetch(`${BASE_URL}${url}`, {
            ...init,
            method,
            body
        }).then((response) => {
            if (!response.ok) {
                throw new HttpError(response.status, response.statusText);
            }

            return response;
        });
    }
}

export const httpService = new HttpService();
