import { useLoaderData } from "react-router";
import { List } from "@mui/material";
import { TaskRow } from "@/pages/tasks/task-row";
import type { Task } from "@/model/task.model";

// TODO: tests for Tasks
export function Tasks() {
    const tasks = useLoaderData<Task[]>();

    return (
        <List className="md:w-2/5 w-full gap-3 flex flex-col" sx={{ marginTop: "12px" }}>
            {tasks.map((task) => <TaskRow key={task.uuid} task={task} />)}
        </List>
    );
}
