import { useState } from "react";
import type { AlertProps } from "@mui/material";
import {
    CustomSnackbarSeverity,
    type CustomSnackbarSeverityType
} from "@/components/custom-snackbar/custom-snackbar.model";

type CustomSnackbarControlProps = {
    onOpen?: () => void;
    onClose?: () => void;
}

export type CustomSnackbarControl = {
    open: () => void;
    success: () => void;
    error: () => void;
    close: () => void;
    readonly isOpened: boolean;
    readonly type: CustomSnackbarSeverityType;
};

export function useCustomSnackbarControl({ onOpen, onClose }: CustomSnackbarControlProps = {}): CustomSnackbarControl {
    const [isOpened, setIsOpened] = useState(false);
    const [type, setType] = useState<CustomSnackbarSeverityType>(CustomSnackbarSeverity.INFO);

    const close = () => {
        onClose?.();
        setIsOpened(false);
    }

    const open = () => {
        onOpen?.();
        setIsOpened(true);
    }

    return {
        open: () => {
            setType(CustomSnackbarSeverity.INFO);
            open();
        },
        close,
        success: () => {
            setType(CustomSnackbarSeverity.SUCCESS);
            open();
        },
        error: () => {
            setType(CustomSnackbarSeverity.ERROR);
            open();
        },
        isOpened,
        type
    };
}
