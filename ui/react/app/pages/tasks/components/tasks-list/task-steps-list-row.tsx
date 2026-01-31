import { Checkbox, ListItem } from "@mui/material";
import type { ChangeEvent } from "react";
import { cn } from "@/utils/cn";
import type { Step } from "@/model/task.model";

type StepsListRowProps = {
    step: Step,
    onChange: (step: Step) => void,
    isUpdating?: boolean
}

export function TaskStepsListRow({ step, onChange, isUpdating }: StepsListRowProps) {

    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
        onChange({ ...step, completed: e.target.checked });

    return (
        <ListItem className={cn({ "opacity-25": isUpdating})}>
            <Checkbox
                className={cn({ "animate-spin": isUpdating })}
                checked={step.completed}
                onChange={handleChange}
                data-testid="step-checkbox"
            />
            <span>{step.title}</span>
        </ListItem>
    )
}
