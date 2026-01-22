import { queryClient } from "@/utils/query-client";
import { httpService } from "@/service/http.service";
import { apiEndpoints } from "@/api-endpoints";
import type { ILoginForm } from "@/pages/login/login.model";

class UserHttpService {
    getDemoUsers() {
        return queryClient.fetchQuery({
            queryKey: ['demo-users'],
            queryFn: () => httpService.get(apiEndpoints.DEMO_USERS),
        });
    }

    login(form: ILoginForm) {
        return httpService.post(apiEndpoints.LOGIN, JSON.stringify(form), {
            headers: { 'Content-Type': 'application/json' }
        }).then(response => response.json());
    }

    logout() {
        return httpService.post(apiEndpoints.LOGOUT, null);
    }
}

export const userHttpService = new UserHttpService()
