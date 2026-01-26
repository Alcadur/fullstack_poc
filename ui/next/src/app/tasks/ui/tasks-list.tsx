'use client'
import { List } from "@mui/material";
import { TaskRow } from "./task-row";
import type { Task } from "@/model/task.model";
import { use } from "react";

type TasksProps = {
    tasksRequest: Promise<Task[]>;
}

export function TasksList({ tasksRequest }: TasksProps) {
    const tasks = use(tasksRequest);

    return (
        <List className="md:w-2/5 w-full gap-3 flex flex-col" sx={{ marginTop: "12px" }}>
            {tasks.map((task) => <TaskRow key={task.uuid} task={task} />)}
        </List>
    );
}
