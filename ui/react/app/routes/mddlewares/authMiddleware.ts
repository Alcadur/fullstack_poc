import { redirect } from "react-router";
import { appStore } from "@/store/app-store";
import { AppRoutes } from "@/routes/app-routes.model";

export const publicRoutes = ['/'];

export async function clientAuthMiddleware(args: any, next: any) {
    const user = appStore.getState().userData?.user;
    const isPublicRoute = publicRoutes.includes(args.unstable_pattern);

    if (!isPublicRoute && !user) {
        throw redirect(AppRoutes.LOGIN);
    }

    await next();
}
