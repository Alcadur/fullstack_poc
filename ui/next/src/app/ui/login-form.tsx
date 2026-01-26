"use client";

import { Controller, type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { CustomSnackbar } from "@/components/custom-snackbar/custom-snackbar";
import { use, useState } from "react";
import { useCustomSnackbarControl } from "@/components/custom-snackbar/use-custom-snackbar-control";
import useDebounce from "@/hooks/use-debounce";
import { userHttpService } from "@/service/user-http.service";
import { ILoginForm } from "@/model/login.model";
import { UsernameField } from "@/components/username-field/username-field";
import { setUser } from "@/store/user-slice";
import { useAppDispatch } from "@/store/store-hooks";
import { useRouter } from "next/navigation";

const DEMO_USERS_PASSWORD = "$trongPassword.123!";

type LoginFormProps = {
    demoUsersRequest: Promise<User[]>;
};

export default function LoginForm({ demoUsersRequest }: LoginFormProps) {
    const demoUsers = use(demoUsersRequest);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const snackbarControl = useCustomSnackbarControl();
    const debounce = useDebounce();
    const demoUsersUsernames = demoUsers.map((user) => user.username);
    const storeDispatch = useAppDispatch();
    const router = useRouter();

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
            router.push("/tasks");
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
