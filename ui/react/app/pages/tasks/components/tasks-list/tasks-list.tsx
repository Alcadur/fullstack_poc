import { List } from "@mui/material";
import { useAppSelector } from "@/store/store-hooks";
import { tasksSelector } from "@/store/tasks-slice";
import { TasksListRow } from "@/pages/tasks/components/tasks-list/tasks-list-row";
import styles from "./tasks-list.module.css";
import { cn } from "@/utils/cn";

export function TasksList() {
    const tasks = useAppSelector(tasksSelector);

    return (
            <List className={cn(
                styles.list,
                "md:w-2/5 w-full gap-3 flex flex-col"
            )}
                  sx={{ marginTop: "12px" }}
            >
                {tasks.map((task) => <TasksListRow key={task.uuid} task={task} />)}
            </List>
    );
}
