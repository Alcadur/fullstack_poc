import { List } from "@mui/material";
import { useAppSelector } from "@/store/store-hooks";
import { tasksSelector } from "@/store/tasks-slice";
import { TasksListRow } from "@/pages/tasks/components/tasks-list/tasks-list-row";

export function TasksList() {
    const tasks = useAppSelector(tasksSelector);

    return (
        <List className="md:w-2/5 w-full gap-3 flex flex-col" sx={{ marginTop: "12px" }}>
            {tasks.map((task) => <TasksListRow key={task.uuid} task={task} />)}
        </List>
    );
}
