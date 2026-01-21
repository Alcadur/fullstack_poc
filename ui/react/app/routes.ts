import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    index("routes/login.tsx"),

    layout("./pages/tasks/tasks-layout.tsx", [
        route("/tasks","routes/tasks.tsx")
    ])
] satisfies RouteConfig;
