import type { Task } from "@/model/task.model";
import { ButtonBase, Collapse, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { type MouseEvent, Suspense, useDeferredValue, useState } from "react";
import { taskHttpService } from "@/service/task-http.service";
import useDebounce from "@/hooks/use-debounce";

type TaskRowProps = {
    task: Task,
}

export function TaskRow({ task }: TaskRowProps) {
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [localTask, setLocalTask] = useState<Task>(structuredClone(task));
    const [optimisticUpdate, setOptimisticUpdate] = useState<Task>(task);
    const currentCompleted = useDeferredValue(optimisticUpdate.completed);
    const debounce = useDebounce();

    const handleUpdate = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        const newTask = { ...localTask, completed: !optimisticUpdate.completed };
        setOptimisticUpdate(newTask);

        debounce(() => {
            taskHttpService.updateTask(newTask).then(setLocalTask);
        }, 500);
    };

    const isStale = localTask.completed !== currentCompleted;

    return (<ListItem className="rounded-md flex flex-col border border-gray-500" sx={{ padding: 0 }}>
        <ListItemButton
            onClick={() => setIsOpened((state) => !state)}
            sx={{
                flexGrow: 1,
                width: "100%",
            }}
        >
            <ListItemText primary={task.title} />

            <Suspense fallback="loading...">
                <ButtonBase onClick={handleUpdate} sx={{
                    opacity: isStale ? 0.5 : 1
                }}>{optimisticUpdate.completed ? "✅" : "❌"}</ButtonBase>
            </Suspense>
            {isOpened ? "∨" : "∧"}
        </ListItemButton>
        <Collapse in={isOpened}
                  unmountOnExit
                  sx={{
                      pl: 4,
                      flexGrow: 1,
                      width: "100%",
                  }}>
            <ListItemText primary={localTask.description} />
        </Collapse>
    </ListItem>);
}
