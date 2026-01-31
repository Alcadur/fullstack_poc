import { Button, Checkbox, List, ListItem, ListItemText } from "@mui/material";
import type { ControllerRenderProps } from "react-hook-form";
import type { Step } from "@/model/task.model";

export function TaskStepsList({ value, onChange }: ControllerRenderProps) {

    const handleChange = (index: number, completed: boolean) => {
        const stepToUpdate = { ...value[index] };
        stepToUpdate.completed = completed;
        onChange(value.map((step: Step, i: number) => i === index ? stepToUpdate : step));
    };

    const handleDeleteStep = (index: number) => {
        onChange(value.filter((_: Step, i: number) => i !== index));
    };

    return (
        <List sx={{ padding: 0, overflow: "auto" }} dense>
            {value.map((step: Step, index: number) => (
                <ListItem key={index} sx={{ paddingTop: 0, paddingBottom: 0 }}>
                    <Checkbox checked={step.completed} onChange={(e) => handleChange(index, e.target.checked)} />
                    <ListItemText primary={step.title} />
                    <Button onClick={() => handleDeleteStep(index)}>🗑️</Button>
                </ListItem>
            ))}
        </List>
    );
}
