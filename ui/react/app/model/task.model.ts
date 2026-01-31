export type Step = {
    title: string;
    completed: boolean;
}


export type Task = {
    readonly uuid: string
    readonly authorUuid: string,
    completed: boolean,
    description: string
    steps: Step[],
    title: string,
}
