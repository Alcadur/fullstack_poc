import { Autocomplete, TextField } from "@mui/material";
import type { ControllerRenderProps } from "react-hook-form";

type UsernameFieldProps = ControllerRenderProps & {
    options: string[];
}

export function UsernameField({ options, ...field }: UsernameFieldProps) {
    return (
        <Autocomplete
            {...field}
            data-testid="username-field"
            className="w-56"
            freeSolo
            options={options}
            onChange={(_, value: string) => field.onChange(value)}
            onInputChange={(_, value: string) => field.onChange(value)}
            renderInput={(params) => <TextField
                {...params}
                label="Username"
                required
            />
            }
        />
    )
}
