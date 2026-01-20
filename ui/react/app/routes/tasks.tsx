import type { Route } from "../../.react-router/types/app/routes/+types/tasks";
import { Tasks } from "@/pages/tasks/tasks";

export async function clientLoader(a: Route.ClientLoaderArgs) {
    console.warn("Missing task loader implementation");
}

export default function TasksRoute() {
  return <Tasks />
}
