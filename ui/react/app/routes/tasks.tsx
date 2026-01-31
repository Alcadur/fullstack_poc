import { taskHttpService } from "@/service/task-http.service";
import { setTasks } from "@/store/tasks-slice";
import { appStore } from "@/store/app-store";
import { TasksList } from "@/pages/tasks/components/tasks-list/tasks-list";

export async function clientLoader() {
    const tasks = await taskHttpService.getToDoTasks();
    appStore.dispatch(setTasks(tasks));
    return tasks;
}

export default function TasksRoute() {
    return <TasksList />;
}
