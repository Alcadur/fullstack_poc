import { userHttpService } from "@/service/user-http.service";
import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";

export default function Login() {
    const demoUsers = userHttpService.getDemoUsers();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm demoUsersRequest={demoUsers} />
        </Suspense>
    );
}
