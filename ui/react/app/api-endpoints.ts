export const apiEndpoints = {
    DEMO_USERS: '/demo-users',
    LOGIN: '/login',
    LOGOUT: '/logout',
    TODO_TASKS: "/tasks/user/:userUuid/todo",
} as const

export function buildApiUrl(endpoint: ApiEndpoints, params: Record<string, string>) {
    return endpoint.replace(/:([a-zA-Z]+)/g, (_, key) => params[key] || '') as ApiEndpoints;
}

export type ApiEndpoints = typeof apiEndpoints[keyof typeof apiEndpoints]
