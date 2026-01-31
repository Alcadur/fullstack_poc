import { Button, Checkbox, TextField } from "@mui/material";
import { type KeyboardEvent, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import * as yup from "yup";
import type { Step } from "@/model/task.model";

const StepSchema = yup.object({
    title: yup.string().required("Step title is required"),
    completed: yup.boolean()
});

export function TaskAddStepField({ value, onChange }: ControllerRenderProps) {
    const [step, setStep] = useState<Step>({
        title: "",
        completed: false
    });

    const updateStep = ({ title, completed }: Partial<Step>) => {
        setStep((currentStep) => ({
            ...currentStep,
            title: title ?? currentStep.title,
            completed: completed ?? currentStep.completed
        }));
    }

    const handleAddStep = () => {
        onChange([...value, step]);
        setStep({ title: "", completed: false });
    }

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAddStep();
        }
    }

    return (
        <div className="flex">
            <Checkbox
                checked={step.completed}
                onChange={(e) => updateStep({ completed: e.target.checked })}
            />
            <TextField
                label="Step title"
                value={step.title}
                onKeyUp={handleKeyUp}
                onChange={(e) => updateStep({ title: e.target.value })}
            />
            <Button
                type="button"
                variant="contained"
                onClick={handleAddStep}
                disabled={!StepSchema.isValidSync(step)}
            >
                Add Step
            </Button>
        </div>
    )
}
