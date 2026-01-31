import { type RefObject, useRef, useState } from "react";
import styles from "./new-task-dialog.module.css";
import { cn } from "@/utils/cn";
import { NewTaskForm } from "@/pages/tasks/components/new-task-form/new-task-form";

type NewTaskDialogProps = {
    ref?: RefObject<HTMLDialogElement | null>;
}

export function NewTaskDialog({ ref }: NewTaskDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isRequestInProgress, setIsRequestInProgress] = useState(false);

    return (
        <dialog
            ref={(node) => {
                dialogRef.current = node;
                if (ref) {
                    ref.current = node;
                }

            }}
            className="top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-3 py-2 overflow-visible"
        >
            <NewTaskForm
                onSubmitStart={() => setIsRequestInProgress(true)}
                onSubmitEnd={() => setIsRequestInProgress(false)}
            />
            <button
                onClick={() => dialogRef.current?.close()}
                className={cn(
                    "absolute -top-3 -right-3 cursor-pointer",
                    styles.closeButton,
                    {
                        [styles.loading]: isRequestInProgress,
                    }
                )}
            >
                ✖️
            </button>
        </dialog>
    );
}
