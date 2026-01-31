import { queryClient } from "@/utils/query-client";
import { httpService } from "@/service/http.service";
import { apiEndpoints } from "@/api-endpoints";
import type { Task } from "@/model/task.model";

class TaskHttpService {
    getToDoTasks() {
        return queryClient.fetchQuery({
            queryKey: ["todo-tasks"],
            queryFn: () => httpService.get(apiEndpoints.TODO_TASKS).then(response => response.json()),
        });
    }

    updateTask(task: Task) {
        return httpService.patch<Task>(
            apiEndpoints.TASK,
            JSON.stringify(task), {
                headers: { "Content-Type": "application/json" }
            }).then(response => response.json());
    }

    addTask(task: Task) {
        return httpService.post<Task>(
            apiEndpoints.TASK,
            JSON.stringify(task), {
                headers: { "Content-Type": "application/json" }
            }
        ).then(response => response.json() as unknown as Task);
    }
}

export const taskHttpService = new TaskHttpService();
