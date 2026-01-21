import { Outlet } from "react-router";

export default function TasksLayout() {
    return (
        <section>
            <nav>Top Navigation Bar</nav>
            <main>
                <Outlet />
            </main>
        </section>
    );
}
