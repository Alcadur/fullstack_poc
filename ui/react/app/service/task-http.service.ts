import { queryClient } from "@/utils/query-client";
import { httpService } from "@/service/http.service";
import { apiEndpoints, buildApiUrl } from "@/api-endpoints";
import type { Task } from "@/model/task.model";

class TaskHttpService {
    getToDoTasks() {
        return queryClient.fetchQuery({
            queryKey: ['todo-tasks'],
            queryFn: () => httpService.get(apiEndpoints.TODO_TASKS),
        })
    }

    updateTask(task: Task) {
        return httpService.patch<Task>(
            buildApiUrl(apiEndpoints.TASK, { userUuid: task.authorUuid, taskUuid: task.uuid }),
            JSON.stringify(task.completed), {
            headers: { 'Content-Type': 'application/json' }
        }).then(response => response.json());
    }
}

export const taskHttpService = new TaskHttpService()
