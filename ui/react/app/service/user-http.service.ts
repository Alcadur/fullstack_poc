import { queryClient } from "@/utils/query-client";
import { httpService } from "@/service/http.service";
import { apiEndpoints } from "@/api-endpoints";
import type { ILoginForm } from "@/login/login.model";

class UserService {
    getDemoUsers() {
        return queryClient.fetchQuery({
            queryKey: ['demo-users'],
            queryFn: () => httpService.get(apiEndpoints.DEMO_USERS),
        });
    }

    login(form: ILoginForm) {
        return httpService.post(apiEndpoints.LOGIN, JSON.stringify(form), {
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

export const userService = new UserService()
