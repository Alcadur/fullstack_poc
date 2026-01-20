import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/login.tsx"),
    route("/tasks", "routes/tasks.tsx")
] satisfies RouteConfig;
