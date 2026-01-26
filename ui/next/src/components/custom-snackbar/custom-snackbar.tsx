import { Alert, Snackbar } from "@mui/material";
import type { CustomSnackbarControl } from "@/components/custom-snackbar/use-custom-snackbar-control";
import { Activity, type CSSProperties, type ReactNode, useEffect } from "react";
import styles from "./custom-snackbar.module.css";

type CustomSnackbarProps = {
    control: CustomSnackbarControl;
    children: ReactNode;
    durationInMs?: number;
}

export function CustomSnackbar({ children, control, durationInMs = 2000 }: CustomSnackbarProps) {
    return <Snackbar
        open={control.isOpened}
        autoHideDuration={durationInMs}
        onClose={control.close}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
        <Alert severity={control.type}>
            {children}
            <Activity mode={control.isOpened ? "visible" : "hidden"}>
                <div className={styles.timeBar} style={{ "--duration": `${durationInMs}ms` } as CSSProperties}></div>
            </Activity>;
        </Alert>
    </Snackbar>;
}
