import { Tasks } from "@/pages/tasks/tasks";
import { userSelector } from "@/store/user-slice";
import { appStore } from "@/store/app-store";
import { taskHttpService } from "@/service/task-http.service";

export async function clientLoader() {
    const user = userSelector(appStore.getState())!;
    return await taskHttpService.getToDoTasksByUserUid(user.uuid);
}

export default function TasksRoute() {
    return <Tasks />;
}
