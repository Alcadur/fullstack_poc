import { Tasks } from "@/pages/tasks/tasks";
import { taskHttpService } from "@/service/task-http.service";

export async function clientLoader() {
    return await taskHttpService.getToDoTasks();
}

export default function TasksRoute() {
    return <Tasks />;
}
