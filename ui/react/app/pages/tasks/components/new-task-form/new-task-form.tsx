import { Controller, useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { taskHttpService } from "@/service/task-http.service";
import { useAppDispatch } from "@/store/store-hooks";
import { addTask } from "@/store/tasks-slice";
import { TaskAddStepField } from "@/pages/tasks/components/new-task-form/task-add-step-field";
import { TaskStepsList } from "@/pages/tasks/components/new-task-form/task-steps-list";
import type { Step } from "@/model/task.model";

const TaskSchema = yup.object().shape({
    title: yup.string().required("Task title is required"),
    description: yup.string().when("steps", {
        is: (steps: Step[]) => steps?.length === 0,
        then: (schema: yup.StringSchema) => schema.required("Task description is required"),
        otherwise: (schema: yup.StringSchema) => schema.notRequired()
    }),
    steps: yup.array().of(yup.object({
        title: yup.string().required("Step title is required"),
        completed: yup.boolean()
    })).when("description", {
        is: (description: string) => description?.trim() === "",
        then: (schema) => schema.required("Task must have at least one step"),
        otherwise: (schema) => schema.notRequired()
    })
}, [["description", "steps"]]);

type NewTaskFormProps = {
    onSubmitStart?: () => void,
    onSubmitEnd?: () => void,
};

export function NewTaskForm({ onSubmitEnd, onSubmitStart }: NewTaskFormProps) {
    const dispatch = useAppDispatch();
    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            steps: []
        },
        resolver: yupResolver(TaskSchema)
    });

    const handleCreateForm = async (formValue: any) => {
        onSubmitStart?.();
        const task = await taskHttpService.addTask(formValue)
            .then( t => new Promise<any>((resolve) => setTimeout(() => resolve(t), 250)));
        dispatch(addTask(task));
        form.reset();
        onSubmitEnd?.();
    };

    return (
        <form
            className="flex flex-col gap-3 max-h-[90vh]"
            onSubmit={form.handleSubmit(handleCreateForm)}
        >
            <h2 className="text-xl font-bold text-center">New Task</h2>
            <Controller
                render={({ field }) =>
                    <TextField {...field} label="Title" required data-testid="task-title"/>
                }
                name="title"
                control={form.control}
            />
            <Controller
                render={({ field }) =>
                    <TextField
                        {...field}
                        label="Description"
                        multiline
                        rows={4}
                        data-testid="task-description"
                    />
                }
                name="description"
                control={form.control}
            />
            <div className="flex flex-col gap-3">
                <Controller
                    render={({ field }) =>
                        <TaskAddStepField {...field} />
                    }
                    name="steps"
                    control={form.control}
                />
            </div>

            <div className="flex justify-center gap-3">
                <Button variant="contained" color="success" type="submit" disabled={!form.formState.isValid}>Create
                    Task</Button>
                <Button variant="outlined" color="error" onClick={() => form.reset()}>♻️</Button>
            </div>

            <Controller
                render={({ field }) =>
                    <TaskStepsList {...field} />
                }
                name="steps"
                control={form.control}
            />
        </form>
    );
}
