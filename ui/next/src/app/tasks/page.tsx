import { taskHttpService } from "@/service/task-http.service";
import { Suspense } from "react";
import { TasksList } from "@/app/tasks/ui/tasks-list";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/utils/consts";

export default async function Tasks() {
    const cookieStore = await cookies();
    const jsessionid = cookieStore.get(SESSION_COOKIE);

    const tasks = taskHttpService.getToDoTasks({
        headers: jsessionid ? {
            Cookie: `${jsessionid.name}=${jsessionid.value}`
        } : {}
    });

    return <Suspense fallback={<div>loading</div>}>
        <TasksList tasksRequest={tasks}/>
    </Suspense>
}
