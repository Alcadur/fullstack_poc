import { Login } from "@/pages/login/login";
import { userService } from "@/service/user-http.service";

export function meta() {
    return [{ title: "Full stack POC React UI", }];
}

export async function clientLoader() {
    return await userService.getDemoUsers()
}

export default function LoginRoute() {
    return <Login />;
}
