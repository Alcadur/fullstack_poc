import { Controller, type SubmitHandler, useForm, useWatch } from "react-hook-form";
import type { ILoginForm } from "./login.model";
import { Button, TextField } from "@mui/material";
import { useLoaderData } from "react-router";
import { UsernameField } from "./components/username-field";

import useDebounce from "@/hooks/use-debounce";
import { userHttpService } from "@/service/user-http.service";
import { useState } from "react";
import { CustomSnackbar } from "@/components/custom-snackbar/custom-snackbar";
import { useCustomSnackbarControl } from "@/components/custom-snackbar/use-custom-snackbar-control";
import { useAppDispatch } from "@/store/store-hooks";
import { setUser } from "@/store/user-slice";

export const DEMO_USERS_PASSWORD = "$trongPassword.123!";

export function Login() {
    const demoUsers = useLoaderData<User[]>();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const snackbarControl = useCustomSnackbarControl();
    const debounce = useDebounce();
    const demoUsersUsernames = demoUsers.map((user) => user.username);
    const storeDispatch = useAppDispatch();

    const form = useForm({
        defaultValues: {
            username: "",
            password: ""
        }
    });

    useWatch({
        control: form.control,
        name: "username",
        compute: (username) => {
            debounce(() => {
                if (!form.getValues("password") && demoUsersUsernames.includes(username)) {
                    form.setValue("password", DEMO_USERS_PASSWORD);
                }
            }, 250);
        }
    });

    const handleLogin: SubmitHandler<ILoginForm> = async (data) => {
        setIsLoggingIn(true);
        try {
            const user: User = await userHttpService.login(data);
            storeDispatch(setUser(user));
        } catch (e) {
            snackbarControl.error();
        }

        setIsLoggingIn(false);
    };

    return (
        <div className="flex items-center justify-center min-w-screen min-h-screen">
            <form onSubmit={form.handleSubmit(handleLogin)} className="flex flex-col gap-3">
                <Controller
                    render={({ field }) =>
                        <UsernameField options={demoUsersUsernames} {...field} />
                    }
                    name="username"
                    control={form.control}
                    disabled={isLoggingIn}
                />
                <Controller
                    render={({ field }) =>
                        <TextField {...field} label="Password" type="password" required />
                    }
                    name="password"
                    control={form.control}
                    disabled={isLoggingIn}
                />

                <Button variant="contained" type="submit">Login</Button>
            </form>
            <CustomSnackbar control={snackbarControl}>
                Login failed. Please check your credentials and try again.
            </CustomSnackbar>
        </div>
    );
}
