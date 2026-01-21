import { queryClient } from "@/utils/query-client";
import { httpService } from "@/service/http.service";
import { apiEndpoints, buildApiUrl } from "@/api-endpoints";

class TaskHttpService {
    getToDoTasksByUserUid(uuid: string) {
        return queryClient.fetchQuery({
            queryKey: ['todo-tasks-by-user', uuid],
            queryFn: () => httpService.get(buildApiUrl(apiEndpoints.TODO_TASKS, { userUuid: uuid })),
        })
    }
}

export const taskHttpService = new TaskHttpService()
