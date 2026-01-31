import type { Step, Task } from "@/model/task.model";
import { ButtonBase, Collapse, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { type MouseEvent, Suspense, useDeferredValue, useState } from "react";
import { taskHttpService } from "@/service/task-http.service";
import useDebounce from "@/hooks/use-debounce";
import { useAppDispatch } from "@/store/store-hooks";
import { updateTask } from "@/store/tasks-slice";
import { TaskStepsListRow } from "@/pages/tasks/components/tasks-list/task-steps-list-row";

type TaskRowProps = {
    task: Task,
}

function isStepUpdating(step: Step, newStep: Step) {
    return step.title !== newStep.title || step.completed !== newStep.completed;
}

export function TasksListRow({ task }: TaskRowProps) {
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [localTask, setLocalTask] = useState<Task>(structuredClone(task));
    const [optimisticUpdate, setOptimisticUpdate] = useState<Task>(task);
    const currentCompleted = useDeferredValue(optimisticUpdate.completed);
    const debounce = useDebounce();
    const dispatch = useAppDispatch();

    const updateTaskAction = (task: Task) => {
        setOptimisticUpdate(task);

        debounce(async () => {
            const newTask = await taskHttpService.updateTask(task);
            setLocalTask(newTask);
            dispatch(updateTask(newTask));
        }, 500);
    };

    const handleUpdate = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        const newTask = { ...localTask, completed: !optimisticUpdate.completed };

        updateTaskAction(newTask);
    };

    const handleStepUpdate = (index: number, step: Step) => {
        const newTask = structuredClone(optimisticUpdate);
        newTask.steps[index] = step;
        newTask.steps = [...newTask.steps];

        updateTaskAction(newTask);
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
            <ListItemText primary={optimisticUpdate.description} />
            <List>
                {optimisticUpdate.steps.map((step, index) =>
                    <TaskStepsListRow
                        key={index}
                        isUpdating={isStepUpdating(step, localTask.steps[index])}
                        step={step}
                        onChange={(step: Step) => handleStepUpdate(index, step)}
                    />
                )}
            </List>
        </Collapse>
    </ListItem>);
}
