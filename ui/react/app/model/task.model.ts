export type Task = {
    readonly uuid: string
    readonly authorUuid: string,
    completed: boolean,
    description: string
    title: string,
}
