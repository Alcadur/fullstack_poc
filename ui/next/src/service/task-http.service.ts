import { httpService } from "@/service/http.service";
import { apiEndpoints, buildApiUrl } from "@/api-endpoints";
import type { Task } from "@/model/task.model";

class TaskHttpService {
    getToDoTasks(init?: RequestInit) {
        return  httpService.get<Task[]>(apiEndpoints.TODO_TASKS2, init)
            .then(response => response.json() as unknown as Task[]);
    }

    getToDoTasksByUserUid(uuid: string) {
        // return queryClient.fetchQuery({
        //     queryKey: ['todo-tasks-by-user', uuid],
        //     queryFn: () => httpService.get(buildApiUrl(apiEndpoints.TODO_TASKS, { userUuid: uuid })),
        // })
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
