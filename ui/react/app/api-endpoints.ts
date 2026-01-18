export const apiEndpoints = {
    DEMO_USERS: '/demo-users',
    LOGIN: '/login'
} as const

export type ApiEndpoints = typeof apiEndpoints[keyof typeof apiEndpoints]
