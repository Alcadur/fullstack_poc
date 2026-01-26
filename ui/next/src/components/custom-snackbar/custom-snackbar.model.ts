export const CustomSnackbarSeverity  = {
    INFO: 'info',
    ERROR: 'error',
    SUCCESS: 'success'
} as const;

export type CustomSnackbarSeverityType = typeof CustomSnackbarSeverity[keyof typeof CustomSnackbarSeverity];
