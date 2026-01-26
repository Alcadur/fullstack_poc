import { httpService } from "@/service/http.service";
import { apiEndpoints } from "@/api-endpoints";
import { ILoginForm } from "@/model/login.model";

class UserHttpService {
    getDemoUsers() {
        return httpService.get<User[]>(apiEndpoints.DEMO_USERS).then(response => response.json() as unknown as User[]);
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
